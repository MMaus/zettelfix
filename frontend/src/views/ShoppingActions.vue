<template>
  <w-flex wrap>
    <div class="spacer"></div>
    <div>
      <router-link to="shops">
        <w-button shadow><w-icon lg>mdi mdi-storefront</w-icon></w-button>
      </router-link>
    </div>
    <div>
      <router-link to="items">
        <w-button shadow><w-icon lg>mdi mdi-cart-plus</w-icon></w-button>
      </router-link>
    </div>
    <div class="mx2"></div>
    <div>
      <router-link to="whishlist">
        <w-button shadow><w-icon lg>mdi mdi-cart-arrow-down</w-icon></w-button>
      </router-link>
    </div>
    <div>
      <router-link to="whishlist">
        <w-button shadow><w-icon lg>mdi mdi-playlist-edit</w-icon></w-button>
      </router-link>
    </div>
    <div>
      <router-link to="shopping">
        <w-button shadow><w-icon lg>mdi mdi-cart-outline</w-icon></w-button>
      </router-link>
    </div>

    <div>
      <w-menu hide-on-menu-click>
        <template #activator="{ on }">
          <w-badge round inline overlap :bg-color="syncIcon.color">
            <template #badge
              ><w-icon xs>{{ syncIcon.icon }}</w-icon>
            </template>
            <w-button :disabled="!userLoggedIn" shadow v-on="on"
              ><w-icon lg>mdi mdi-sync</w-icon></w-button
            >
          </w-badge>
        </template>
        <w-list
          v-model="selectedAction"
          :items="syncActions"
          color="deep-purple"
          @item-click="runSyncAction"
          class="mt1 mr4 grow"
        >
          <template #item="{ item }">
            <w-icon md>{{ item.icon }}</w-icon>
            <span class="ml2">{{ item.label }}</span> </template
          >s
        </w-list>
      </w-menu>
    </div>
    <!-- <w-drawer top height="120px" v-model="showDrawer">
      <add-item-panel />
    </w-drawer> -->
  </w-flex>
</template>

<script lang="ts">
import AddItemPanel from "@/components/shoppinglist/AddItemPanel.vue";
import { mapActions, mapGetters, Store, useStore } from "vuex";
import { SyncState } from "@/store/shopping/types";
import { JuteBagState } from "@/store/types";
import { defineComponent } from "vue";
import { RouterLink } from "vue-router";
export default defineComponent({
  components: { AddItemPanel },
  data() {
    return {
      showDrawer: false,
      selectedShop: null as string | null,
      selectedAction: "",
      syncActions: [
        { label: "upload", value: 1, icon: "mdi mdi-cloud-upload" },
        { label: "download", value: 2, icon: "mdi mdi-cloud-download" },
      ],
      shops: [
        { label: "Edeka", value: 1 },
        { label: "Aldi", value: 2 },
        { label: "Bios", value: 3 },
        { label: "Marktkauf", value: 4 },
      ],
    };
  },
  computed: {
    ...mapGetters("shopping", ["syncState"]),
    ...mapGetters("app", ["userLoggedIn"]),
    syncIcon(): { color: string; icon: string } {
      const store = useStore() as Store<JuteBagState>;
      const theSyncState = store.getters["shopping/syncState"] as SyncState;
      const isLoggedIn = store.getters["app/userLoggedIn"] as boolean;
      if (!isLoggedIn) {
        return { color: "grey", icon: "mdi mdi-sync-off" };
      }
      if (theSyncState == "SYNCING") {
        return { color: "yellow", icon: "mdi mdi-sync" };
      }
      if (theSyncState == "SYNC") {
        return { color: "success", icon: "mdi mdi-check" };
      }
      if (theSyncState == "SYNC_ERROR") {
        return { color: "red", icon: "mdi mdi-alert-circle" };
      }
      return { color: "grey", icon: "mdi mdi-sync-off" };
    },
  },

  methods: {
    ...mapActions("shopping", ["uploadItems", "downloadItems"]),
    openDrawer(): void {
      console.log("opening drawer");
    },
    logShop(shop: unknown): void {
      console.log("Selected Shop:", shop);
    },

    runSyncAction(action: { value: number }): void {
      if (action.value === 1) {
        this.uploadItems();
      } else if (action.value === 2) {
        this.downloadItems();
      }
      console.log("selected action:", action);
    },
  },
});
</script>
