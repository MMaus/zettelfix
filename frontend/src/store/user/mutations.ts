import { MutationTree } from "vuex";
import { User, UserState } from "./types";

export default {
  login(state: UserState, user: User): void {
    state.loggedIn = true;
    state.user = user;
  },

  logout(state: UserState): void {
    state.user = null;
    state.loggedIn = false;
  },
} as MutationTree<UserState>;
