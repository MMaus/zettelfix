import { UserState } from "./types";

export default {
  user(state: UserState) {
    return state.user;
  },

  isLoggedIn(state: UserState) {
    return state.loggedIn;
  },
};
