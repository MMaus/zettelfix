export type SyncState = "SYNC" | "SYNCING" | "NOT_SYNCED" | "SYNC_ERROR";

export interface RemoteTodoListState {
  todoItems: Array<TodoItem>;
  version: number;
  nextCategoryId: number;
  nextItemId: number;
}

export interface TodoListState extends RemoteTodoListState {
  syncState: SyncState;
}

/**
 * A topic to be done adds context to an enclosed list of tasks
 */
export enum TaskStatus {
  TODO,
  DONE,
}

export interface TodoTask {
  label: string;
  status: TaskStatus;
}

export interface TodoItem {
  taskList: Array<TodoTask>;
  nextActionTime: Date;
  label: string;
}
