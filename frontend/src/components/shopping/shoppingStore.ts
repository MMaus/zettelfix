import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { remove } from "lodash";

export type UUID = string;

type Identifyable = {
  id: UUID;
};

type BaseType = Identifyable & {
  name: string;
};

export type Shop = BaseType & {
  shelves: Array<UUID>;
  includeOrphanedItems: boolean;
};

export type Shelf = BaseType & {
  items: Array<UUID>;
};

export type ShoppingShelfPreview = BaseType & {
  items: WhishlistItemPreview[];
};

const asIndexObject = <T extends Identifyable>(objectList: T[]) => {
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
  shelves: ShelfReference[];
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

export type ShopSummary = {
  id: UUID;
  name: string;
  shoppingItemCount: number;
  whishlistItemCount: number;
};

type ShoppingState = {
  shops: Shop[];
  items: Item[];
  shelves: Shelf[];
  whishlist: WhishlistItem[];
};

// having a unilateral relation e.g. from shelf to item sometimes require the
// reverse loop-up: given an item, find all shelves
const getLookupMap = <K>(
  parents: K[],
  childIdExtractor: (parent: K) => UUID[]
): Map<UUID, K[]> => {
  const childToParentMap = new Map<UUID, K[]>();
  for (const parent of parents) {
    for (const childId of childIdExtractor(parent)) {
      if (!childToParentMap.has(childId)) {
        childToParentMap.set(childId, []);
      }
      childToParentMap.get(childId)?.push(parent);
    }
  }
  return childToParentMap;
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

const getFilteredItems = (
  state: ShoppingState,
  it: Shelf
): WhishlistItemPreview[] => {
  const itemData = asIndexObject(state.items);
  return state.whishlist
    .filter((wi) => it.items.includes(wi.item))
    .map((wi) => {
      const item = itemData[wi.item];
      const itemName = item?.name || "NOT FOUND";
      console.log(`Processing ${wi.id} -> ${wi.item} : ${itemName}`);

      return {
        id: wi.id,
        item: itemData[wi.item],
        amount: wi.amount,
      } as WhishlistItemPreview;
    });
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
    shoppingShelvesPreview(state) {
      return (shopId: UUID): ShoppingShelfPreview[] => {
        // const whishlistItemData = asIndexObject(state.whishlist);
        const shelves = this.getShelves(shopId)
          .map((shelf) => {
            return {
              id: shelf.id,
              name: shelf.name,
              items: getFilteredItems(state, shelf),
            } as ShoppingShelfPreview;
          })
          .filter((it) => it.items.length > 0);
        return shelves;
      };
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
      // const itemMap = Object.fromEntries(state.items.map((it) => [it.id, it]));
      const itemMap = asIndexObject(state.items);

      const shelfReferences = getShelfReferences(state);
      const shelvesMap = asIndexObject(shelfReferences);

      const itemsToShelf = getLookupMap(state.shelves, (shelf) => shelf.items);

      const whishlist = state.whishlist
        .filter((it) => itemMap.hasOwnProperty(it.item))
        .map((it) => {
          const shelves = (itemsToShelf.get(it.item) || []).map(
            (shelf) => shelvesMap[shelf.id] || []
          );
          shelves.sort((s1, s2) =>
            s1.shop.name
              .toLocaleLowerCase()
              .localeCompare(s2.shop.name.toLocaleLowerCase())
          );
          // const shops = shopMap.get(it.item);
          // const shopNames = shops?.map((sh) => sh.name) || [];
          // shopNames.sort();

          return {
            amount: it.amount,
            id: it.id,
            item: itemMap[it.item],
            shelves,
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

    shopsSummary(state: ShoppingState): ShopSummary[] {
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
      const shelfReferences = getShelfReferences(state);
      // ShoppingItem-IDs of item in the whishlist
      const whishlistItemIds = state.whishlist.map((it) => it.item);
      const getShoppingItemIdsOnWhishlist = (shop: Shop) =>
        shelfReferences
          .filter((it) => it.shop.id == shop.id)
          .flatMap((it) => it.items)
          .filter((it) => whishlistItemIds.includes(it));
      return state.shops.map((shop) => {
        return {
          id: shop.id,
          name: shop.name,
          shoppingItemCount: getItemCount(shop),
          whishlistItemCount: getShoppingItemIdsOnWhishlist(shop).length,
        };
      });
    },
  },
  actions: {
    setIncludeOrphanedItems(shop: Shop, include: boolean) {
      const reactiveShop = this.shops.find((s) => s.id === shop.id);
      if (!reactiveShop) {
        return; // should never happen, just make Typescript compiler happy
      }
      reactiveShop.includeOrphanedItems = include;
    },
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
        includeOrphanedItems: true,
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
