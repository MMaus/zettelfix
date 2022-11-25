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
