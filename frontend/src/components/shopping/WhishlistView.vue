<template>
  <w-card
    shadow
    title="Whishlist"
    title-class="amber-light5--bg"
    class="text-left"
  >
    <dropdown-select
      class="w600"
      label="search items"
      v-model:search-text="searchText"
    >
      <item-select-table :search-text="searchText"></item-select-table>
    </dropdown-select>
    <div class="my3"></div>
    <w-table
      :headers="whishlistHeaders"
      fixed-headers
      selectable-rows
      resizable-columns
      v-model:selected-rows="selectedRows"
      class="h-40"
      :items="whishlistItemData"
      :filter="itemFilter"
    >
      <template #no-data> There are no items on your whishlist yet </template>
      <template #item-cell.name="{ item }">
        {{ item.name
        }}<span v-if="item.orphaned" class="ml2 caption">(orphaned)</span>
      </template>
    </w-table>

    <div class="bordered">
      <item-select-table :search-text="searchText"></item-select-table>
    </div>
  </w-card>
</template>
<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import { type UUID, useShoppingStore } from "./shoppingStore";
import DropdownSelect from "../common/DropdownSelect.vue";
import ItemSelectTable from "./whishlist/ItemSelectTable.vue";

const searchText = ref("");

const selectedRows = ref([]);

const store = useShoppingStore();

const itemFilter = (item: { item: UUID; name: string }) => {
  return (
    !searchText.value ||
    item.name.toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase())
  );
};
const whishlistHeaders = [
  { label: "Quantity", key: "qty", width: "145px" },
  { label: "Name", key: "label" },
];

// store.addItemToWhishlist(store.items[2].id);

// const getWhishlistData = () => {
//   return store.whishlist.map((it) => {
//     return {
//       id: it.item,
//       name: store.getItem(it.item)?.name || "unknown item",
//       amount: it.amount,
//     };
// }

// const whishlistItemData = [{

// ]

const whishlistItemData = computed(() => {
  return store.whishlist.map((it) => {
    return {
      id: it.item,
      name: store.getItem(it.item)?.name || "unknown item",
      amount: it.amount,
    };
  });
});
</script>
<style scoped>
.full-width {
  width: 100%;
}

.narrow {
  width: 32px;
}

.w600 {
  width: 100%;
  max-width: 600px;
}
</style>
