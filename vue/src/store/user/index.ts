import { Module } from "vuex";
import { JuteBagState } from "../types";
import { UserState } from "./types";
import { initialState } from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

const module: Module<UserState, JuteBagState> = {
  getters: getters,
  mutations: mutations,
  actions: actions,
  state: initialState,
  namespaced: true,
};

export default module;
