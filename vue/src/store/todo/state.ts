import { TodoListState } from "./types";

export function createState(): TodoListState {
  return {
    todoItems: [],
    version: 1,
    nextCategoryId: 1,
    nextItemId: 1,
    syncState: "NOT_SYNCED",
  };
}
