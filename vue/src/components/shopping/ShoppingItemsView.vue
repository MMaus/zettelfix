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
            <w-button @click="showCreateItemDialog"
              ><w-icon class="mr1">mdi mdi-plus</w-icon>Create Item</w-button
            >
          </div>
        </w-flex>
      </template>
      <w-alert info v-if="store.items.length == 0">
        No shopping items. Please create some items.
      </w-alert>
      <ul class="text-left">
        <li v-for="item in store.items" :key="item.id">
          {{ item.name }}
        </li>
      </ul>
    </w-card>
    <add-item-dialog
      v-model="dialogVisible"
      @create-item="createItem"
    ></add-item-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useShoppingStore, UUID } from "./shoppingStore";
import AddItemDialog from "./shops/CreateItemDialog.vue";

const dialogVisible = ref(false);

const store = useShoppingStore();

const showCreateItemDialog = () => {
  dialogVisible.value = true;
};

const createItem = (item: { itemName: string; shelves: UUID[] }) => {
  store.createItem(item.itemName, item.shelves);
  console.info(`item ${item.itemName} should be created`);
};
</script>
