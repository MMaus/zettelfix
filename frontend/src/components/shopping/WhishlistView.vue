<template>
  <w-card shadow title="Whishlist" title-class="amber-light5--bg">
    <template #title>
      <w-flex wrap>
        <div class="bordered mr5">
          <span class="title2 ma2">Whishlist</span>
        </div>
        <div class="bordered">
          <w-input label="add item"></w-input>
        </div>
        <div class="bordered">
          <w-input label="search Item" @focus="showDrawer = true"> </w-input>
          <div
            v-show="showDrawer"
            class="bordered testfloat"
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
              <w-button
                @click="showDrawer = false"
                icon="wi-cross"
                sm
                outline
                round
                absolute
              >
              </w-button>
              <w-flex><div class="spacer"></div></w-flex>
              <w-list
                class="full-width"
                :items="testItems"
                v-model="selectedItem"
              >
                <template #item="{ item }">
                  <w-flex>
                    <div class="bordered">
                      <div class="flex" @click.stop="">
                        <w-button>-</w-button>
                        <w-input class="narrow" v-model="item.qty"></w-input>
                        <w-button>+</w-button>
                      </div>
                    </div>
                    <div class="ml3">{{ item.label }}</div>
                  </w-flex>
                </template>
              </w-list>
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

const selectedRows = ref([]);

const itemFilter = (item: { item: UUID; name: string }) => {
  return (
    !searchText.value ||
    item.name.toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase())
  );
};
const whishlistHeaders = [
  { label: "Quantity", key: "amount", width: "145px" },
  { label: "Name", key: "name" },
];

const store = useShoppingStore();

const testItems = ref([
  { label: "foo", qty: "0" },
  { label: "bar", qty: "3" },
  { label: "baz", qty: 4 },
]);

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
.testfloat {
  position: absolute;
}

.full-width {
  width: 100%;
}

.narrow {
  width: 32px;
}

.flex {
  display: flex;
}
</style>
