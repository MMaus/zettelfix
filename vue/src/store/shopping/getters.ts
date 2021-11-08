import {
  Category,
  itemSorter,
  ShoppingItem,
  ShoppingListState,
  SyncState,
} from "./types";

export default {
  categories(state: ShoppingListState): Array<Category> {
    return state.categories;
  },
  remoteDataExcerpt(state: ShoppingListState) {
    // This is debug info for a weird chaching behaviour I observed in Vue 2
    // If this works as expected, this debugging information is no longer required
    console.log("RETRIEVING FRESH EXCERPT");
    return {
      categories: state.categories,
      version: state.version,
      nextCategoryId: state.nextCategoryId,
      nextItemId: state.nextItemId,
    };
  },
  allItems(state: ShoppingListState): Array<ShoppingItem> {
    return state.categories.flatMap((cat) => cat.items).sort(itemSorter);
  },

  itemsByCategory(
    state: ShoppingListState
  ): (arg0: string) => Array<ShoppingItem> {
    return (id: string) =>
      state.categories.find((category) => category.id === id)?.items || [];
  },
  syncState(state: ShoppingListState): SyncState {
    return state.syncState;
  },
};
