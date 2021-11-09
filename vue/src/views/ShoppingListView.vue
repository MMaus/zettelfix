<template>
  <div class="bg-secondary shopping-background max">
    <w-flex wrap class="mb5">
      <transition-group
        name="transition-anim"
        tag="div"
        class="xs12 columns is-multiline"
      >
        <category-panel
          v-for="cat in storedCategories"
          :key="cat.id"
          :category="cat"
          :id="'cat:' + cat.id"
          :mitt="emitter"
          class="transition-anim-item"
          v-on="categoryCallbacks"
        >
        </category-panel>
      </transition-group>
      <div class="bottom-spacer"></div>
    </w-flex>
  </div>
</template>

<script lang="ts">
import { Ref, provide, readonly, watch } from "vue";

import CategoryPanel from "@/components/shoppinglist/CategoryPanel.vue";

import mitt from "mitt";

import { ItemRepository } from "../use/itemStore";
import { Item } from "../use/localApi";

import { Category } from "@/store/shopping/types";

import { defineComponent, computed, ref } from "vue";

import { Store, useStore } from "vuex";
import { ShoppingItem, SyncState } from "@/store/shopping/types";
import { JuteBagState } from "@/store/types";

const itemRepo = new ItemRepository("jutebag.shoppinglist");
const emitter = mitt();

