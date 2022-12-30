import { TodoListState, SyncState, TodoItem } from "./types";

function getRemainingSeconds(item: TodoItem) {
  console.log("Remaining seconds of {}", item);
  return Math.round(
    Math.round(new Date(item.nextActionTime).getTime() - Date.now()) / 1000
  );
}

export default {
  getTodoItems(state: TodoListState): Array<TodoItem> {
    return state.todoItems;
  },

  getDueItems(state: TodoListState): Array<TodoItem> {
    return state.todoItems.filter((it) => {
      const remainingSeconds = getRemainingSeconds(it);
      return remainingSeconds < 0 && remainingSeconds > -24 * 60 * 60;
    });
  },

  getOverdueItems(state: TodoListState): Array<TodoItem> {
    return state.todoItems.filter((it) => {
      const remainingSeconds = getRemainingSeconds(it);
      return remainingSeconds < -24 * 60 * 60;
    });
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
