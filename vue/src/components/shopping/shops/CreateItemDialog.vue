<template>
  <div>
    <w-dialog
      :modelValue="props.modelValue"
      @update:modelValue="(value: boolean) => emit('update:modelValue', value)"
      width="600"
      height="400"
    >
      <template #title>
        <w-icon class="mr3">mdi mdi-book-plus-outline</w-icon>Create Item
        <span class="ml2 text-italic">{{ newItemName }}</span>
      </template>

      <w-tabs v-model="activeTab" :items="tabData">
        <template #item-content.1="{ item }">
          <w-input
            class="mb1"
            v-model="newItemName"
            label="Enter new Item"
          ></w-input>
          <w-button :disabled="!newItemName" @click="nameSelected">
            Select Shelves
            <w-icon>mdi mdi-chevron-double-right</w-icon>
          </w-button>
        </template>
        <template #item-content.2="{ item }">
          <div class="ma2">
            <select-shelves-component
              v-model="selectedShelves"
            ></select-shelves-component>
          </div>
          <w-button @click="activeTab = 0">
            <w-icon>mdi mdi-chevron-double-left</w-icon>back
          </w-button>
          <w-button class="ml3" :disabled="!newItemName" @click="addItem">
            Create Item
            <w-icon class="ml1">mdi mdi-check-bold</w-icon>
          </w-button>
        </template>
      </w-tabs>
    </w-dialog>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { UUID } from "../shoppingStore";
import SelectShelvesComponent from "./SelectShelvesComponent.vue";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (eventName: "update:modelValue", modelValue: boolean): void;
  (eventName: "addItem", newItem: { itemName: string; shelves: UUID[] }): void;
}>();

const activeTab = ref(0);
const newItemName = ref("");
const selectedShelves = ref([]);

const nameSelected = () => {
  activeTab.value = 1;
};

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      newItemName.value = "";
      selectedShelves.value = [];
      activeTab.value = 0;
    }
  }
);

const addItem = () => {
  emit("addItem", {
    itemName: newItemName.value,
    shelves: selectedShelves.value,
  });
  emit("update:modelValue", false);
};

const tabData = computed(() => [
  { title: "1. Enter Item Name", content: "Tab 1 content." },
  {
    title: "2. Select Shelves",
    content: "Tab 2 content.",
    disabled: !newItemName.value,
  },
]);
</script>
