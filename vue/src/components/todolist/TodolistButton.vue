<template>
  <router-card title="TODO - List" target="todo">
    <w-badge inline overlap bg-color="">
      <template #badge>
        <span
          v-if="overdueItemsCount > 0"
          class="mx1 px1 bdrsm white error-dark1--bg"
        >
          {{ overdueItemsCount }}
        </span>
        <span v-if="dueItemsCount > 0" class="px1 bdrsm warning--bg">{{
          dueItemsCount
        }}</span>
      </template>
      <w-icon size="90px">mdi mdi-list-status</w-icon>
    </w-badge>
  </router-card>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import RouterCard from "../home/RouterCard.vue";
const store = useStore();
const dueItemsCount = computed(() => store.getters["todo/getDueItems"].length);
const overdueItemsCount = computed(
  () => store.getters["todo/getOverdueItems"].length
);
</script>
