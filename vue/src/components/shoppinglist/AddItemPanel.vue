<template>
  <w-flex wrap>
    <div class="xs1 md3"></div>
    <div class="xs10 md6 pa2 mb0 pb0">
      <w-flex grow wrap>
        <div class="xs12 text-left">
          <span class="h4 indigo">Add a new Item</span>
        </div>
        <div class="xs9 text-left">
          <w-input
            type="text"
            class="ma2"
            list="itemlist"
            id="newWhishlistItem"
            v-model="newItemText"
            v-on:keyup.enter="submitNewItem"
            tabindex="1"
            placeholder="add item here"
          >
            Add item to list
          </w-input>
          <datalist id="itemlist">
            <option
              v-for="item in allItems"
              :key="item.id + 'item'"
              :value="item.itemName"
            >
              {{ item.itemName }}
            </option>
          </datalist>
        </div>
        <div class="xs3 align-self-center">
          <w-button class="" type="button" @click="submitNewItem">
            Enter Item
          </w-button>
        </div>
      </w-flex>
    </div>
    <div class="xs1 md3"></div>

    <teleport to="#app">
      <w-dialog
        v-model="showCategoryDialog"
        title="Please select a category"
        persistent
        width="600px"
      >
        <div class="text-left">
          <w-input
            type="text"
            list="categorydatalist"
            class="ma2 text-left"
            id="categoryText"
            v-model="categoryText"
            tabindex="3"
            @keyup.enter="submitNewItem"
            placeholder="(start typing for autocomplete)"
            >Enter Category</w-input
          >
          <datalist id="categorydatalist">
            <option
              v-for="catName in allCategoryNames"
              :key="catName"
              :value="catName"
            >
              {{ catName }}
            </option>
          </datalist>
        </div>
        <template #actions>
          <div class="spacer" />
          <w-button
            class="mr2"
            @click="showCategoryDialog = false"
            bg-color="primary"
          >
            Cancel
          </w-button>
          <w-button @click="submitNewItem" bg-color="success"> Ok </w-button>
        </template>
      </w-dialog>
    </teleport>
  </w-flex>
</template>

<script lang="ts">
import { computed, nextTick, Ref, watch } from "vue";
import { defineComponent, ref } from "vue";
import { Category, ShoppingItem } from "@/store/shopping/types";
import { useStore } from "vuex";
export default defineComponent({
  emits: ["toggle-sidebar"],
  setup(_, context) {
    const store = useStore();

    const sidebarVisible = ref(false);
    const showCategoryDialog = ref(false);

    const newItemText = ref("");
    const categoryText = ref("");

    const allCategories = store.getters[
      "shopping/categories"
    ] as Array<Category>;

    const allItems = store.getters["shopping/allItems"] as Array<ShoppingItem>;

    const allCategoryNames = computed(() =>
      allCategories.map((it) => it.catName)
    );

    function resetForm() {
      newItemText.value = "";
      categoryText.value = "";
    }

    async function submitNewItem() {
      await nextTick();
      const inputValue = newItemText.value;
      // This is not only a shortcut but also a BUGFIX!
      // Actually, this function is called twice on hitting "Enter", and I don't know why (yet ...)
      if (!inputValue) {
        return;
      }
      let returnHere = false;
      if (returnHere) {
        return;
      }

      const matchingItem = allItems.find(
        (it) => it.itemName.toLowerCase() === newItemText.value.toLowerCase()
      );

      if (!matchingItem && !categoryText.value) {
        showCategoryDialog.value = true;
        return;
      }

      if (matchingItem) {
        const matchingCategory = allCategories.find((cat) =>
          cat.items.find((it) => it.id === matchingItem.id)
        );
        if (matchingCategory) {
          categoryText.value = matchingCategory.catName;
          console.log(
            `YEAH, cat = ${
              matchingCategory.id + ":" + matchingCategory.catName
            }`
          );
          store.dispatch("shopping/activateItem", {
            itemId: matchingItem.id,
            categoryId: matchingCategory.id,
          });
        }
      } else {
        if (categoryText.value) {
          store.dispatch("shopping/addItem", {
            itemName: newItemText.value,
            categoryName: categoryText.value,
          });
        } else {
          console.log(
            "NOT ADDING cuz invalid data:",
            newItemText.value,
            categoryText.value
          );
        }
      }
      showCategoryDialog.value = false;
      resetForm();
    }

    const onCategoryListChange = (event: Event) => {
      console.log("Category List Change! event target=" + event?.target);
      if (event?.target) {
        categoryText.value = "";
      }
    };

    const onCategoryTextChange = () => {
      console.log("Category Text Changed!");
      if (categoryText.value) {
        // categoryList.value!.value = "";
      }
    };

    const toggleSidebar = function () {
      context.emit("toggle-sidebar");
      sidebarVisible.value = !sidebarVisible.value;
    };

    const uiCallbacks = {
      onCategoryListChange,
      onCategoryTextChange,
      toggleSidebar,
    };

    // data binding to UI input elements
    const uiModels = {
      newItemText,
      categoryText,
    };

    // references to HTML input elements

    return {
      allCategories,
      allCategoryNames,
      allItems,
      sidebarVisible,
      showCategoryDialog,

      submitNewItem,

      ...uiModels,
      ...uiCallbacks,
    };
  },
});
</script>
<style scoped>
.bordered {
  border: 1px solid red;
}
.w-input {
  text-align: left;
  align-content: left;
}
</style>
