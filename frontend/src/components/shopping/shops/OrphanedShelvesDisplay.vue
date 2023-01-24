<template>
  <w-card title-class="amber-light5--bg" class="amber-light6--bg" shadow>
    <template #title>
      <div class="title3 text-italic">Orphaned Shelves</div>
    </template>
    <w-table
      :headers="shelfTableHeaders"
      no-headers
      class="h-40"
      :items="shelves"
    >
      <template #item-cell.id="{ item }">
        <w-confirm
          @confirm="deleteShelf(item.id)"
          confirm="yes"
          :question="`Are you sure to delete shelf ${item.name} permanently?`"
          cancel="no"
          shadow
          icon="mdi mdi-delete-forever-outline"
          color="white"
          bg-color="warning-dark1"
        >
        </w-confirm>
      </template>
    </w-table>
  </w-card>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { useShoppingStore, UUID } from "../shoppingStore";

const store = useShoppingStore();
const shelves = computed(() => store.getOrphanedShelves);

const shelfTableHeaders = [
  { label: "Shelves", key: "name" },
  { label: "", key: "id", width: "45px" },
];

const deleteShelf = (shelfId: UUID) => {
  store.deleteShelf(shelfId);
};
</script>

<style scoped>
.h-40 {
  max-height: 40vh;
}
</style>
