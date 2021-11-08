import { ShoppingListState } from "./types";

export function createState(): ShoppingListState {
  return {
    categories: [],
    version: 1,
    nextCategoryId: 1,
    nextItemId: 1,
    syncState: "NOT_SYNCED",
  };
}
