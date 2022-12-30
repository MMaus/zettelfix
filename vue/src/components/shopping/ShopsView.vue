<template>
  <w-card shadow title="Shops" title-class="amber-light3--bg">
    <w-button class="ma1 pa2" @click="showAddShopDialog = true">
      <span class="title3 ma2 pa2">Add shop</span>
    </w-button>
    <shop-display
      v-for="shop in shoppingStore.shops"
      :key="shop.id"
      :shop="shop"
      @delete-shop="deleteShop"
      class="mb2"
    ></shop-display>
    <add-shop-dialog v-model="showAddShopDialog"></add-shop-dialog>
  </w-card>
</template>
<script setup lang="ts">
import ShopDisplay from "./shops/ShopDisplay.vue";
import AddShopDialog from "./shops/AddShopDialog.vue";
import { useShoppingStore, UUID } from "./shoppingStore";
import { ref } from "vue";
const shoppingStore = useShoppingStore();

const showAddShopDialog = ref(false);

const deleteShop = (id: UUID) => {
  shoppingStore.deleteShop(id);
};

shoppingStore.shops;
</script>
