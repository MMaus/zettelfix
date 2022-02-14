import { ActionContext } from "vuex";
import { JuteBagState } from "../types";
import { AppState } from "./types";

export default {
  async confirmConsent(
    context: ActionContext<AppState, JuteBagState>
  ): Promise<void> {
    context.commit("setConsentNow");
  },
  // FIXME: unify backend calls, maybe create 'backend' abstraction?
  async logout(context: ActionContext<AppState, JuteBagState>): Promise<void> {
    const requestData = {
      command: "logout",
    };
    // FIXME: proper Logout mechanism!
    const response = await fetch("api/login", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    if (response.status <= 300) {
      context.commit("logout");
    }
  },
  updateLoginStatus(
    context: ActionContext<AppState, JuteBagState>,
    data: { account: string | null; loggedIn: boolean }
  ): void {
    if (data.loggedIn) {
      context.commit("setUser", data.account);
    }
  },

  // FIXME: delete after migration to auth headers
  // async refreshLogin(
  //   context: ActionContext<AppState, JuteBagState>
  // ): Promise<void> {
  //   const response = await fetch("api/login");
  //   if (response.status >= 300) {
  //     console.error(
  //       `Fetch returned ${response.status}  : ${response.statusText}`
  //     );
  //     return;
  //   }
  //   const responseData = await response.json();
  //   if (responseData.loggedIn) {
  //     console.log("USER DATA =", responseData);
  //     context.commit("setUser", responseData.account);
  //   } else {
  //     context.commit("logout");
  //   }
  // },

  async login(
    context: ActionContext<AppState, JuteBagState>,
    data: { account: string; password: string }
  ): Promise<void> {
    const requestData = {
      account: data.account,
      password: data.password,
      command: "login",
    };
    const response = await fetch("api/login", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    if (response.status >= 300) {
      console.error("Bad request:", response);
      return;
    }
    console.log(`login Response status: ${response.status}`);
    const responseData = await response.json();
    if (responseData.status === "OK") {
      console.log("Login OK");
      context.commit("setUser", data.account);
      context.commit("setTokens", responseData);
      // FIXME: close dialog here
    } else {
      // FIXME: handle errors here
      console.log("Login Failed");
    }
  },

  async register(
    context: ActionContext<AppState, JuteBagState>,
    data: { account: string; password: string }
  ): Promise<void> {
    const requestData = {
      account: data.account,
      password: data.password,
      command: "register",
    };
    const response = await fetch("api/login", {
      method: "POST",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });
    if (response.status >= 300) {
      console.error("Bad request:", response);
      return;
    }
    // FIXME: remove all those logging
    console.log(`registration Response status: ${response.status}`);
    const responseData = await response.json();
    if (responseData.status === "OK") {
      console.log("Registration OK");
      context.commit("setUser", data.account);
      // FIXME: close dialog here
    } else {
      // FIXME: handle registration errors here -> set warning message
      console.log("registration Failed");
    }
  },
};
