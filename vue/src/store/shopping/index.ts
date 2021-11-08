import { Module } from "vuex";
import { JuteBagState } from "@/store/types";
import { ShoppingListState } from "./types";

import { createState } from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

export function createModule(): Module<ShoppingListState, JuteBagState> {
  return {
    getters: getters,
    mutations: mutations,
    actions: actions,
    state: createState(),
    namespaced: true,
  } as Module<ShoppingListState, JuteBagState>;
}

export default createModule();
