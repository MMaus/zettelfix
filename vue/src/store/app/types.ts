export interface AppState {
  // has to be "number", otherwise restoring won't work with the persistence module,
  // at least not out-of-the-box
  // TODO: check if vuex-persist supports deserialization into (Date) objects
  lastConsent: number;
  user: string | null;
  loggedIn: boolean;
  loginTime: number | null;
  enableShoppingListImport: boolean;
}
