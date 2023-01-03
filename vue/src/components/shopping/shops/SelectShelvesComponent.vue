<template>
  <div class="text-left">
    <div v-if="selectedShops.length == 0">
      <span class="warning">Please configure some shops and shelves!</span>
      You can create this item but it won't be assigned to any shelf, so you
      won't be able to use it in a shopping list.
    </div>
    <div v-else>
      <w-flex wrap>
        <w-button
          class="ma1"
          dark
          v-for="shop in selectedShops"
          :key="shop.id"
          :shadow="!shop.selected"
          :bg-color="getClassOf(shop)"
          @click="toggleShopSelection(shop.id)"
          >{{ shop.name }}</w-button
        >
      </w-flex>

      <!-- Shelves in selected shops -->
      <w-card
        title="Shelves in selected shops"
        class="ma1 heightLimited"
        title-class="amber-light5--bg title5"
      >
        Selected rows: {{ selectedRows }}
        <w-table
          :headers="shelfTableHeaders"
          fixed-headers
          selectable-rows
          resizable-columns
          v-model:selected-rows="selectedRows"
          :items="selectableShelves"
          :filter="shelfFilter"
          class="bordered"
        >
          <template #no-data> There are no shelves registered yet </template>
          <template #item-cell.selected="{ item, label, header, index }">
            <w-checkbox :model-value="item.selected" disabled> </w-checkbox>
          </template>
        </w-table>
        <w-flex wrap class="text-left">
          <div class="scroller">
            <div
              class="xs12 mb1"
              v-for="shelf in availableShelves"
              :key="shelf.id"
            >
              <w-checkbox></w-checkbox>
              {{ shelf.name }} | {{ shelf.items }}
            </div>
          </div>
        </w-flex>
      </w-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { stdin } from "process";
import { ref, computed, type Ref, watch } from "vue";
import { useShoppingStore, UUID } from "../shoppingStore";

const props = defineProps<{ selectedShelves: UUID[] }>();
const store = useShoppingStore();

const shelvesWithShops = new Set(store.shops.flatMap((it) => it.shelves));

// const shopIds = new Set(
//   selectedShops.value.filter((it) => it.selected).flatMap((it) => it.shelves)
// );
// return store.shelves
//   .filter((shelf) => shopIds.has(shelf.id))
//   .sort((s1, s2) => (s1 || "").name.localeCompare(s2.name || ""));

const shelfFilter = (item: { id: UUID }) => {
  return (
    selectedShops.value
      .filter((it) => it.selected)
      .flatMap((it) => it.shelves)
      .indexOf(item.id) > -1
  );
};

// const selectableShelves = ref([]);
const selectableShelves = ref(
  store.shelves.map((it) => ({
    selected: false,
    name: it.name,
    id: it.id,
    orphaned: shelvesWithShops.has(it.id),
  }))
);

const selectedRows = ref([]);

watch(
  () => selectedRows.value,
  (newSelection: UUID[]) => {
    const selectedShelfIDs = new Set(newSelection);
    for (let shelf of selectableShelves.value) {
      shelf.selected = selectedShelfIDs.has(shelf.id);
      console.log(`updated shelf ${shelf.name} to selected: ${shelf.selected}`);
    }
  },
  {
    deep: true,
  }
);

// const updateSelection = (event: {
//   item: { id: UUID; name: string; selected: boolean };
// }) => {
//   console.info(`updating stuff with event ${event}`, event);
//   const itemIndex = selectableShelves.value.findIndex(
//     (it) => it.id === event.item.id
//   );
//   if (itemIndex > 0) {
//     selectableShelves.value[itemIndex].selected =
//       !selectableShelves.value[itemIndex].selected;
//   }
// };

const shelfTableHeaders = [
  { label: "", key: "selected", width: "45px" },
  { label: "Shelf", key: "name" },
];

// selected shops in the filter of the table
const selectedShops = ref(
  store.shops.map((it) => ({
    name: it.name,
    id: it.id,
    shelves: it.shelves,
    selected: ref(true),
  }))
);

// const toggleShelf = (item: any) => {
//   const index = selectableShelves.value.findIndex((it) => it.id == item.id);
//   if (index > -1) {
//     const currentValue = selectableShelves.value[index].selected;
//     selectableShelves.value[index].selected = !currentValue;
//   }
//   console.info(`toggling shelf item `, item);
// };

// const addShelf = (shelfId: UUID) => {
//   if (selectedShelves.value.indexOf(shelfId) < 0) {
//     selectedShelves.value.push(shelfId);
//   }
// };

// const selectedShelves = ref([]) as Ref<UUID[]>;

const availableShelves = computed(() => {
  const shopIds = new Set(
    selectedShops.value.filter((it) => it.selected).flatMap((it) => it.shelves)
  );
  return store.shelves
    .filter((shelf) => shopIds.has(shelf.id))
    .sort((s1, s2) => (s1 || "").name.localeCompare(s2.name || ""));
});

// const orphanedShelves = computed(() => {
//   const shopIds = new Set(selectedShops.value.flatMap((it) => it.shelves));
//   return store.shelves
//     .filter((shelf) => !shopIds.has(shelf.id))
//     .sort((s1, s2) => (s1 || "").name.localeCompare(s2.name || ""));
// });

const getClassOf = (shop: { selected: boolean }) => {
  if (shop.selected) {
    return "primary";
  }
  return "grey-light1";
};

const toggleShopSelection = (shopId: UUID) => {
  const prevValue = selectedShops.value.find(
    (shop) => shop.id == shopId
  )?.selected;
  if (prevValue != undefined) {
    selectedShops.value.find((shop) => shop.id == shopId)!.selected =
      !prevValue;
  }
};
</script>
<style scoped>
.scroller {
  width: 100%;
  max-height: 40vh;
  overflow-y: auto;
}

.heightLimites {
  max-height: 95vh;
}
</style>
