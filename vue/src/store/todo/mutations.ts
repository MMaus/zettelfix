import { MutationTree } from "vuex";
import {
  TodoListState,
  TodoItem,
  SyncState,
  RemoteTodoListState,
} from "./types";

function computeNextItemId(state: TodoListState): void {
  // let nextId = state.nextItemId;
  // let nextCategoryId = state.nextCategoryId;
  // for (const cat of state.todoItems) {
  //   try {
  //     const numCandidate = cat.id?.split("y")[1];
  //     if (numCandidate != undefined) {
  //       const higherNumber = Math.ceil(+numCandidate + 1);
  //       if (higherNumber > nextCategoryId) {
  //         nextCategoryId = higherNumber;
  //       }
  //     }
  //   } catch (ignored) {
  //     /* exception is okay, we can safely ignore it*/
  //   }
  //   for (const it of cat.taskList) {
  //     try {
  //       const numCandidate = it.id?.split(":")[1];
  //       if (numCandidate != undefined) {
  //         const higherNumber = Math.ceil(+numCandidate + 1);
  //         if (higherNumber > nextId) {
  //           nextId = higherNumber;
  //         }
  //       }
  //     } catch (ignored) {
  //       /* exception is okay, we can safely ignore it*/
  //     }
  //   }
  // }
  // console.log("initialized nextItemId = ", nextId);
  // console.log("initialized nextCategoryId = ", nextCategoryId);
  // state.nextItemId = nextId;
  // state.nextCategoryId = nextCategoryId;
}

// function createCategory(state: TodoListState, name: string): TodoTask {
//   const newCategory: TodoTask = {
//     id: "category" + state.nextCategoryId,
//     catName: name,
//     items: [],
//     isDone: true,
//   };
//   state.nextCategoryId = state.nextCategoryId + 1;
//   state.todoItems.push(newCategory);
//   return newCategory;
// }

function addItem(state: TodoListState, todoItem: TodoItem): void {
  state.todoItems.push(todoItem);
  // let category = state.categories.find((cat) => cat.catName === categoryName);
  // if (category === undefined) {
  //   category = createCategory(state, categoryName);
  // }
  // const qty = Number.isFinite(quantity) ? quantity : 1;
  // const item = {
  //   id: "item:" + state.nextItemId,
  //   itemName,
  //   quantity: qty,
  //   inCart: inCart ? true : false,
  // } as ShoppingItem;
  // state.nextItemId = state.nextItemId + 1;
  // category.isDone = isCategoryDone(category);
  // category.items.push(item);
  // if (!item.inCart) {
  //   category.isDone = false;
  // }
  state.syncState = "NOT_SYNCED";
}

function deleteItem(state: TodoListState, { itemId }: { itemId: string }) {
  // const { itemIndex, categoryIndex } = locateItem(state, itemId);
  // state.categories[categoryIndex].items.splice(itemIndex, 1);
  // state.syncState = "NOT_SYNCED";
  // const category = state.categories[categoryIndex];
  // category.isDone = isCategoryDone(category);
  // if (state.categories.find((cat) => cat.items.length === 0)) {
  //   state.categories = state.categories.filter((cat) => cat.items.length > 0);
  // }
}

function setRemoteData(
  state: TodoListState,
  remoteData: RemoteTodoListState
): void {
  console.log("Received remote data with version:", remoteData.version);
  // state.categories = remoteData.categories;
  state.nextCategoryId = remoteData.nextCategoryId;
  state.nextItemId = remoteData.nextItemId;
}

function setSyncState(
  state: TodoListState,
  { syncState }: { syncState: SyncState }
): void {
  console.log("SYNC STATE IS ", syncState);
  state.syncState = syncState;
}

export default {
  addItem,
  computeNextItemId,
  deleteItem,
  setRemoteData,
  setSyncState,
} as MutationTree<TodoListState>;
