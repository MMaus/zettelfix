<template>
  <div class="w100">
    <w-input
      outline
      label="search (filter)"
      v-model="searchFilterText"
    ></w-input>
    <w-table
      :headers="searchTableHeaders"
      no-headers
      class="full-width"
      :items="whishlistItems"
      v-model="selectedSearchRows"
      :filter="itemFilter"
    >
      <template #header-label="{ label, index }">
        <span class="caption">{{ label }}</span>
      </template>
      <template #no-data> Your whishlist is empty. </template>
      <template #item-cell.amount="{ item }">
        <NumberInput
          :model-value="item.amount"
          @update:model-value="(value) => notifyUpdate(item, value)"
          class="w45 mr3"
        ></NumberInput>
      </template>
      <template #item-cell.name="{ item, label }">
        {{ item.item.name }} TODO: SHOPS
      </template>
      <template #item-cell.item.id="{ item, label }">
        <w-confirm
          @confirm="store.setWhishlistItem(item.item.id, 0)"
          confirm="yes"
          :question="`Remove ${item.item.name} from whishlist?`"
          cancel="no"
          shadow
          bg-color="warning-dark1"
        >
          <w-icon color="white">mdi mdi-delete-forever-outline</w-icon>
        </w-confirm>
      </template>
    </w-table>
  </div>
</template>
<script setup lang="ts">
import NumberInput from "@/components/common/NumberInput.vue";
import { attempt } from "lodash";
import { storeToRefs } from "pinia";
import { computed, ComputedRef, ref } from "vue";
import {
  Item,
  useShoppingStore,
  UUID,
  WhishlistItemPreview,
  WhishlistItemView,
} from "../shoppingStore";

const props = defineProps<{
  searchText?: string;
}>();

const store = useShoppingStore();

const searchFilterText = ref("");

const notifyUpdate = (whishlistItem: WhishlistItemView, value: number) => {
  store.setWhishlistItem(whishlistItem.item.id, value);
};

const selectedSearchRows = ref([]);
const itemFilter = (item: WhishlistItemPreview) => {
  return (
    !searchFilterText.value ||
    item.item.name
      .toLocaleLowerCase()
      .includes(searchFilterText.value.toLocaleLowerCase())
  );
};

const whishlistItems = computed(() => {
  return store.whishlistItems;
});

// const testItems = computed(() => {
//   const searchString = searchText.value.toLocaleLowerCase().trim();
//   return store.items
//     .filter(
//       (it) =>
//         !searchString || it.name.toLocaleLowerCase().includes(searchString)
//     )
//     .map((it) => ({ label: it.name, qty: 2, id: it.id }));
// });

const searchTableHeaders = [
  { label: "Quantity", key: "amount", width: "95px" },
  { label: "Item", key: "name" },
  { label: "", key: "item.id", width: "24px" },
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
