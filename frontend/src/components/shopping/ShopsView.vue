<template>
  <w-card shadow title="Shops" title-class="amber-light3--bg">
    <template #title>
      <w-flex>
        <div>Shops</div>
        <div class="spacer"></div>
        <div>
          <w-button class="ma1 pa2" shadow @click="showAddShopDialog = true">
            <w-icon class="mr2">mdi mdi-plus</w-icon> Add shop
          </w-button>
        </div>
      </w-flex>
    </template>
    <w-flex wrap>
      <div v-if="shoppingStore.getOrphanedShelves" class="xs12 pa2 md6 lg4 xl3">
        <orphaned-shelves-display></orphaned-shelves-display>
      </div>
      <div
        class="xs12 pa2 md6 lg4 xl3"
        v-for="shop in shoppingStore.shops"
        :key="shop.id"
      >
        <shop-display :shop="shop" @delete-shop="deleteShop"></shop-display>
      </div>
    </w-flex>
    <add-shop-dialog v-model="showAddShopDialog"></add-shop-dialog>
  </w-card>
</template>
<script setup lang="ts">
import ShopDisplay from "./shops/ShopDisplay.vue";
import AddShopDialog from "./shops/AddShopDialog.vue";
import OrphanedShelvesDisplay from "./shops/OrphanedShelvesDisplay.vue";
import { useShoppingStore, UUID } from "./shoppingStore";
import { ref, computed } from "vue";
const shoppingStore = useShoppingStore();

const showAddShopDialog = ref(false);

const orphaned = computed(() => shoppingStore.getOrphanedShelves);

const deleteShop = (id: UUID) => {
  shoppingStore.deleteShop(id);
};

shoppingStore.shops;
</script>
