import { createStore, Store } from "vuex";
import shopping from "./shopping";
import todo from "./todo";
import user from "./user";
import app from "./app";
import { JuteBagState } from "./types";

import "@mdi/font/css/materialdesignicons.min.css";
import VuexPersistence from "vuex-persist";
const vuexLocal = new VuexPersistence<JuteBagState>({
  storage: window.localStorage,
  reducer: (state) => ({
    app: (() => {
      const appState = Object.assign({}, state.app);
      appState.bearerToken = undefined;
      return appState;
    })(),
    shopping: state.shopping,
    todo: state.todo,
  }), // remove this reducer to store the entire state
});

export default function (): Store<JuteBagState> {
  return createStore({
    modules: {
      user,
      shopping,
      todo,
      app,
    },
    plugins: [vuexLocal.plugin],
  }) as Store<JuteBagState>;
}
