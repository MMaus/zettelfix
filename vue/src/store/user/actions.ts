// import firebase from "firebase/app";

import { ActionContext } from "vuex";
import { JuteBagState } from "../types";
import { UserState, User } from "./types";

export default {
  async authStateChanged(
    context: ActionContext<UserState, JuteBagState>,
    user: null 
  ): Promise<void> {
    if (user) {
      const currentUser: User = {
        username: "<unknown>",
        email: "<unknown email>",
        emailVerified: false,
      };
      context.commit("login", currentUser);
    } else {
      context.commit("logout");
    }
  },
};
