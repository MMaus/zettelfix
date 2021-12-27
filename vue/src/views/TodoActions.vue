<template>
  <w-flex wrap>
    <div class="spacer"></div>
    <div>
      <w-button shadow @click="showIt = true">
        <w-icon lg>mdi mdi-newspaper-plus</w-icon></w-button
      >
    </div>
  </w-flex>
  <add-todo-dialog v-model:dialogOpen="showIt" @close="createItem">
  </add-todo-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AddTodoDialog from "@/components/AddTodoDialog.vue";
import { useStore } from "vuex";

const store = useStore();

const showIt = ref(false);
function createItem(label: string) {
  if (label) {
    store.dispatch("todo/createTodoItem", { label });
  }
  showIt.value = false;
}

// import AddItemPanel from "@/components/shoppinglist/AddItemPanel.vue";
// import { mapActions, mapGetters, Store, useStore } from "vuex";
// import { SyncState } from "@/store/shopping/types";
// import { JuteBagState } from "@/store/types";
// export default {
//   components: { AddItemPanel },
//   data(): unknown {
//     return {
//       showDrawer: false,
//       selectedShop: null as string | null,
//       selectedAction: "",
//       syncActions: [
//         { label: "upload", value: 1, icon: "mdi mdi-cloud-upload" },
//         { label: "download", value: 2, icon: "mdi mdi-cloud-download" },
//       ],
//       shops: [
//         { label: "Edeka", value: 1 },
//         { label: "Aldi", value: 2 },
//         { label: "Bios", value: 3 },
//         { label: "Marktkauf", value: 4 },
//       ],
//     };
//   },
//   computed: {
//     ...mapGetters("app", ["userLoggedIn"]),
//     ...mapGetters("shopping", ["syncState"]),
//     syncIcon(): { color: string; icon: string } {
//       const store = useStore() as Store<JuteBagState>;
//       const theSyncState = store.getters["shopping/syncState"] as SyncState;
//       const isLoggedIn = store.getters["app/userLoggedIn"] as boolean;
//       if (!isLoggedIn) {
//         return { color: "grey", icon: "mdi mdi-sync-off" };
//       }
//       if (theSyncState == "SYNCING") {
//         return { color: "yellow", icon: "mdi mdi-sync" };
//       }
//       if (theSyncState == "SYNC") {
//         return { color: "success", icon: "mdi mdi-check" };
//       }
//       if (theSyncState == "SYNC_ERROR") {
//         return { color: "red", icon: "mdi mdi-alert-circle" };
//       }
//       return { color: "grey", icon: "mdi mdi-sync-off" };
//     },
//   },

//   methods: {
//     ...mapActions("shopping", ["uploadItems", "downloadItems"]),
//     openDrawer(): void {
//       console.log("opening drawer");
//     },
//     logShop(shop: unknown): void {
//       console.log("Selected Shop:", shop);
//     },

//     runSyncAction(action: { value: number }): void {
//       if (action.value === 1) {
//         this.uploadItems();
//       } else if (action.value === 2) {
//         this.downloadItems();
//       }
//       console.log("selected action:", action);
//     },
//   },
// };
</script>
