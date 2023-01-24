<template>
  <div>
    <w-card shadow title-class="amber-light4--bg">
      <template #title>
        <w-flex>
          <div>
            <span class="title3">Items to shop</span>
          </div>
          <div class="spacer"></div>
          <div>
            <w-button @click="showCreateItemDialog" shadow
              ><w-icon class="mr1">mdi mdi-plus</w-icon>Create Item</w-button
            >
          </div>
        </w-flex>
      </template>
      <w-alert info v-if="store.items.length == 0">
        No shopping items. Please create some items.
      </w-alert>
      <w-input
        class="mb2"
        placeholder="type search text here"
        v-model="searchText"
        inner-icon-right="mdi mdi-close-circle"
        @click:inner-icon-right="searchText = ''"
      ></w-input>
      <w-table
        :headers="itemHeaders"
        fixed-headers
        resizable-columns
        :items="availableItems"
        :filter="itemFilter"
        class="h40"
      >
        <template #no-data> There are no items registered yet </template>
        <template #item-cell.id="{ item, label, header, index }">
          <w-button shadow icon="mdi mdi-pencil"></w-button>
        </template>
      </w-table>
    </w-card>
    <add-item-dialog
      v-model="dialogVisible"
      @create-item="createItem"
    ></add-item-dialog>
  </div>
</template>
<script setup lang="ts">
import { identity } from "lodash";
import { computed, ref } from "vue";
import { Item, Shelf, Shop, useShoppingStore, UUID } from "./shoppingStore";
import AddItemDialog from "./shops/CreateItemDialog.vue";

const dialogVisible = ref(false);

const store = useShoppingStore();

const showCreateItemDialog = () => {
  dialogVisible.value = true;
};

const searchText = ref("");

const itemFilter = (item: { id: UUID; name: string; shops: string[] }) => {
  if (searchText.value == null || searchText.value.trim().length === 0) {
    return true;
  }
  return (
    item.name
      .toLocaleLowerCase()
      .indexOf(searchText.value.trim().toLocaleLowerCase()) > -1 ||
    !!item.shops.find(
      (shopName) =>
        shopName
          .toLocaleLowerCase()
          .indexOf(searchText.value.trim().toLocaleLowerCase()) > -1
    )
  );
};

const itemHeaders = [
  { label: "Item", key: "name" },
  { label: "Shops", key: "shops" },
  { label: "", key: "id", width: "30px" },
];

const availableItems = computed(() => {
  return store.items
    .map((it) => ({
      id: it.id,
      name: it.name,
      shops: getShops(it).map((shop) => shop.name),
    }))
    .sort((it1, it2) => it1.name.localeCompare(it2.name));
});

// const shopById = computed(() => {
//   return new Map<UUID, Shop>(store.shops.map(shop => [shop.id, shop]))
// })

// const shelfById = computed(() => {
//   return new Map<UUID, Shelf>(store.shelves.map(shelf => [shelf.id, shelf]))
// })

const getShops = (item: Item) => {
  const shelves = store.shelves.filter((shelf) =>
    shelf.items.find((it) => it == item.id)
  );
  const shelfIDs = new Set(shelves.map((it) => it.id));
  const shops = store.shops.filter((shop) =>
    shop.shelves.find((shelfId) => shelfIDs.has(shelfId))
  );
  return shops;
};

const createItem = (item: { itemName: string; shelves: UUID[] }) => {
  store.createItem(item.itemName, item.shelves);
  console.info(`item ${item.itemName} should be created`);
};
</script>
<style scoped>
.h40 {
  max-height: 60vh;
}
</style>
