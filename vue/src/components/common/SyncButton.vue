<template>
  <w-menu hide-on-menu-click>
    <template #activator="{ on }">
      <w-badge round inline overlap :bg-color="syncIcon.color">
        <template #badge
          ><w-icon xs>{{ syncIcon.icon }}</w-icon>
        </template>
        <w-button :disabled="!isLoggedIn" shadow v-on="on"
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
</template>
<script setup lang="ts">
import { SyncState } from "@/store/todo/types";
import { computed, defineProps, ref } from "vue";
import { useStore } from "vuex";

const props = defineProps<{
  module: string;
}>();

const store = useStore();

function runSyncAction(action: { label: string }) {
  if (action.label === "upload") {
    store.dispatch(`${props.module}/upload`);
  } else if (action.label === "download") {
    store.dispatch(`${props.module}/download`);
  }
  console.log("SYNCING ...", action.label);
}

const selectedAction = ref("");
const syncActions = [
  { label: "upload", value: 1, icon: "mdi mdi-cloud-upload" },
  { label: "download", value: 2, icon: "mdi mdi-cloud-download" },
];

// FIXME: make Syncstate a 'common' state
const theSyncState = computed(
  () => store.getters[`${props.module}/syncState`] as SyncState
);
const isLoggedIn = computed(() => store.getters["app/userLoggedIn"]);

const syncIcon = computed(() => {
  const syncValue = theSyncState.value;
  if (!isLoggedIn.value) {
    return { color: "grey", icon: "mdi mdi-sync-off" };
  }
  if (syncValue == "SYNCING") {
    return { color: "yellow", icon: "mdi mdi-sync" };
  }
  if (syncValue == "SYNC") {
    return { color: "success", icon: "mdi mdi-check" };
  }
  if (syncValue == "SYNC_ERROR") {
    return { color: "red", icon: "mdi mdi-alert-circle" };
  }
  return { color: "grey", icon: "mdi mdi-sync-off" };
});
</script>
