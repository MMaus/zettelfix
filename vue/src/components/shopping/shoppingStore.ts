import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useShoppingStore = defineStore({
  id: "shoppingStore",
  state: () => ({
    shops: [] as Shop[],
    items: [] as Item[],
    shelves: [] as Shelf[],
  }),
  actions: {
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
  },
  persist: true,
});

export type UUID = string;

type BaseType = {
  id: UUID;
  name: string;
};

export type Shelf = BaseType & {
  shops: Array<UUID>;
};

export type Shop = BaseType & {
  shelves: Array<UUID>;
};

export type Item = BaseType & {
  shelves: Array<UUID>;
};
