import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { remove } from "lodash";

export type UUID = string;

type BaseType = {
  id: UUID;
  name: string;
};

export type Shop = BaseType & {
  shelves: Array<UUID>;
};

export type Shelf = BaseType & {
  items: Array<UUID>;
};

const asIndexObject = <T extends BaseType>(objectList: T[]) => {
  return Object.fromEntries(objectList.map((it) => [it.id, it]));
};

// Note: not exported => ~Preview and ~View are more appropriate for rendering
type WhishlistItem = {
  id: UUID;
  item: UUID;
  amount: number;
};

export type WhishlistItemPreview = {
  amount: number;
  item: Item;
};

export type WhishlistItemView = WhishlistItemPreview & {
  id: UUID;
  shopNames: string[];
};

export type Item = BaseType & {
  // shelves: Array<UUID>;
};

export type ItemSummary = Item & {
  shelves: ShelfReference[];
  shops: Shop[];
};

// references a single shelf within a single shop
export type ShelfReference = Shelf & {
  shop: Shop;
};

type ShoppingState = {
  shops: Shop[];
  items: Item[];
  shelves: Shelf[];
  whishlist: WhishlistItem[];
};

const getShopMap = (state: ShoppingState): Map<UUID, Shop[]> => {
  const shelfMap = new Map<UUID, Shop[]>(); // maps shelf to list of shops
  for (const shop of state.shops) {
    for (const shelfId of shop.shelves) {
      if (!shelfMap.has(shelfId)) {
        shelfMap.set(shelfId, []);
      }
      shelfMap.get(shelfId)?.push(shop);
    }
  }

  const shopMap = new Map<UUID, Shop[]>();
  for (const shelf of state.shelves) {
    const shops = shelfMap.get(shelf.id) || [];
    for (const itemid of shelf.items) {
      if (!shopMap.has(itemid)) {
        shopMap.set(itemid, []);
      }
      shops.forEach((shop) => {
        shopMap.get(itemid)?.push(shop);
      });
    }
  }

  return shopMap;
};

const getShelfReferences = (state: ShoppingState): ShelfReference[] => {
  const shelfData = asIndexObject(state.shelves);
  const getShelfReferenceForShelf = (
    shelf: Shelf,
    shop: Shop
  ): ShelfReference => {
    return {
      id: shelf.id,
      items: shelf.items,
      name: shelf.name,
      shop: shop,
    };
  };
  const getShelfReferencesForShop = (shop: Shop): ShelfReference[] => {
    return shop.shelves
      .map((shelfId) => {
        return shelfData[shelfId];
      })
      .filter((it) => !!it) // orphaned shelf IDs may occur in corrupted data
      .map((shelf) => getShelfReferenceForShelf(shelf, shop));
  };

  return state.shops.flatMap(getShelfReferencesForShop);
};