export default defineComponent({
  components: {
    CategoryPanel,
  },
  setup() {
    const store = useStore() as Store<JuteBagState>;

    provide("categoriesList", readonly(store.getters["shopping/categories"]));
    provide("allItemsList", readonly(store.getters["shopping/allItems"]));

    // FIXME: add type information
    const storedCategories = computed(
      () => store.getters["shopping/categories"]
    );

    const user = ref(""); // some initial value
    const showDrawer = ref(false); // some initial value

    // note: this is a reactive vue property ("ref")
    const items: Ref<Array<Item>> = itemRepo.itemsRef;
    // const categoriesReactive: Array<Category> = itemRepo.categoriesReactive;

    const showAddItemEnh = ref(false);
    const newCategory = ref("");
    const loggedIn = ref(false);
    const userEmail = ref("");
    const sidebarVisible = ref(false);

    // properties to be filled by the setup method
    const newItem: Ref<null | HTMLInputElement> = ref(null);
    const categoryList: Ref<null | HTMLSelectElement> = ref(null);

    const buttonClass = computed(() => {
      const syncState = store.getters["shopping/syncState"] as SyncState;
      if (syncState === "SYNC") {
        return "bg-yellow";
      }
      if (syncState === "SYNCING") {
        return "bg-green";
      }
      if (syncState === "SYNC_ERROR") {
        return "bg-error";
      }
      return "bg-gray";
    });

    const upload = () => {
      store.dispatch("shopping/uploadItems");
      console.log("TODO: commit upload action to store");
      // itemRepo.upload(userEmail.value);
    };

    loggedIn.value = store.getters["user/isLoggedIn"];

    watch(
      () => store.getters["user/isLoggedIn"],
      (isLoggedIn) => {
        loggedIn.value = isLoggedIn as unknown as boolean;
      }
    );

    const download = () => {
      store.dispatch("shopping/downloadItems");
      console.log("TODO: commit upload action to store");
      // const user = firebase.auth().currentUser?.email;
      // if (user == null) {
      //   console.error("Unknown user, cannot download cart items.");
      //   return;
      // }
      // itemRepo.download(user);
    };

    const deleteItem = (itemId: number) => {
      itemRepo.deleteItem(itemId);
    };

    const toggleCart = (item: Item) => {
      console.log(`heard toggle cart for ${item.name}`);
      itemRepo.toggleCart(item);
    };

    const updateQty = (item: Item) => {
      itemRepo.updateQty(item.id, item.qty);
    };

    const updateCategory = (item: Item) => {
      itemRepo.updateCategory(item.id, item.category);
    };

    const pullCategory = (categoryName: string) => {
      itemRepo.pullCategory(categoryName);
    };

    const pushCategory = (categoryName: string) => {
      itemRepo.pushCategory(categoryName);
    };

    const toggleSidebar = function () {
      sidebarVisible.value = !sidebarVisible.value;
    };

    const scrollToCategory = function (catName: string) {
      console.log(`SCROLLING ... that cat name is ${catName}`);
      const cats = storedCategories.value as Array<Category>;
      console.log("CATS = ", cats);
      const catId = storedCategories.value.find(
        (cat: Category) => cat.catName === catName
      )?.id;
      console.log("CatId = ", catId);
      const catElem = document.getElementById("cat:" + catId);
      const headerOffset = 56;
      const elementPosition = catElem?.getBoundingClientRect().top;
      console.log("elem top:" + elementPosition);
      const elemPos2 = catElem?.offsetTop;
      console.log("elem offsetTop:" + elemPos2);

      // const offsetPosition = elementPosition ?? -headerOffset;
      const offsetPosition = (elemPos2 || 0) - headerOffset;
      console.log(`scrolling to ${offsetPosition}`);
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      // catElem?.scrollIntoView();
      sidebarVisible.value = false;
      emitter.emit("do-open", catName);
    };

    const categoryCallbacks = {
      "toggle-cart": function (item: ShoppingItem) {
        console.log("====== toggle-cart called for", item); // ?? not cats!
      },
      toggleCart: function (item: ShoppingItem) {
        console.log("====== toggleCart called for item", item);
      },
      "delete-item": function (item: ShoppingItem) {
        console.log("delete item called for", item);
      },
      "update-qty": function (item: ShoppingItem) {
        console.log("update qty for item", item);
      },
      "update-category": function (item: ShoppingItem) {
        console.log("update category for item", item);
      },
      // "pull-category": function(catId: string) {
      //   console.log("pull category category ", catId);
      // },
      pullCategory: function (catId: Category) {
        store.dispatch("shopping/pullCategory", { categoryId: catId });
      },
      pushCategory: function (catId: string) {
        store.dispatch("shopping/pushCategory", { categoryId: catId });
      },
      // @delete-item="deleteItem"
      // @update-qty="updateQty"
      // @update-category="updateCategory"
      // @pull-category="pullCategory"
      // @push-category="pushCategory"
    };

    return {
      storedCategories,
      categoryCallbacks,
      buttonClass,

      user,
      items,
      showAddItemEnh,
      newCategory,
      loggedIn,
      userEmail,
      newItem,
      categoryList,
      // UI functionality
      emitter,
      showDrawer,
      // Cart change functionality
      upload,
      download,
      deleteItem,
      toggleCart,
      updateQty,
      updateCategory,
      pushCategory,
      pullCategory,
      toggleSidebar,
      sidebarVisible,
      scrollToCategory,
    };
  },
});
</script>

<style scoped>
.bg-gray {
  background-color: grey;
}

.bg-green {
  background-color: green;
}

.bg-yellow {
  background-color: goldenrod;
}

.bg-error {
  background-color: crimson;
  color: azure;
  font-weight: bold;
}

.bottom-spacer {
  height: 5rem;
}

.max {
  min-height: 95vh;
}

.shopping-background {
  background-image: url("../assets/background-2.jpg");
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-size: cover;
  /* filter: saturate(0.35); */
}

.cardly {
  padding: 0.25rem;
  border-radius: 0.25rem;
  background-color: rgba(225, 213, 233, 0.95);
}

.category-button {
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  padding-left: 0.5rem;
  margin-left: 20px;
  /* background-color: azure; */
  width: 100%;
  text-align: left;
  color: antiquewhite;
}

.transition-anim {
  display: inline-block;
}

.transition-anim-move {
  transition: transform 0.8s ease;
}

.transition-anim-item {
  transition: all 0.5s;
  display: inline-block;
}
.transition-item-enter, .tansition-item-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.transition-item-leave-active {
  position: absolute;
}
.transition-item-active {
  position: absolute;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(-50vw);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease-in-out;
}

.v-enter-to,
.v-leave-from {
  transform: translateX(0);
}
</style>
