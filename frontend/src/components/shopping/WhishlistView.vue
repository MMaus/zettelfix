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
    <div class="my2"></div>

    <whishlist-item-table></whishlist-item-table>
  </w-card>
</template>
<script setup lang="ts">
import { ref } from "vue";
import DropdownSelect from "../common/DropdownSelect.vue";
import ItemSelectTable from "./whishlist/ItemSelectTable.vue";
import WhishlistItemTable from "./whishlist/WhishlistItemTable.vue";

const searchText = ref("");
</script>
<style scoped>
.w600 {
  width: 100%;
  max-width: 600px;
}
</style>
