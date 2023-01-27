<template>
  <div class="w100">
    <w-input
      outline
      label="search (filter)"
      v-model="searchFilterText"
      inner-icon-right="mdi mdi-close-circle"
      @click:inner-icon-right="searchFilterText = ''"
    ></w-input>
    <w-table
      :headers="searchTableHeaders"
      fixed-headers
      class="full-width h50"
      :items="whishlistItems"
      v-model="selectedSearchRows"
      :filter="itemFilter"
      expandable-rows
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
      <template #item-cell.item="{ item }">
        {{ item.item.name }}
      </template>
      <template #item-cell.shopNames="{ item }">
        <span class="body">{{
          item.shelves.map((sh: ShelfReference) => sh.shop.name).join(", ")
        }}</span>
      </template>
      <template #item-cell.item.id="{ item }">
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
      <template #row-expansion="{ item }">
        <shop-and-shelf-display
          :shelves="item.shelves"
        ></shop-and-shelf-display>
      </template>
    </w-table>
  </div>
</template>
<script setup lang="ts">
import NumberInput from "@/components/common/NumberInput.vue";
import { computed, ref } from "vue";
import {
  ShelfReference,
  useShoppingStore,
  WhishlistItemView,
} from "../shoppingStore";
import ShopAndShelfDisplay from "./ShopAndShelfDisplay.vue";

const store = useShoppingStore();

const searchFilterText = ref("");

const notifyUpdate = (whishlistItem: WhishlistItemView, value: number) => {
  store.setWhishlistItem(whishlistItem.item.id, value);
};

const selectedSearchRows = ref([]);
const itemFilter = (item: WhishlistItemView) => {
  return (
    !searchFilterText.value ||
    item.item.name
      .toLocaleLowerCase()
      .includes(searchFilterText.value.trim().toLocaleLowerCase()) ||
    item.shelves.find((shelf) =>
      shelf.shop.name
        .toLocaleLowerCase()
        .includes(searchFilterText.value.trim().toLocaleLowerCase())
    )
  );
};

const whishlistItems = computed(() => {
  return store.whishlistItems;
});

const searchTableHeaders = [
  { label: "Quantity", key: "amount", width: "95px" },
  { label: "Item", key: "item" },
  { label: "Shops", key: "shopNames" },
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

.h50 {
  max-height: 50vh;
}
</style>
