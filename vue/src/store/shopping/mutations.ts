import { MutationTree } from "vuex";
import {
  Category,
  ShoppingListState,
  ShoppingItem,
  SyncState,
  RemoteShoppingListState,
} from "./types";

function isCategoryDone(category: Category): boolean {
  return category.items.every((it) => it.inCart);
}

function computeNextItemId(state: ShoppingListState): void {
  let nextId = state.nextItemId;
  let nextCategoryId = state.nextCategoryId;
  for (const cat of state.categories) {
    try {
      const numCandidate = cat.id?.split("y")[1];
      if (numCandidate != undefined) {
        const higherNumber = Math.ceil(+numCandidate + 1);
        if (higherNumber > nextCategoryId) {
          nextCategoryId = higherNumber;
        }
      }
    } catch (ignored) {
      /* exception is okay, we can safely ignore it*/
    }

    for (const it of cat.items) {
      try {
        const numCandidate = it.id?.split(":")[1];
        if (numCandidate != undefined) {
          const higherNumber = Math.ceil(+numCandidate + 1);
          if (higherNumber > nextId) {
            nextId = higherNumber;
          }
        }
      } catch (ignored) {
        /* exception is okay, we can safely ignore it*/
      }
    }
  }
  console.log("initialized nextItemId = ", nextId);
  console.log("initialized nextCategoryId = ", nextCategoryId);
  state.nextItemId = nextId;
  state.nextCategoryId = nextCategoryId;
}

function createCategory(state: ShoppingListState, name: string): Category {
  const newCategory: Category = {
    id: "category" + state.nextCategoryId,
    catName: name,
    items: [],
    isDone: true,
  };
  state.nextCategoryId = state.nextCategoryId + 1;
  state.categories.push(newCategory);
  return newCategory;
}

function addItem(
  state: ShoppingListState,
  {
    itemName,
    categoryName,
    quantity,
    inCart,
  }: {
    itemName: string;
    categoryName: string;
    quantity?: number;
    inCart?: boolean;
  }
): void {
  let category = state.categories.find((cat) => cat.catName === categoryName);
  if (category === undefined) {
    category = createCategory(state, categoryName);
  }
  const qty = Number.isFinite(quantity) ? quantity : 1;
  const item = {
    id: "item:" + state.nextItemId,
    itemName,
    quantity: qty,
    inCart: inCart ? true : false,
  } as ShoppingItem;
  state.nextItemId = state.nextItemId + 1;
  category.isDone = isCategoryDone(category);
  category.items.push(item);
  if (!item.inCart) {
    category.isDone = false;
  }
  state.syncState = "NOT_SYNCED";
}

/**
 * The item's location in the state is state.categories[<categoryIndex>].items[<itemIndex>].
 * This method computes those indices for a given item.
 * @param state the current ShoppingListState
 * @param itemId id of the item to find
 * @returns the location in form of an object { itemIndex, categoryIndex }
 */
function locateItem(
  state: ShoppingListState,
  itemId: string
): { itemIndex: number; categoryIndex: number } {
  // TODO: this seems so awkward and inefficient. How to improve (ideally without loops)?
  // The problems are that we do the search over the items twice, and continue searching after
  // we found the item. Maybe this indicates an inefficient representation of the data.
  const categoryIndex = state.categories.findIndex(
    (cat) => cat.items.findIndex((it) => it.id === itemId) > -1
  );
  if (categoryIndex < 0) {
    throw new Error(`Item with ID ${itemId} was not in any category`);
  }
  // this will always work because we already found the item (see comment above)
  const itemIndex = state.categories[categoryIndex].items.findIndex(
    (it) => it.id === itemId
  );
  return { itemIndex, categoryIndex };
}

/**
 * gets the reactive proxy for an item
 * @param state
 * @param itemId
 * @returns
 */
function getItem(state: ShoppingListState, itemId: string): ShoppingItem {
  const { categoryIndex, itemIndex } = locateItem(state, itemId);
  return state.categories[categoryIndex].items[itemIndex];
}

function deleteItem(state: ShoppingListState, { itemId }: { itemId: string }) {
  const { itemIndex, categoryIndex } = locateItem(state, itemId);
  state.categories[categoryIndex].items.splice(itemIndex, 1);
  state.syncState = "NOT_SYNCED";
  const category = state.categories[categoryIndex];
  category.isDone = isCategoryDone(category);
  if (state.categories.find((cat) => cat.items.length === 0)) {
    state.categories = state.categories.filter((cat) => cat.items.length > 0);
  }
}

function toggleInCart(
  state: ShoppingListState,
  { itemId }: { itemId: string }
): void {
  const item = getItem(state, itemId);
  item.inCart = !item.inCart;
  const category = state.categories.find((cat) =>
    cat.items.find((it) => it.id === item.id)
  );
  if (category) {
    category.isDone = isCategoryDone(category);
  }
  state.syncState = "NOT_SYNCED";
}

function activateItem(
  state: ShoppingListState,
  { itemId }: { itemId: string }
): void {
  const item = getItem(state, itemId);
  console.log("ITEM:", item);
  if (!item.inCart) {
    item.quantity = item.quantity + 1;
  } else {
    item.inCart = false;
  }
  state.syncState = "NOT_SYNCED";
  const category = state.categories.find((cat) =>
    cat.items.find((it) => it.id === item.id)
  );
  if (category) {
    category.isDone = isCategoryDone(category);
  }
}

function setQuantity(
  state: ShoppingListState,
  { itemId, quantity }: { itemId: string; quantity: number }
): void {
  getItem(state, itemId).quantity = quantity;
  state.syncState = "NOT_SYNCED";
}

function setRemoteData(
  state: ShoppingListState,
  remoteData: RemoteShoppingListState
): void {
  console.log("Received remote data with version:", remoteData.version);
  state.categories = remoteData.categories;
  state.nextCategoryId = remoteData.nextCategoryId;
  state.nextItemId = remoteData.nextItemId;
}

function setSyncState(
  state: ShoppingListState,
  { syncState }: { syncState: SyncState }
): void {
  console.log("SYNC STATE IS ", syncState);
  state.syncState = syncState;
}

function pullCategory(
  state: ShoppingListState,
  { categoryId }: { categoryId: string }
): void {
  const catId = categoryId;
  const index = state.categories.findIndex((cat) => cat.id === catId);
  if (index < 0) {
    throw new Error(`No Category with id '${catId}' found`);
  }
  if (index === 0) {
    // nothing to do
    return;
  }
  const catA = state.categories[index - 1];
  const catB = state.categories[index];
  state.categories[index - 1] = catB;
  state.categories[index] = catA;
}

function pushCategory(
  state: ShoppingListState,
  { categoryId }: { categoryId: string }
): void {
  const catId = categoryId;
  const index = state.categories.findIndex((cat) => cat.id === catId);
  if (index < 0) {
    throw new Error(`No Category with id '${catId}' found`);
  }
  if (index >= state.categories.length - 1) {
    // nothing to do
    return;
  }
  const catA = state.categories[index + 1];
  const catB = state.categories[index];
  state.categories[index + 1] = catB;
  state.categories[index] = catA;
}

export default {
  addItem,
  computeNextItemId,
  createCategory,
  deleteItem,
  setQuantity,
  setRemoteData,
  setSyncState,
  toggleInCart,
  activateItem,
  pullCategory,
  pushCategory,
} as MutationTree<ShoppingListState>;
