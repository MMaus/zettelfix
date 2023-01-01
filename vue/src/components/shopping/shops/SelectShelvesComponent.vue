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
          @click="toggleActive(shop.id)"
          >{{ shop.name }}</w-button
        >
      </w-flex>

      <!-- Shelves in selected shops -->
      <w-card
        title="Shelves in selected shops"
        class="ma1 heightLimited"
        title-class="amber-light5--bg title5"
      >
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
import { ref, computed } from "vue";
import { useShoppingStore, UUID } from "../shoppingStore";

const props = defineProps<{ selectedShelves: UUID[] }>();
const store = useShoppingStore();

const selectedShops = ref(
  store.shops.map((it) => ({
    name: it.name,
    id: it.id,
    shelves: it.shelves,
    selected: ref(true),
  }))
);

const availableShelves = computed(() => {
  const shopIds = new Set(
    selectedShops.value.filter((it) => it.selected).flatMap((it) => it.shelves)
  );
  return store.shelves
    .filter((shelf) => shopIds.has(shelf.id))
    .sort((s1, s2) => (s1 || "").name.localeCompare(s2.name || ""));
});

const orphanedShelves = computed(() => {
  const shopIds = new Set(selectedShops.value.flatMap((it) => it.shelves));
  return store.shelves
    .filter((shelf) => !shopIds.has(shelf.id))
    .sort((s1, s2) => (s1 || "").name.localeCompare(s2.name || ""));
});

const getClassOf = (shop: { selected: boolean }) => {
  if (shop.selected) {
    return "primary";
  }
  return "grey-light1";
};

const toggleActive = (shopId: UUID) => {
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
