<template>
  <div class="w100">
    <w-table
      :headers="searchTableHeaders"
      no-headers
      class="full-width"
      :items="selectableItems"
      v-model="selectedSearchRows"
      :filter="itemFilter"
    >
      <template #header-label="{ label, index }">
        <span class="caption">{{ label }}</span>
      </template>
      <template #no-data>
        No item (create an item <w-button>HERE</w-button>)
      </template>
      <!-- <template #item-cell.qty="{ item }">
                  <w-flex>
                    <div class="text-center">
                      <div class="flex" @click.stop="">
                        <w-button>-</w-button>
                        <w-input class="narrow" v-model="item.qty"></w-input>
                        <w-button>+</w-button>
                      </div>
                    </div>
                  </w-flex>
                </template>
                <template #item-cell.name="{ item, label }">
                  LABEL: {{ label }} ( {{ item.name }})
                </template> -->
    </w-table>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useShoppingStore, UUID } from "../shoppingStore";

const props = defineProps<{
  searchText?: string;
}>();

const selectedSearchRows = ref([]);
const itemFilter = (item: { item: UUID; label: string }) => {
  return (
    !props.searchText ||
    item.label
      .toLocaleLowerCase()
      .includes(props.searchText.toLocaleLowerCase())
  );
};
const store = useShoppingStore();

// FIXME: use whishlist items
const selectableItems = store.items.map((it) => ({
  label: it.name,
  qty: 2,
  id: it.id,
}));
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
  { label: "Quantity", key: "qty", width: "95px" },
  { label: "Item", key: "label" },
];
</script>
<style scoped>
.w100 {
  width: 100%;
}
</style>
