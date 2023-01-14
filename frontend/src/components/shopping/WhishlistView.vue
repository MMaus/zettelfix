<template>
  <w-card shadow title="Whishlist" title-class="amber-light5--bg">
    <w-input
      v-model="searchText"
      class="mb2"
      placeholder="filter items"
      inner-icon-right="mdi mdi-close-circle"
      @click:inner-icon-right="searchText = ''"
    ></w-input>

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
  </w-card>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { type UUID, useShoppingStore } from "./shoppingStore";

const searchText = ref("");

const selectedRows = ref([]);

const itemFilter = (item: { item: UUID; name: string }) => {
  return (
    !searchText.value ||
    item.name.toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase())
  );
};
const whishlistHeaders = [
  { label: "Quantity", key: "amount", width: "145px" },
  { label: "Name", key: "name" },
];

const store = useShoppingStore();

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
