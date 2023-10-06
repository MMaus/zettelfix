<template>
  <w-card shadow title="Shopping" title-class="amber-light5--bg">
    <w-flex>
      <div class="xs8">
        <w-flex>
          <w-select
            :items="shops"
            round
            shadow
            :inner-icon-left="
              !!selectedShop ? 'mdi mdi-close-circle' : undefined
            "
            @click:inner-icon-left="selectedShop = ''"
            label="Select shop"
            class="selectbox"
            v-model="selectedShop"
          >
          </w-select>
          <w-button icon="mdi mdi-plus" @click="showAddShopDialog()"></w-button>
        </w-flex>
      </div>

      <w-flex column justify-end class="xs4 grow">
        <w-button bg-color="green-dark2" class="align-self-start sh2 mb1">
          <w-icon lg color="green">mdi mdi-menu-right</w-icon>
          <span class="white">Create list</span>
        </w-button>
      </w-flex>
    </w-flex>
    <div class="my2"></div>
    <div class="sh2">
      <w-flex wrap>
        <shelf-preview
          v-for="shelf in shelves"
          :key="shelf.id"
          :shelfpreview="shelf"
          class="xs12 sm6 md4"
        >
        </shelf-preview>
      </w-flex>
    </div>
    <add-shop-dialog v-model="addShopDialogVisible"></add-shop-dialog>
  </w-card>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useShoppingStore } from "./shoppingStore";
import ShelfPreview from "./shoppinglist/ShelfPreview.vue";
import AddShopDialog from "@/components/shopping/shops/AddShopDialog.vue";

const store = useShoppingStore();

const addShopDialogVisible = ref(false);
const showAddShopDialog = () => {
  console.log("Showing 'add shop' dialog");
  addShopDialogVisible.value = true;
};

const shelves = computed(() => {
  if (!selectedShop) {
    return [];
  }
  const previewShelves = store.shoppingShelvesPreview(selectedShop.value);
  console.log("----> OBTAINED SHELVES:", previewShelves);
  return previewShelves;
});

type ShopInfo = { label: String; value: String; itemCount: number };
const selectedShop = ref("");
const shops = computed(() => {
  const shopInfo = store.shopsSummary.map((sh) => {
    return {
      label: `${sh.name} (${sh.whishlistItemCount} items)`,
      value: sh.id,
      itemCount: sh.whishlistItemCount,
    };
  });
  shopInfo.sort((s1: ShopInfo, s2: ShopInfo) => {
    return s2.itemCount - s1.itemCount;
  });
  return shopInfo;
});
</script>
<style scoped>
.selectbox {
  max-width: 600px;
  width: fit-content;
}

.h100 {
  min-height: 100px;
}

.growcontainer {
  display: flex;
  flex-direction: column;
  flex-flow: column;
  height: 75%;
  border: 1px solid greenyellow;
  max-height: 75%;
  margin: 1px;
  padding: 2px;
}

.largeflex {
  flex: 1 1 auto;
  flex-grow: 1;
  border: 1px solid rebeccapurple;
}

.scroll {
  /* max-height: 50vh; */
  overflow-y: scroll;
}

.sticky-top {
  position: sticky;
  top: 0;
}
</style>
