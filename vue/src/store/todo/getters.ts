import { TodoListState, SyncState, TodoItem } from "./types";

export default {
  getTodoItems(state: TodoListState): Array<TodoItem> {
    return state.todoItems;
  },

  getRemoteDataExcerpt(state: TodoListState): unknown {
    // This is debug info for a weird chaching behaviour I observed in Vue 2
    // If this works as expected, this debugging information is no longer required
    console.log("RETRIEVING FRESH TODO LIST EXCERPT");
    return {
      todoItems: state.todoItems,
      version: state.version,
      // nextCategoryId: state.nextCategoryId,
      // nextItemId: state.nextItemId,
    };
  },

  syncState(state: TodoListState): SyncState {
    return state.syncState;
  },
};
