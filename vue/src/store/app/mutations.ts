import { MutationTree } from "vuex";
import { AppState } from "./types";

function setConsentNow(state: AppState): void {
  state.lastConsent = Date.now();
  console.log("consent set!");
}

function disableShoppingListImport(state: AppState): void {
  state.enableShoppingListImport = false;
  console.log("shoppinglist import disabled!");
}

export default {
  setConsentNow,
  disableShoppingListImport,
} as MutationTree<AppState>;
