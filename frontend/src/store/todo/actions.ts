import { TodoItem } from "@/use/localApi";
import { ActionContext } from "vuex";
import { createStoreClient } from "../httpClient";
import { JuteBagState } from "../types";
import { TodoListState } from "./types";

// FIXME: provide as generic util function
function prepareStore(
  context: ActionContext<TodoListState, JuteBagState>,
  storeKey: string
): { valid: boolean; url: string } {
  const result = { valid: false, url: "" };
  const isLoggedIn = context.rootGetters["app/userLoggedIn"] as boolean;
  if (!isLoggedIn) {
    console.error("User is not logged in, unable to sync");
    context.commit("setSyncState", { syncState: "SYNC_ERROR" });
    return result;
  }
  const user = context.rootGetters["app/user"] as string;
  const url = "/clob-storage/" + encodeURI(user) + "/" + storeKey;
  return { valid: true, url };
}

export default {
  /**
   * Adds (creates) the item and a corresponding category if it does not exist.
   * If the item is added,
   *
   * @param context
   * @param args description of the category, of type {itemName, categoryName}
   */
  async addItem(
    context: ActionContext<TodoListState, JuteBagState>,
    { itemName, categoryName }: { itemName: string; categoryName: string }
  ): Promise<void> {
    context.commit("addItem", { itemName, categoryName });
  },

  async activateItem(
    context: ActionContext<TodoListState, JuteBagState>,
    { itemId, categoryId }: { itemId: string; categoryId: string }
  ): Promise<void> {
    context.commit("activateItem", { itemId, categoryId });
  },

  async updateQuantity(
    context: ActionContext<TodoListState, JuteBagState>,
    { itemId, quantity }: { itemId: string; quantity: number }
  ): Promise<void> {
    context.commit("setQuantity", { itemId, quantity });
  },

  async deleteItem(
    context: ActionContext<TodoListState, JuteBagState>,
    { itemId }: { itemId: string }
  ): Promise<void> {
    context.commit("deleteTodoTask", { itemId });
  },

  addTodoTask(
    context: ActionContext<TodoListState, JuteBagState>,
    data: {
      todoLabel: string;
      taskLabel: string;
    }
  ): void {
    context.commit("addTask", data);
  },

  raiseTask(
    context: ActionContext<TodoListState, JuteBagState>,
    data: { todoLabel: string; taskLabel: string }
  ): void {
    context.commit("raiseTask", data);
  },

  createTodoItem(
    context: ActionContext<TodoListState, JuteBagState>,
    newItemLabel: string
  ): void {
    const newItem = {
      label: newItemLabel,
      nextActionTime: new Date(),
      taskList: [],
    } as TodoItem;
    context.commit("addTodoItem", newItem);
  },

  deleteTodoItem(
    context: ActionContext<TodoListState, JuteBagState>,
    todoLabel: string
  ): void {
    context.commit("deleteTodoItem", todoLabel);
  },

  deleteTodoTask(
    context: ActionContext<TodoListState, JuteBagState>,
    data: { todoLabel: string; taskLabel: string }
  ): void {
    context.commit("deleteTodoTask", data);
  },

  changeDate(
    context: ActionContext<TodoListState, JuteBagState>,
    data: { todoLabel: string; newDate: Date }
  ): void {
    context.commit("changeDate", data);
  },

  async upload(
    context: ActionContext<TodoListState, JuteBagState>
  ): Promise<void> {
    context.commit("setSyncState", { syncState: "SYNCING" });
    const api = prepareStore(context, "todolist");
    if (!api.valid) {
      context.commit("setSyncState", { syncState: "SYNC_ERROR" });
      return;
    }
    const stringifiedData = JSON.stringify(
      context.getters["getRemoteDataExcerpt"]
    );
    // console.log("Pushing data:", stringifiedData);
    console.log("PUTTING TO TO ", api.url);
    const httpClient = createStoreClient(
      context.rootGetters,
      (mutation: string, data: any) =>
        context.commit(mutation, data, { root: true })
    );
    console.log(
      "remote date excerpt:",
      context.getters["getRemoteDataExcerpt"]
    );
    httpClient
      .PUT(api.url, context.getters["getRemoteDataExcerpt"], "JSON")
      // fetch(api.url, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: stringifiedData,
      // })
      .then((res) => res.json())
      .then((json) => {
        console.log("received PUT result:" + JSON.stringify(json));
        context.commit("setSyncState", { syncState: "SYNC" });
      })
      .catch((err) => {
        console.log("POST error: " + err);
        context.commit("setSyncState", { syncState: "SYNC_ERROR" });
      });
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // context.commit("setSyncState", { syncState: "SYNC" });
  },

  async download(
    context: ActionContext<TodoListState, JuteBagState>
  ): Promise<void> {
    context.commit("setSyncState", { syncState: "SYNCING" });
    const api = prepareStore(context, "todolist");
    if (!api.valid) {
      context.commit("setSyncState", { syncState: "SYNC_ERROR" });
      return;
    }
    let jsonResponse: {
      todolist: {
        key: string;
        user: unknown;
        content: string;
      };
    };

    const httpClient = createStoreClient(
      context.rootGetters,
      (mutation: string, data: any) =>
        context.commit(mutation, data, { root: true })
    );
    try {
      console.log("===========================API URL =", api.url);
      jsonResponse = await httpClient.GET(api.url).then((res) => res.json());
      // jsonResponse = await fetch(api.url).then((res) => res.json());
    } catch (e) {
      console.log("Error on download", e);
      context.commit("setSyncState", { syncState: "SYNC_ERROR" });
      return;
    }
    if (jsonResponse) {
      const content = JSON.parse(jsonResponse.todolist.content);
      console.log("Received object:", content);
      context.commit("setRemoteData", content);
      context.commit("setSyncState", { syncState: "SYNC" });
    }
  },
};
