import { ActionContext } from "vuex";
import { createStoreClient } from "../httpClient";
import { JuteBagState } from "../types";
import { ShoppingListState } from "./types";

// FIXME: provide as generic util function
function prepareStore(
  context: ActionContext<ShoppingListState, JuteBagState>,
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
    context: ActionContext<ShoppingListState, JuteBagState>,
    { itemName, categoryName }: { itemName: string; categoryName: string }
  ): Promise<void> {
    context.commit("addItem", { itemName, categoryName });
  },

  async activateItem(
    context: ActionContext<ShoppingListState, JuteBagState>,
    { itemId, categoryId }: { itemId: string; categoryId: string }
  ): Promise<void> {
    context.commit("activateItem", { itemId, categoryId });
  },

  async updateQuantity(
    context: ActionContext<ShoppingListState, JuteBagState>,
    { itemId, quantity }: { itemId: string; quantity: number }
  ): Promise<void> {
    context.commit("setQuantity", { itemId, quantity });
  },

  async toggleInCart(
    context: ActionContext<ShoppingListState, JuteBagState>,
    { itemId }: { itemId: string }
  ): Promise<void> {
    context.commit("toggleInCart", { itemId });
  },

  async deleteItem(
    context: ActionContext<ShoppingListState, JuteBagState>,
    { itemId }: { itemId: string }
  ): Promise<void> {
    context.commit("deleteItem", { itemId });
  },

  async uploadItems(
    context: ActionContext<ShoppingListState, JuteBagState>
  ): Promise<void> {
    context.commit("setSyncState", { syncState: "SYNCING" });
    const api = prepareStore(context, "shoppingbag");
    if (!api.valid) {
      context.commit("setSyncState", { syncState: "SYNC_ERROR" });
      return;
    }
    // const stringifiedData = JSON.stringify(
    //   context.getters["remoteDataExcerpt"]
    // );
    // console.log("Pushing data:", stringifiedData);
    console.log("POSTING TO ", api.url);
    const httpClient = createStoreClient(
      context.rootGetters,
      (mutation: string, data: any) =>
        context.commit(mutation, data, { root: true })
    );
    httpClient
      .PUT(api.url, context.getters["remoteDataExcerpt"], "JSON")
      // fetch(api.url, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: stringifiedData,
      // })
      .then((res) => res.json())
      .then((json) => {
        console.log("received POST result:" + JSON.stringify(json));
        context.commit("setSyncState", { syncState: "SYNC" });
      })
      .catch((err) => {
        console.log("POST error: " + err);
        context.commit("setSyncState", { syncState: "SYNC_ERROR" });
      });
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    // context.commit("setSyncState", { syncState: "SYNC" });
  },

  async downloadItems(
    context: ActionContext<ShoppingListState, JuteBagState>
  ): Promise<void> {
    context.commit("setSyncState", { syncState: "SYNCING" });
    const api = prepareStore(context, "shoppingbag");
    if (!api.valid) {
      context.commit("setSyncState", { syncState: "SYNC_ERROR" });
      return;
    }
    let jsonResponse: {
      shoppingbag: {
        key: string;
        user: unknown;
        content: string;
      };
    };

    try {
      const httpClient = createStoreClient(
        context.rootGetters,
        (mutation: string, data: any) =>
          context.commit(mutation, data, { root: true })
      );
      jsonResponse = await httpClient.GET(api.url).then((res) => res.json());
    } catch (e) {
      console.log("Error on download", e);
      context.commit("setSyncState", { syncState: "SYNC_ERROR" });
      return;
    }
    if (jsonResponse) {
      const content = JSON.parse(jsonResponse.shoppingbag.content);
      console.log("Received object:", content);
      console.log(`There are ${content.categories.length} categories`);
      context.commit("setRemoteData", content);
      context.commit("computeNextItemId");
      context.commit("setSyncState", { syncState: "SYNC" });
    }
  },

  async pullCategory(
    context: ActionContext<ShoppingListState, JuteBagState>,
    { categoryId }: { categoryId: string }
  ): Promise<void> {
    context.commit("pullCategory", { categoryId });
  },

  async pushCategory(
    context: ActionContext<ShoppingListState, JuteBagState>,
    { categoryId }: { categoryId: string }
  ): Promise<void> {
    context.commit("pushCategory", { categoryId });
  },
};
