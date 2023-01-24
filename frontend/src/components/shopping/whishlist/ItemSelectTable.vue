<template>
  <div class="w100 purple-light6--bg">
    <w-table
      :headers="searchTableHeaders"
      no-headers
      class="full-width"
      :items="selectableItems"
      v-model="selectedSearchRows"
      :filter="itemFilter"
    >
      <template #header-label="{ label }">
        <span class="caption">{{ label }}</span>
      </template>
      <template #no-data>
        No item (create an item <w-button>HERE</w-button>)
      </template>
      <template #item-cell.amount="{ item }">
        <NumberInput
          :model-value="item.amount"
          @update:model-value="(value) => notifyUpdate(item, value)"
          class="w45 mr3"
        ></NumberInput>
      </template>
      <template #item-cell.item="{ item, label }">
        {{ item.item.name }}
      </template>
    </w-table>
  </div>
</template>
<script setup lang="ts">
import NumberInput from "@/components/common/NumberInput.vue";
import { computed, ref } from "vue";
import {
  Item,
  useShoppingStore,
  UUID,
  WhishlistItemPreview,
} from "../shoppingStore";

const props = defineProps<{
  searchText?: string;
}>();

const notifyUpdate = (item: WhishlistItemPreview, value: number) => {
  console.log(`Received update for ${item} with value UNKNOWN`);
  store.setWhishlistItem(item.item.id, value);
};

const selectedSearchRows = ref([]);
const itemFilter = (item: WhishlistItemPreview) => {
  return (
    !props.searchText ||
    item.item.name
      .toLocaleLowerCase()
      .includes(props.searchText.toLocaleLowerCase())
  );
};
const store = useShoppingStore();

const selectableItems = computed(() => store.whishlistItemCandidates);

const searchTableHeaders = [
  { label: "Quantity", key: "amount", width: "95px" },
  { label: "Item", key: "item" },
];
</script>
<style scoped>
.w45 {
  width: 4.5rem;
}

.w100 {
  width: 100%;
}
</style>
