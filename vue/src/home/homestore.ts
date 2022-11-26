import { defineStore } from "pinia";

export const useHomeStore = defineStore({
  id: "homeStore",
  state: () => ({
    showLegacyApps: true,
  }),
  persist: true,
});
