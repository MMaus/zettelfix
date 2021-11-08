<template>
  <div class="m-0 p-0">
    <div
      v-if="isInCart"
      class="storedItem mt-1 text-success text-left font-weight-bold"
      @click="toggleInCart"
    >
      {{ item.quantity }}x {{ item.itemName }}
    </div>

    <div v-else class="bg-secondary rounded p-0 m-1 requiredItem">
      <div class="d-flex py-1 align-items-center font-weight-bold text-light">
        <div class="pl-1 text-left">
          <div
            class="btn-group m-0 p-0"
            role="group"
            aria-label="change quantity"
          >
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
              <b>{{ item.quantity }}</b>
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
          class="container-fluid pl-3 text-left mt-1 itemNameDisplay"
          @click="toggleInCart"
        >
          {{ item.itemName }}
        </div>
        <div class="ml-auto mr-1">
          <button
            type="button"
            class="btn btn-danger btn-sm"
            @click="deleteItem"
          >
            <span>
              <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M16,10V17A1,1 0 0,1 15,18H9A1,1 0 0,1 8,17V10H16M13.5,6L14.5,7H17V9H7V7H9.5L10.5,6H13.5Z"
                /></svg
            ></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ShoppingItem, Category } from "@/store/shopping/types";
import { computed, defineComponent, PropType, watch } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<ShoppingItem>,
      required: true,
    },
    category: {
      type: Object as PropType<Category>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    function deleteItem() {
      store.dispatch("shopping/deleteItem", {
        itemId: props.item.id,
      });
    }
    const isInCart = computed(() => props.item.inCart);
    function increaseQty() {
      store.dispatch("shopping/updateQuantity", {
        itemId: props.item.id,
        quantity: props.item.quantity + 1,
      });
    }
    function decreaseQty() {
      store.dispatch("shopping/updateQuantity", {
        itemId: props.item.id,
        quantity: props.item.quantity - 1,
      });
    }
    function toggleInCart() {
      store.dispatch("shopping/toggleInCart", {
        itemId: props.item.id,
      });
    }
    return {
      isInCart,
      deleteItem,
      increaseQty,
      decreaseQty,
      toggleInCart,
    };
  },
});
</script>
<style scoped>
.stored-item {
  background-color: palegoldenrod;
}
.itemNameDisplay {
  text-transform: capitalize;
}
</style>
