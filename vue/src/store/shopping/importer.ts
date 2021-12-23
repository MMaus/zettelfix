import { ItemRepository } from "@/use/itemStore";

import { Category, ShoppingItem } from "./types";
import { Category as OldCat } from "@/use/localApi";

function importState(): Array<Category> {
  const itemStore = new ItemRepository("jutebag.shoppinglist");

  const newCategories: Array<Category> = [];

  // fixme: create proper ID, compatible with store (fetch from store)!
  // items: itemStore.itemsRef;
  for (const category of itemStore.categoriesReactive) {
    const oldCategory: OldCat = category;
    const newCategory: Category = {
      id: "category-" + oldCategory.id,
      items: [],
      catName: oldCategory.name,
      isDone: true,
    };
    itemStore.itemsRef.value
      .filter((it) => it.category === oldCategory.name)
      .map((it) => {
        return {
          id: "itemid-" + it.id,
          itemName: it.name,
          quantity: it.qty,
          inCart: it.stored,
        } as ShoppingItem;
      })
      .forEach((it) => newCategory.items.push(it));
    newCategories.push(newCategory);
  }
  return newCategories;
}

export { importState };
