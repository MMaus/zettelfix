import { MutationTree } from "vuex";
import {
  TodoListState,
  TodoItem,
  SyncState,
  RemoteTodoListState,
  TaskStatus,
} from "./types";

import _ from "lodash";

function addTask(
  state: TodoListState,
  data: {
    todoLabel: string;
    taskLabel: string;
  }
): void {
  const index = _.findIndex(
    state.todoItems,
    (it) => it.label.trim() === data.todoLabel.trim()
  );
  if (index < 0) {
    console.error("Unable to locate todo item with label ", data.todoLabel);
    return;
  }
  state.todoItems[index].taskList.push({
    label: data.taskLabel,
    status: TaskStatus.TODO,
  });
}

function deleteTodoItem(state: TodoListState, todoLabel: string): void {
  _.remove(state.todoItems, (it) => it.label.trim() === todoLabel.trim());
}

function changeDate(
  state: TodoListState,
  data: { todoLabel: string; newDate: Date }
): void {
  const index = _.findIndex(
    state.todoItems,
    (it) => it.label.trim() === data.todoLabel.trim()
  );
  if (index < 0) {
    console.error("Unable to locate todo item with label ", data.todoLabel);
    return;
  }
  state.todoItems[index].nextActionTime = data.newDate;
}

function raiseTask(
  state: TodoListState,
  data: { todoLabel: string; taskLabel: string }
): void {
  const index = _.findIndex(
    state.todoItems,
    (it) => it.label.trim() === data.todoLabel.trim()
  );
  if (index < 0) {
    console.error("Unable to locate todo item with label ", data.todoLabel);
    return;
  }
  const todoTask = state.todoItems[index];
  console.log(`raising ${todoTask.label} / ${data.taskLabel}`);
  const taskListCopy = [...todoTask.taskList];
  const raisedTasks = _.remove(
    taskListCopy,
    (it) => it.label.trim() === data.taskLabel.trim()
  );
  console.log("RAISED TASKS:", raisedTasks);
  const newTaskList = _.concat(raisedTasks, ...taskListCopy);
  console.log("NEW TASK LIST:", newTaskList);
  todoTask["taskList"] = newTaskList;
}

function addTodoItem(state: TodoListState, todoItem: TodoItem): void {
  console.log("ADDING ITEM ", todoItem);
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

function deleteTodoTask(
  state: TodoListState,
  data: { todoLabel: string; taskLabel: string }
) {
  const index = _.findIndex(
    state.todoItems,
    (it) => it.label.trim() === data.todoLabel.trim()
  );
  if (index < 0) {
    console.error("Unable to locate todo item with label ", data.todoLabel);
    return;
  }
  _.remove(
    state.todoItems[index].taskList,
    (it) => it.label.trim() === data.taskLabel.trim()
  );
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
  addTodoItem,
  addTask,
  changeDate,
  deleteTodoItem,
  deleteTodoTask,
  raiseTask,
  setRemoteData,
  setSyncState,
} as MutationTree<TodoListState>;
