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

function setUser(state: AppState, userName: string): void {
  console.log("SETTING USER TO ", userName);
  state.user = userName;
  // FIXME: why does this give a runtime error??
  state.loginTime = 123; //new Date();
  state.loggedIn = true;
}

function logout(state: AppState): void {
  state.loggedIn = false;
  state.user = null;
  state.loginTime = null;
  state.bearerToken = undefined;
  state.refreshToken = undefined;
}

function setTokens(
  state: AppState,
  tokens: { refreshToken: string; bearerToken: string }
): void {
  setBearerToken(state, tokens.bearerToken);
  setRefreshToken(state, tokens.refreshToken);
  console.log(
    "--------------- TOKENS SET TO:",
    tokens,
    tokens.bearerToken,
    tokens.refreshToken
  );
}

function setBearerToken(state: AppState, token: string): void {
  state.bearerToken = token;
}

function setRefreshToken(state: AppState, token: string): void {
  state.refreshToken = token;
}

export default {
  setConsentNow,
  disableShoppingListImport,
  setUser,
  logout,
  setTokens,
} as MutationTree<AppState>;
