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
          <w-input
            label="search item"
            v-model="searchText"
            @focus="showDrawer = true"
          >
          </w-input>
          <div
            v-show="showDrawer"
            class="dropdownlist sh2 bdrs2 bd2"
            style="height: 40vh; width: 60vw; z-index: 200"
          >
            <w-drawer
              absolute
              top
              no-overlay
              v-model="showDrawer"
              height="40vh"
              @click="showDrawer = false"
            >
              <!-- <div class="bordered full-width"> -->
              <w-button
                @click.stop="showDrawer = false"
                icon="wi-cross"
                absolute
                sm
                outline
                round
                z-index="100"
              ></w-button>

              <w-table
                :headers="searchTableHeaders"
                fixed-headers
                class="full-width h100"
                :items="testItems"
                v-model="selectedSearchRows"
              >
                <template #header-label="{ label, index }">
                  <span class="caption">{{ label }}</span>
                </template>
                <template #no-data>
                  No item (create item <w-button>HERE</w-button>)
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
              <!-- </div> -->
            </w-drawer>
          </div>
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