export const useShoppingStore = defineStore({
  id: "shoppingStore",
  state: () => ({
    shops: [] as Shop[],
    items: [] as Item[],
    shelves: [] as Shelf[],
    whishlist: [] as WhishlistItem[],
  }),
  getters: {
    getShelves:
      (state) =>
      (shopId: UUID): Shelf[] => {
        const shop = state.shops.find((s) => s.id === shopId);
        if (!shop) {
          return [];
        }
        return state.shelves.filter((shelf) => shop.shelves.includes(shelf.id));
      },
    getItem(state) {
      return (id: UUID) => state.items.find((it) => it.id == id);
    },
    getOrphanedShelves(state) {
      const associatedShelves = new Set(
        state.shops.flatMap((it) => it.shelves)
      );
      const orphanedShelves = state.shelves.filter(
        (it) => !associatedShelves.has(it.id)
      );
      orphanedShelves.sort((s1, s2) => s1.name.localeCompare(s2.name));
      return orphanedShelves;
    },
    whishlistItems(state): WhishlistItemView[] {
      const itemMap = Object.fromEntries(state.items.map((it) => [it.id, it]));
      const shopMap = getShopMap(state);
      const whishlist = state.whishlist
        .filter((it) => itemMap.hasOwnProperty(it.item))
        .map((it) => {
          const shops = shopMap.get(it.item);
          const shopNames = shops?.map((sh) => sh.name) || [];
          shopNames.sort();

          return {
            amount: it.amount,
            id: it.id,
            item: itemMap[it.item],
            shopNames: shopNames,
          };
        });
      whishlist.sort((w1, w2) =>
        w1.item.name
          .toLocaleLowerCase()
          .localeCompare(w2.item.name.toLocaleLowerCase())
      );
      return whishlist;
    },
    whishlistItemCandidates(state): WhishlistItemPreview[] {
      const whishlistAmount = Object.fromEntries(
        state.whishlist.map((it) => [it.item, it.amount])
      );
      return state.items.map((it) => {
        const amount = whishlistAmount[it.id] || 0;
        return {
          amount,
          item: it,
        };
      });
    },

    itemsSummary(state: ShoppingState): ItemSummary[] {
      const shelfReferences = getShelfReferences(state);
      const mapToFullItem = (it: Item) => {
        const shelves = shelfReferences.filter((shelf) =>
          shelf.items.includes(it.id)
        );
        const shops = shelves.map((shelf) => shelf.shop);
        return {
          id: it.id,
          name: it.name,
          shelves,
          shops,
        };
      };

      return this.items.map(mapToFullItem);
    },

    shopsSummary(state: ShoppingState) {
      const shelfData = Object.fromEntries(
        state.shelves.map((it) => [
          it.id,
          isFinite(it.items.length) ? it.items.length : 0,
        ])
      );
      console.log("shelfData:", shelfData);
      const getItemCount = (shop: Shop) => {
        return shop.shelves
          .map((shelfId) => {
            console.log(
              `ShelfData for shop ${shop.name} -${shelfId}-`,
              shelfData[shelfId]
            );

            return shelfData[shelfId] || 0;
          })
          .reduce((a, b) => a + b, 0);
      };
      return state.shops.map((shop) => {
        return {
          id: shop.id,
          name: shop.name,
          itemCount: getItemCount(shop),
        };
      });
    },
  },
  actions: {
    setWhishlistItem(id: UUID, qty: number) {
      const indexOfItem = this.whishlist.findIndex((it) => it.item == id);
      if (qty <= 0 && indexOfItem >= 0) {
        this.whishlist.splice(indexOfItem, 1);
      } else {
        let item: WhishlistItem | undefined;
        if (indexOfItem >= 0) {
          item = this.whishlist[indexOfItem];
          this.whishlist[indexOfItem].amount = qty;
        } else {
          this.whishlist.push({ id: uuidv4(), item: id, amount: qty });
        }
      }
    },

    createShop(name: string) {
      const newShop: Shop = {
        name,
        id: uuidv4(),
        shelves: [],
      };
      this.shops.push(newShop);
    },
    deleteShop(id: UUID) {
      for (let idx = 0; idx < this.shops.length; idx++) {
        if (this.shops[idx].id === id) {
          this.shops.splice(idx, 1);
          break;
        }
      }
    },
    deleteShelf(shelfId: UUID) {
      const index = this.shelves.findIndex((shelf) => shelf.id == shelfId);
      if (index >= 0) {
        this.shelves.splice(index, 1);
      }
    },
    addShelf(shopId: UUID, shelfName: string) {
      // TODO: make this proper, distinguish between creating new shelf and adding existing shelf!
      const shop = this.shops.find((s) => s.id === shopId);
      if (!shop) {
        throw new Error(`no shop with id ${shopId} found!`);
      }
      const shelf: Shelf = {
        id: uuidv4(),
        name: shelfName,
        items: [],
      };
      this.shelves.push(shelf);
      shop.shelves.push(shelf.id);
    },
    deleteShelfFromShop(shelfId: UUID, shopId: UUID) {
      const shop = this.shops.find((s) => s.id === shopId);
      if (!shop) {
        throw new Error(`no shop with id ${shopId} found!`);
      }
      remove(shop.shelves, (id) => id === shelfId);
    },
    // TODO: delete orphaned shelf
    createItem(itemName: string, shelves: UUID[]) {
      const item: Item = {
        id: uuidv4(),
        name: itemName,
      };
      this.items.push(item);
      shelves.forEach((it) => this.addItemToShelf(item.id, it));
    },
    addItemToShelf(itemId: UUID, shelfId: UUID) {
      this.shelves.find((it) => it.id == shelfId)?.items.push(itemId);
    },
  },
  persist: true,
});
