<template>
  <div class="text-left">
    <div v-if="selectedShops.length == 0">
      <span class="warning">Please configure some shops and shelves!</span>
      You can create this item but it won't be assigned to any shelf, so you
      won't be able to use it in a shopping list.
    </div>
    <div v-else>
      <div v-if="numberOfSelectedShops == 0">
        <span class="caption warning">
          <span class="warning">Please select the shops for this item</span>
        </span>
      </div>
      <w-flex wrap>
        <w-button
          class="ma1"
          v-for="shop in selectedShops"
          :key="shop.id"
          :shadow="!shop.selected"
          :outline="!shop.selected"
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
        <template #title>
          <w-flex>
            <div>Shelves in selected shops</div>
            <div class="spacer"></div>
            <div>
              <w-switch
                class="ml-auto"
                v-model="showOrphans"
                thin
                v-if="anyOrphanedShelf"
              >
                <span class="caption">orphaned shelves</span>
              </w-switch>
            </div>
          </w-flex>
        </template>

        <w-table
          :headers="shelfTableHeaders"
          fixed-headers
          selectable-rows
          resizable-columns
          v-model:selected-rows="selectedRows"
          class="h-40"
          :items="selectableShelves"
          :filter="shelfFilter"
        >
          <template #no-data> There are no shelves registered yet </template>
          <template #item-cell.selected="{ item, label, header, index }">
            <w-icon v-if="item.selected">mdi mdi-check-bold</w-icon>
            <div v-else></div>
          </template>
          <template #item-cell.name="{ item }">
            {{ item.name
            }}<span v-if="item.orphaned" class="ml2 caption">(orphaned)</span>
          </template>
        </w-table>
      </w-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { stdin } from "process";
import { ref, computed, type Ref, watch } from "vue";
import { useShoppingStore, UUID } from "../shoppingStore";

const props = defineProps<{ selectedShelves: UUID[] }>();
const emit = defineEmits<{
  (eventName: "update:selected-shelves", selectedShelves: UUID[]): void;
}>();
const store = useShoppingStore();

const shelvesWithShops = new Set(store.shops.flatMap((it) => it.shelves));

const showOrphans = ref(false);

const shelfFilter = (item: { id: UUID; orphaned: boolean }) => {
  return (
    selectedShops.value
      .filter((it) => it.selected)
      .flatMap((it) => it.shelves)
      .indexOf(item.id) > -1 ||
    (item.orphaned && showOrphans.value)
  );
};

// const selectableShelves = ref([]);
const selectableShelves = ref(
  store.shelves
    .map((it) => ({
      selected: false,
      name: it.name,
      id: it.id,
      orphaned: !shelvesWithShops.has(it.id),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
);

const anyOrphanedShelf: boolean = !!selectableShelves.value.find(
  (it) => it.orphaned
);

const selectedRows = ref([]);

watch(
  () => selectedRows.value,
  (newSelection: UUID[]) => {
    const selectedShelfIDs = new Set(newSelection);
    for (let shelf of selectableShelves.value) {
      shelf.selected = selectedShelfIDs.has(shelf.id);
    }
    emit("update:selected-shelves", newSelection);
  },
  {
    deep: true,
  }
);

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
    selected: false,
  }))
);

const numberOfSelectedShops = computed(() => {
  return selectedShops.value.filter((it) => it.selected).length;
});

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
.h-40 {
  max-height: 40vh;
}

.heightLimites {
  max-height: 95vh;
}
</style>
