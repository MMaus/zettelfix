import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { remove } from "lodash";

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
    getItem: (state) => {
      return (id: UUID) => state.items.find((it) => it.id == id);
    },
  },
  actions: {
    addItemToWhishlist(id: UUID, qty: number = 1) {
      const existing = this.whishlist.find((it) => it.item == id);
      if (!existing) {
        this.whishlist.push({ item: id, amount: 1 });
      } else {
        existing.amount += 1;
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

export type WhishlistItem = {
  item: UUID;
  amount: number;
};

export type Item = BaseType & {
  // shelves: Array<UUID>;
};
