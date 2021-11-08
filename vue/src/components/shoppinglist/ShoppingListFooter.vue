<template>
  <footer class="footer fixed-bottom">
    <div class="d-flex p-2 new-item-block">
      <div class="">
        <button
          class="btn shadow-sm bg-white"
          type="button"
          @click="toggleSidebar"
        >
          <span v-if="!sidebarVisible">&gt;</span>
          <span v-else>&lt;</span>
        </button>
      </div>
      <div class="flex-grow-1">
        <div class="input-group mb-2 p-1">
          <input
            type="text"
            class="form-control"
            list="itemlist"
            id="newWhishlistItem"
            v-model="newItemText"
            ref="newItemInput"
            v-on:keyup.enter="submitNewItem"
            tabindex="1"
            @focus="onInputFocus()"
            placeholder="add item here"
          />
          <datalist id="itemlist">
            <option
              v-for="item in allItems"
              :key="item.id"
              :value="item.itemName"
              >{{ item.itemName }}</option
            >
          </datalist>

          <div class="input-group-append">
            <button
              tabindex="5"
              class="btn btn-primary"
              type="button"
              @click="submitNewItem"
            >
              Enter Item
            </button>
          </div>
          <div>
            <button
              tabindex="6"
              type="button"
              class="btn btn-warning"
              @click="toggleAddItemEnh()"
            >
              <span class="nav-item dropdown-toggle"></span>
            </button>
          </div>
        </div>
        <div
          class="input-group collapse"
          v-bind:class="{ show: showAddItemEnh }"
        >
          <select
            tabindex="2"
            id="categoryList"
            ref="categoryList"
            @change="onCategoryListChange"
            @keyup.enter="submitNewItem"
          >
            <option value></option>
            <option
              v-for="cat in allCategories"
              :key="cat.id"
              :value="cat.catName"
              >{{ cat.catName }}</option
            >
          </select>
          <input
            type="text"
            list="categorylist"
            class="form-control"
            id="categoryText"
            v-model="categoryText"
            tabindex="3"
            @keypress="onCategoryTextChange"
            @keyup.enter="submitNewItem"
            placeholder="new category"
          />
          <datalist id="categorylist">
            <option
              v-for="catName in allCategoryNames"
              :key="catName"
              :value="catName"
              >{{ catName }}</option
            >
          </datalist>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { computed, inject, Ref } from "vue";
import { defineComponent, ref } from "vue";
import { Category, ShoppingItem } from "@/store/shopping/types";
import { useStore } from "vuex";

export default defineComponent({
  emits: ["toggle-sidebar", "added-to-category"],
  setup(_, context) {
    const store = useStore();

    const showAddItemEnh = ref(false);
    const sidebarVisible = ref(false);

    const newItemText = ref("");
    const categoryText = ref("");

    const allCategories = inject("categoriesList") as Array<Category>;
    const allItems = inject("allItemsList") as Array<ShoppingItem>;

    const allCategoryNames = computed(() =>
      allCategories.map((it) => it.catName)
    );

    const categoryList: Ref<null | HTMLSelectElement> = ref(null);
    const newItemInput: Ref<null | HTMLInputElement> = ref(null);

    function resetForm() {
      newItemText.value = "";
      categoryText.value = "";
      newItemInput.value?.focus();
    }

    function submitNewItem() {
      console.log("YEAH");
      const matchingItem = allItems.find(
        (it) => it.itemName === newItemText.value
      );
      if (matchingItem) {
        const matchingCategory = allCategories.find((cat) =>
          cat.items.find((it) => it.id === matchingItem.id)
        );
        if (matchingCategory) {
          categoryText.value = matchingCategory.catName;
          console.log(
            `YEAH, cat = ${matchingCategory.id +
              ":" +
              matchingCategory.catName}`
          );
          store.dispatch("shopping/activateItem", {
            itemId: matchingItem.id,
            categoryId: matchingCategory.id,
          });
        }
      } else {
        store.dispatch("shopping/addItem", {
          itemName: newItemText.value,
          categoryName: categoryText.value,
        });
      }
      context.emit("added-to-category", categoryText.value);
      resetForm();
    }

    const onInputFocus = () => {
      console.log("input got focus");
      showAddItemEnh.value = true;
    };

    const onCategoryListChange = (event: Event) => {
      console.log("Category List Change! event target=" + event?.target);
      if (event?.target) {
        categoryText.value = "";
      }
    };

    const onCategoryTextChange = () => {
      console.log("Category Text Changed!");
      if (categoryText.value) {
        categoryList.value!.value = "";
      }
    };

    const toggleAddItemEnh = () => {
      showAddItemEnh.value = !showAddItemEnh.value;
    };

    const toggleSidebar = function() {
      context.emit("toggle-sidebar");
      sidebarVisible.value = !sidebarVisible.value;
    };

    const uiCallbacks = {
      onInputFocus,
      onCategoryListChange,
      onCategoryTextChange,
      toggleAddItemEnh,
      toggleSidebar,
    };

    // data binding to UI input elements
    const uiModels = {
      newItemText,
      categoryText,
    };

    // references to HTML input elements
    const uiElements = {
      newItemInput,
      categoryList,
    };

    return {
      allCategories,
      allCategoryNames,
      allItems,
      showAddItemEnh,
      sidebarVisible,

      submitNewItem,

      ...uiModels,
      ...uiElements,
      ...uiCallbacks,
    };
  },
});
</script>
<style scoped>
.new-item-block {
  background-color: #ffeaed;
}
</style>
