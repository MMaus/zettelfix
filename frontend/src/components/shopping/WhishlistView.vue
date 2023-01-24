<template>
  <w-card
    shadow
    title="Whishlist"
    title-class="amber-light5--bg"
    class="text-left"
  >
    <dropdown-select
      class="w600"
      label="add item"
      v-model:search-text="searchText"
    >
      <item-select-table :search-text="searchText"></item-select-table>
    </dropdown-select>
    <div class="my3"></div>

    <whishlist-item-table :search-text="searchText"></whishlist-item-table>
  </w-card>
</template>
<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import { type UUID, useShoppingStore } from "./shoppingStore";
import DropdownSelect from "../common/DropdownSelect.vue";
import ItemSelectTable from "./whishlist/ItemSelectTable.vue";
import WhishlistItemTable from "./whishlist/WhishlistItemTable.vue";

const searchText = ref("");
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
