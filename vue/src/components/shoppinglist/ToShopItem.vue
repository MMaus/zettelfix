<template>
  <div class="m-0 p-0">
    <div
      v-if="item.stored"
      class="storedItem mt-1 text-success text-left font-weight-bold"
      v-on:click="onClickHandler"
    >
      {{ item.qty }}x {{ item.name }}
    </div>

    <div v-else class="bg-secondary rounded p-0 m-1">
      <div class="d-flex py-1 align-items-center font-weight-bold text-light">
        <div class="pl-1 text-left">
          <div class="btn-group m-0 p-0" role="group">
            <button
              type="button"
              class="btn btn-primary btn-sm"
              v-on:click="decreaseQty"
            >
              -
            </button>
            <button
              type="button"
              class="btn btn-outline-primary bg-white btn-sm"
            >
              <b>{{ item.qty }}</b>
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              v-on:click="increaseQty"
            >
              +
            </button>
          </div>
        </div>
        <div
          class="container-fluid pl-3 text-left mt-1"
          @click="onClickHandler"
        >
          {{ item.name }}
        </div>
        <div class="ml-auto mr-1" aria-label="change quantity">
          <button
            type="button"
            class="btn btn-warning btn-sm"
            v-on:click="toggleCollapse()"
          >
            <span class="nav-item dropdown-toggle"></span>
          </button>
        </div>
      </div>
      <div class="collapse pt-2" v-bind:class="{ show: showOptions }">
        <button
          class="btn btn-danger text-white font-weight-bold mr-3"
          v-on:click="notifyDelete()"
        >
          x
        </button>
        <select id="category" ref="category" @change="changeCategory($event)">
          <option
            v-for="cat in categories"
            :key="cat.name"
            :value="cat.name"
            :selected="cat.name === item.category"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Category } from "../../use/localApi";

export default defineComponent({
  data: function () {
    return {
      showOptions: false,
    };
  },
  methods: {
    toggleCollapse: function () {
      this.showOptions = !this.showOptions;
    },
    notifyDelete: function () {
      this.emitChained("delete-item", this.item.id);
      console.log("Deleting " + this.item.name);
    },
    increaseQty: function () {
      const copy = { qty: 0 };
      Object.assign(copy, this.item);
      copy.qty = this.item.qty + 1;
      this.emitChained("update-qty", copy);
    },

    emitChained: function (eventName: string, eventData: any) {
      console.log(`emitting ${eventName} with data:`, eventData);
      this.$emit(eventName, eventData);
      console.log("done emitting");
      let vm = this.$parent;
      while (vm) {
        console.log("emitting to:", vm);
        vm.$emit(eventName, eventData);
        vm = vm.$parent;
      }
    },

    changeCategory: function (event: any) {
      const copy = {
        category: undefined,
      };
      Object.assign(copy, this.item);
      copy.category = event.target.value;
      this.emitChained("update-category", copy);
      console.log(
        "Category of " + this.item.name + " changed to " + event.target.value
      );
    },

    decreaseQty: function () {
      const copy = { qty: 0 };
      Object.assign(copy, this.item);
      copy.qty = this.item.qty - 1;
      this.emitChained("update-qty", copy);
      console.log("Notifying cart toggle " + this.item.name);
    },

    onClickHandler: function () {
      console.log(`toggling item ${this.item.name}`);
      this.emitChained("toggle-cart", this.item);
    },
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    categories: {
      type: Array as PropType<Category[]>,
      required: true,
    },
  },
});
</script>
<style scoped>
.stored-item {
  background-color: palegoldenrod;
}
</style>
