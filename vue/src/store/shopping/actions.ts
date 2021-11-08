import { ActionContext } from "vuex";
import { JuteBagState } from "../types";
import { User } from "../user/types";
import { RemoteShoppingListState, ShoppingListState } from "./types";

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
    const isLoggedIn = context.rootGetters["user/isLoggedIn"] as boolean;
    if (!isLoggedIn) {
      console.error("User is not logged in, unable to sync");
      context.commit("setSyncState", { syncState: "SYNC_ERROR" });
      return;
    }
    const stringifiedData = JSON.stringify(
      context.getters["remoteDataExcerpt"]
    );
    const user = context.rootGetters["user/user"] as User;
    const postURL = "/bagpy/v2/" + user.email;
    console.log("Pushing data:", stringifiedData);
    console.log("POSTING TO ", postURL);
    fetch(postURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: stringifiedData,
    })
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
    if (!context.rootGetters["user/isLoggedIn"]) {
      console.error("User is not logged in");
      context.commit("setSyncState", { syncState: "SYNC_ERROR" });
      return;
    }
    const user: User = context.rootGetters["user/user"];
    const userEmail = user.email;
    let jsonResponse: RemoteShoppingListState;
    try {
      jsonResponse = await fetch("/bagpy/v2/" + userEmail).then((res) =>
        res.json()
      );
    } catch (e) {
      console.log("Error on download", e);
      context.commit("setSyncState", { syncState: "SYNC_ERROR" });
      return;
    }
    if (jsonResponse) {
      console.log("Received object:", jsonResponse);
      console.log(`There are ${jsonResponse.categories.length} categories`);
      context.commit("setRemoteData", jsonResponse);
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
