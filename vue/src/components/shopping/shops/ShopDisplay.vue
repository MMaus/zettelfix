<template>
  <w-card title-class="amber-light5--bg">
    <template #title>
      <div class="title3">{{ shopTitle }}</div>
      <div class="spacer"></div>
      <w-confirm
        @confirm="emit('deleteShop', props.shop.id)"
        confirm="yes"
        cancel="no"
      >
        <w-icon>mdi mdi-delete-forever-outline</w-icon>
      </w-confirm>
    </template>
    <add-shelf-dialog
      :shop-name="props.shop.name"
      v-model="dialogVisible"
      @add-shelf="addShelf"
    ></add-shelf-dialog>
    <w-flex>
      <div class="grow"></div>
      <div>
        <w-button class="ma1 sh1" @click="showAddShelfDialog"
          >Add shelf</w-button
        >
      </div>
    </w-flex>
    <shelf-display
      v-for="shelf in shelves"
      :key="shelf.id"
      :shelf="shelf"
      @delete-shelf="deleteShelf"
    ></shelf-display>
  </w-card>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { Shelf, Shop, useShoppingStore, UUID } from "../shoppingStore";
import AddShelfDialog from "./AddShelfDialog.vue";
import ShelfDisplay from "./ShelfDisplay.vue";

const props = defineProps<{ shop: Shop }>();
const emit = defineEmits<{
  (eventName: "deleteShop", shopId: UUID): void;
}>();

const store = useShoppingStore();
const shelves = computed(() => store.getShelves(props.shop.id));
const addShelf = (shelfName: string) => {
  store.addShelf(props.shop.id, shelfName);
};

const shopTitle = props.shop.name || "(kein Name)";
const dialogVisible = ref(false);

const showAddShelfDialog = () => {
  dialogVisible.value = true;
};

const deleteShelf = (shelfId: UUID) => {
  store.deleteShelfFromShop(shelfId, props.shop.id);
};
</script>
