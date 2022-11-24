<template>
  <w-card shadow title="Shops" title-class="amber-light3--bg">
    <w-button @click="addShop">Add shop</w-button>
    <shop-display
      v-for="shop in shoppingStore.shops"
      :key="shop.id"
      :shop="shop"
      class="mb2"
    ></shop-display>
    <div class="demo">
      <h3>Shops</h3>
      Shopping default view
    </div>
  </w-card>
</template>
<script setup lang="ts">
import ShopDisplay from "./shops/ShopDisplay.vue";
import { useShoppingStore } from "./shoppingStore";
const shoppingStore = useShoppingStore();

const addShop = () => {
  shoppingStore.createShop("Meier");
};

shoppingStore.shops;
</script>
<style scoped>
.demo {
  background-color: aquamarine;
}
</style>
