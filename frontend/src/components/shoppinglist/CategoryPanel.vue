<template>
  <div
    class="xs12 md6 lg4 pa1"
    :class="{ 'col-4 greenish': !showItems, 'col-12': showItems }"
    :id="'cat:' + category.catName"
  >
    <w-card title-class="indigo-light5--bg" bg-color="orange-light5">
      <template #title>
        <w-flex>
          <div
            class="xs9 text-left pl5 indigo-dark3"
            @click="toggleShowNevertheless"
          >
            {{ category.catName }}
          </div>
          <div class="xs3">
            <category-mover
              v-if="showItems"
              v-on="{ pullCategory, pushCategory }"
            />
          </div>
        </w-flex>
      </template>
      <!-- <div
          class="card-header text-left"
          v-bind:class="{ 'text-success': isDone, 'category-done': isDone }"
          @click="toggleShowNevertheless"
        >
          <div class="indigo-light5--bg">
            <div :class="{ 'col-8': showItems, 'col-12': !showItems }">
              <span
                class="category-title"
                :class="{ smallTitle: !showItems }"
                >{{ category.catName }}</span
              >
            </div>
          </div>
        </div> -->
      <div class="ma0 pa0" v-if="showItems">
        <transition-group tag="div" name="item-list">
          <shopping-item-display
            v-for="item in todoItems"
            :key="item.id + 'item'"
            :item="item"
            :category="category"
            @toggle-cart="logToggle"
          ></shopping-item-display>
          <shopping-item-display
            v-for="item in doneItems"
            :key="item.id + 'item'"
            :item="item"
            :category="category"
            @toggle-cart="logToggle"
          ></shopping-item-display>
        </transition-group>
      </div>
    </w-card>
  </div>
</template>

<script lang="ts">
import ShoppingItemDisplay from "./ShoppingItemDisplay.vue";
import { defineComponent, PropType } from "vue";
import { Emitter, Handler } from "mitt";
import CategoryMover from "./CategoryMover.vue";
import { Category, itemSorter, ShoppingItem } from "@/store/shopping/types";

export default defineComponent({
  data() {
    return {
      showNevertheless: false,
    };
  },

  props: {
    category: {
      type: Object as PropType<Category>,
      required: true,
    },
    mitt: {
      type: Object as PropType<Emitter<Record<string, unknown>>>,
      required: true,
    },
  },

  created: function () {
    this.mitt.on("do-open", this.doOpen as Handler);
  },

  methods: {
    toggleShowNevertheless: function (): void {
      if (!this.isDone) {
        this.showNevertheless = false;
        return;
      }

      this.showNevertheless = !this.showNevertheless;
    },
    doOpen: function (catName: string): void {
      if (this.category.catName === catName) {
        this.showNevertheless = true;
      }
    },

    pullCategory: function () {
      console.log("PULLING BABY");
      this.$emit("pull-category", this.category.id);
    },
    pushCategory: function () {
      console.log("PUSH IT TO THE LIMIT BABY");
      this.$emit("push-category", this.category.id);
    },

    logToggle: function (firstArg: any, secondArg: any) {
      console.log("logtoggle called");
      console.log("first arg:", firstArg);
      console.log("second arg:", secondArg);
    },
  },

  computed: {
    isDone(): boolean {
      return this.category.isDone;
    },
    showItems(): boolean {
      return !this.isDone || this.showNevertheless;
    },
    doneItems(): Array<ShoppingItem> {
      return this.category.items.filter((it) => it.inCart).sort(itemSorter);
    },
    todoItems(): Array<ShoppingItem> {
      return this.category.items.filter((it) => !it.inCart).sort(itemSorter);
    },
  },

  watch: {
    isDone(newIsDone: boolean) {
      if (!newIsDone) {
        this.showNevertheless = false;
      }
    },
  },

  components: {
    ShoppingItemDisplay,
    CategoryMover,
  },
});
</script>

<style scoped>
.category-title {
  text-transform: capitalize;
  font-size: 1.2rem;
  font-weight: bold;
}
.smallTitle {
  font-size: 0.82rem;
  font-weight: normal;
  padding: 0;
  overflow: hidden;
}
.greenish {
  background-color: rgba(45, 189, 129, 0.616);
}
.category-done {
  background-color: papayawhip;
  padding: 1rem; /* FIXME: 0rem leads to overflow!! fix item hierarchy */
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
  /* padding: 0.4rem; */
}

.item-list-enter-active,
.item-list-leave-active {
  transition: all 0.5s ease-in-out;
}

.item-list-move {
  transition: transform 0.5s ease;
}

.item-list-enter-from,
.item-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
