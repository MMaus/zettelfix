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
      return state.whishlist
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
      console.log(`PROTOTYPE: creating shelf ${shelfName} for shop ${shopId}`);
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
