<template>
  <div class="w100 purple-light6--bg">
    <w-table
      :headers="searchTableHeaders"
      no-headers
      class="full-width"
      :items="selectableItems"
      v-model="selectedSearchRows"
      :filter="itemFilter"
    >
      <template #header-label="{ label }">
        <span class="caption">{{ label }}</span>
      </template>
      <template #no-data>
        No item (create an item <w-button>HERE</w-button>)
      </template>
      <template #item-cell.amount="{ item }">
        <NumberInput
          :model-value="item.amount"
          @update:model-value="(value) => notifyUpdate(item, value)"
          class="w45 mr3"
        ></NumberInput>
      </template>
      <template #item-cell.item="{ item, label }">
        <div @click="onItemClick(item)">
          {{ item.item.name }}
        </div>
      </template>
    </w-table>
    <div v-if="!anyItemVisible" class="body pa3">
      No item matches your search. <br />
      <w-button @click="showCreateNewItemDialog()">Create</w-button> a new one
      instead?
    </div>
    <create-item-dialog
      :model-value="createItemDialogVisible"
      @update:model-value="onVisibilityChange"
      :item-name="searchText"
      @create-item="onCreateNewItem"
    ></create-item-dialog>
  </div>
</template>
<script setup lang="ts">
import NumberInput from "@/components/common/NumberInput.vue";
import { computed, ref, watch } from "vue";
import { useShoppingStore, UUID, WhishlistItemPreview } from "../shoppingStore";
import CreateItemDialog from "@/components/shopping/shops/CreateItemDialog.vue";

const props = defineProps<{
  searchText?: string;
}>();

const createItemDialogVisible = ref(false);

const emit = defineEmits<{
  (eventName: "itemClicked", value: WhishlistItemPreview): void;
}>();

const notifyUpdate = (item: WhishlistItemPreview, value: number) => {
  console.log(`Received update for ${item} with value ${value}`);
  store.setWhishlistItem(item.item.id, value);
};

const onItemClick = (item: WhishlistItemPreview) => {
  notifyUpdate(item, item.amount + 1);
  emit("itemClicked", item);
};

const showCreateNewItemDialog = () => {
  createItemDialogVisible.value = true;
};

const onVisibilityChange = (val: boolean) => {
  createItemDialogVisible.value = val;
};

const onCreateNewItem = (newItem: { itemName: string; shelves: UUID[] }) => {
  createItemDialogVisible.value = false;
  // TODO: create item in store
  console.log("TODO: create new item in store:", newItem);
};

const selectedSearchRows = ref([]);
const itemFilter = (item: WhishlistItemPreview) => {
  return (
    !props.searchText ||
    item.item.name
      .toLocaleLowerCase()
      .includes(props.searchText.trim().toLocaleLowerCase())
  );
};

const anyItemVisible = computed(() => {
  return store.whishlistItemCandidates.filter(itemFilter).length > 0;
});

const store = useShoppingStore();

const selectableItems = computed(() => store.whishlistItemCandidates);

const searchTableHeaders = [
  { label: "Quantity", key: "amount", width: "95px" },
  { label: "Item", key: "item" },
];
</script>
<style scoped>
.w45 {
  width: 4.5rem;
}

.w100 {
  width: 100%;
}
</style>
