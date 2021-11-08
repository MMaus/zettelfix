import { ActionContext } from "vuex";
import { JuteBagState } from "../types";
import { AppState } from "./types";

export default {
  async confirmConsent(
    context: ActionContext<AppState, JuteBagState>
  ): Promise<void> {
    context.commit("setConsentNow");
  },
};
