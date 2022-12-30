<template>
  <w-card shadow title-class="amber-light4--bg">
    <template #title>
      <span class="title3">Items to shop 2</span>
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
import AddItemDialog from "./shops/AddItemDialog.vue";

const dialogVisible = ref(false);

const showCreateItemDialog = () => {
  dialogVisible.value = true;
};

const createItem = (itemName: string) => {
  console.info(`item ${itemName} should be created`);
};
</script>

<style scoped>
.demo {
  background-color: aquamarine;
}
</style>
