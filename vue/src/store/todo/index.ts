import { Module } from "vuex";
import { JuteBagState } from "@/store/types";
import { TodoListState } from "./types";
import { createState } from "./state";
import getters from "./getters";
import mutations from "./mutations";
import actions from "./actions";

export function createModule(): Module<TodoListState, JuteBagState> {
  return {
    getters: getters,
    mutations: mutations,
    actions: actions,
    state: createState(),
    namespaced: true,
  } as Module<TodoListState, JuteBagState>;
}

export default createModule();
