<template>
  <w-card shadow title-class="amber-light4--bg">
    <template #title>
      <span class="title3">Items to shop</span>
      <div class="mx5"></div>
      <div><w-button @click="showCreateItemDialog">Create Item</w-button></div>
    </template>
    <div class="demo">Shopping items</div>
    <add-item-dialog
      v-model="dialogVisible"
      @add-item="createItem"
    ></add-item-dialog>
  </w-card>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { UUID } from "./shoppingStore";
import AddItemDialog from "./shops/CreateItemDialog.vue";

const dialogVisible = ref(false);

const showCreateItemDialog = () => {
  dialogVisible.value = true;
};

const createItem = (item: { itemName: string; shelves: UUID[] }) => {
  console.info(`item ${item.itemName} should be created`);
};
</script>

<style scoped>
.demo {
  background-color: aquamarine;
}
</style>
