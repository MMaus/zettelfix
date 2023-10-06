<template>
  <w-card title-class="amber-light5--bg" shadow>
    <template #title>
      <div class="title3">{{ shopTitle }}</div>
      <div class="spacer"></div>
      <w-button class="ma1" shadow @click="showAddShelfDialog"
        ><w-icon class="mr2">mdi mdi-plus</w-icon>Add shelf</w-button
      >
      <div class="mx1"></div>
      <w-confirm
        @confirm="emit('deleteShop', props.shop.id)"
        confirm="yes"
        :question="`Really delete shop ${props.shop.name}?`"
        cancel="no"
        shadow
        bg-color="warning-dark1"
      >
        <w-icon lg color="white">mdi mdi-delete-forever-outline</w-icon>
      </w-confirm>
    </template>
    <add-shelf-dialog
      :shop-name="props.shop.name"
      v-model="dialogVisible"
      @add-shelf="addShelf"
    ></add-shelf-dialog>
    <w-checkbox
      :model-value="shop.includeOrphanedItems"
      @update:model-value="setIncludeOrphans($event)"
      >Include orphaned items
    </w-checkbox>
    <w-table
      :headers="shelfTableHeaders"
      fixed-headers
      class="h-40"
      :items="shelves"
    >
      <template #item-cell.id="{ item }">
        <w-confirm
          @confirm="deleteShelf(item.id)"
          confirm="yes"
          :question="`Remove shelf ${item.name} from shop ${props.shop.name}?`"
          cancel="no"
          shadow
          icon="mdi mdi-delete-forever-outline"
          color="white"
          bg-color="warning-dark1"
        >
        </w-confirm>
      </template>
    </w-table>
  </w-card>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { Shelf, Shop, useShoppingStore, UUID } from "../shoppingStore";
import AddShelfDialog from "./AddShelfDialog.vue";

const props = defineProps<{ shop: Shop }>();
const emit = defineEmits<{
  (eventName: "deleteShop", shopId: UUID): void;
}>();

const store = useShoppingStore();
const shelves = computed(() => store.getShelves(props.shop.id));
const addShelf = (shelfName: string) => {
  store.addShelf(props.shop.id, shelfName);
};

const setIncludeOrphans = (value: boolean) => {
  store.setIncludeOrphanedItems(props.shop, value);
  console.log("settning include orphans to", value);
};

const shelfTableHeaders = [
  { label: "Shelves", key: "name" },
  { label: "", key: "id", width: "45px" },
];

const shopTitle = props.shop.name || "(kein Name)";
const dialogVisible = ref(false);

const showAddShelfDialog = () => {
  dialogVisible.value = true;
};

const deleteShelf = (shelfId: UUID) => {
  store.deleteShelfFromShop(shelfId, props.shop.id);
};
</script>

<style scoped>
.h-40 {
  max-height: 40vh;
}
</style>
