import { AppState } from "./types";

export default {
  lastConsent(state: AppState): Date {
    // also serves as fallback if for some reason state.lastConsent is null or undefined,
    // which may happen during initial deserialization
    if (!state.lastConsent) {
      return new Date(0);
    }
    return new Date(state.lastConsent);
  },
  isConsentValid(state: AppState): boolean {
    const dT = Date.now() - (state.lastConsent == null ? 0 : state.lastConsent);
    return dT < 30 * 24 * 3600 * 1000; // consent every 30 days
  },
  enableShoppingListImport(state: AppState): boolean {
    console.log("FOUND VALUE" + state.enableShoppingListImport);
    return state.enableShoppingListImport;
  },
  user(state: AppState): string {
    console.log("GETTING USER = ", state.user, state);
    return state.user || ""; // FIXME: PUT USER IN USER MODULE?, FIXME: refactor 'user' to 'account'
  },
  userLoggedIn(state: AppState): boolean {
    console.log("QUERYING FOR USER LOGGED IN, STATE IS ", state.loggedIn);
    return state.loggedIn;
  },
};
