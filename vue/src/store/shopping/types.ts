export type SyncState = "SYNC" | "SYNCING" | "NOT_SYNCED" | "SYNC_ERROR";

export interface RemoteShoppingListState {
  categories: Array<Category>;
  version: number;
  nextCategoryId: number;
  nextItemId: number;
}

export interface ShoppingListState extends RemoteShoppingListState {
  syncState: SyncState;
}

export interface Category {
  id: string;
  catName: string;
  items: Array<ShoppingItem>;
  isDone: boolean;
}

export interface ShoppingItem {
  id:
    | string
    | null
    | undefined /* ONLY null or undefined when adding to the store */;
  itemName: string;
  quantity: number;
  inCart: boolean;
}
export const itemSorter: (a: ShoppingItem, b: ShoppingItem) => number = (
  a,
  b
) => {
  return a.itemName
    .trim()
    .toLowerCase()
    .localeCompare(b.itemName.trim().toLowerCase());
};
