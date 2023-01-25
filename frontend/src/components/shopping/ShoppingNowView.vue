<template>
  <w-card shadow title="Shopping" title-class="amber-light5--bg">
    <w-select
      :items="shops"
      round
      shadow
      :inner-icon-left="!!selectedShop ? 'mdi mdi-close-circle' : undefined"
      @click:inner-icon-left="selectedShop = ''"
      label="Select shop"
      class="selectbox"
      v-model="selectedShop"
    >
    </w-select>
    {{ selectedShop }}
    {{ shelves }}
  </w-card>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import { useShoppingStore } from "./shoppingStore";

const store = useShoppingStore();

const shelves = computed(() => {
  if (!selectedShop) {
    return [];
  }
  return store.getShelves(selectedShop.value);
});

const selectedShop = ref("");
const shops = computed(() =>
  store.shops.map((sh) => {
    return {
      label: sh.name,
      value: sh.id,
    };
  })
);
</script>
<style scoped>
.selectbox {
  max-width: 600px;
  width: fit-content;
}
.demo {
  background-color: khaki;
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
