import { Module } from "vuex";
import { JuteBagState } from "@/store/types";
import { AppState } from "./types";

import { state as initialState } from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const module: Module<AppState, JuteBagState> = {
  getters: getters,
  mutations: mutations,
  actions: actions,
  state: initialState,
  namespaced: true,
};

export default module;
