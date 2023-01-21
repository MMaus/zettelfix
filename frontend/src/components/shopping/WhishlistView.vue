<template>
  <w-card
    shadow
    title="Whishlist"
    title-class="amber-light5--bg"
    class="text-left"
  >
    <template #title>
      <w-flex wrap>
        <div class="xs12 sm3">
          <span class="title2 ma2">Whishlist</span>
        </div>
        <div class="xs12 sm9">
          <dropdown-select
            label="please select item"
            v-model:search-text="searchText"
          >
            <w-table
              :headers="searchTableHeaders"
              no-headers
              class="full-width h100"
              :items="testItems"
              v-model="selectedSearchRows"
            >
              <template #header-label="{ label, index }">
                <span class="caption">{{ label }}</span>
              </template>
              <template #no-data>
                No item (create an item <w-button>HERE</w-button>)
              </template>
              <!-- <template #item-cell.qty="{ item }">
                  <w-flex>
                    <div class="text-center">
                      <div class="flex" @click.stop="">
                        <w-button>-</w-button>
                        <w-input class="narrow" v-model="item.qty"></w-input>
                        <w-button>+</w-button>
                      </div>
                    </div>
                  </w-flex>
                </template>
                <template #item-cell.name="{ item, label }">
                  LABEL: {{ label }} ( {{ item.name }})
                </template> -->
            </w-table>
          </dropdown-select>
        </div>
      </w-flex>
    </template>
    <w-input
      v-model="searchText"
      class="mb2"
      placeholder="filter items"
      inner-icon-right="mdi mdi-close-circle"
      @click:inner-icon-right="searchText = ''"
    ></w-input>

    <w-table
      :headers="whishlistHeaders"
      fixed-headers
      selectable-rows
      resizable-columns
      v-model:selected-rows="selectedRows"
      class="h-40"
      :items="whishlistItemData"
      :filter="itemFilter"
    >
      <template #no-data> There are no items on your whishlist yet </template>
      <template #item-cell.name="{ item }">
        {{ item.name
        }}<span v-if="item.orphaned" class="ml2 caption">(orphaned)</span>
      </template>
    </w-table>
  </w-card>
</template>
<script setup lang="ts">
import { computed, ref, type Ref } from "vue";
import { type UUID, useShoppingStore } from "./shoppingStore";
import DropdownSelect from "../common/DropdownSelect.vue";

const showList = ref(false);

const selectedItem = ref(null) as Ref<any>;
const searchText = ref("");
const showDrawer = ref(false);

const selectedSearchRows = ref([]);
const selectedRows = ref([]);

const itemFilter = (item: { item: UUID; name: string }) => {
  return (
    !searchText.value ||
    item.name.toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase())
  );
};
const whishlistHeaders = [
  { label: "Quantity", key: "qty", width: "145px" },
  { label: "Name", key: "label" },
];

const store = useShoppingStore();

const testItems = computed(() => {
  const searchString = searchText.value.toLocaleLowerCase().trim();
  return store.items
    .filter(
      (it) =>
        !searchString || it.name.toLocaleLowerCase().includes(searchString)
    )
    .map((it) => ({ label: it.name, qty: 2, id: it.id }));
});

const searchTableHeaders = [
  { label: "Quantity", key: "qty", width: "95px" },
  { label: "Item", key: "label" },
];

// store.addItemToWhishlist(store.items[2].id);

// const getWhishlistData = () => {
//   return store.whishlist.map((it) => {
//     return {
//       id: it.item,
//       name: store.getItem(it.item)?.name || "unknown item",
//       amount: it.amount,
//     };
// }

// const whishlistItemData = [{

// ]

const whishlistItemData = computed(() => {
  return store.whishlist.map((it) => {
    return {
      id: it.item,
      name: store.getItem(it.item)?.name || "unknown item",
      amount: it.amount,
    };
  });
});
</script>
<style scoped>
.dropdownlist {
  position: absolute;
}

.full-width {
  width: 100%;
}

.narrow {
  width: 32px;
}

.h100 {
  height: 100%;
}

.flex {
  display: flex;
}
</style>
