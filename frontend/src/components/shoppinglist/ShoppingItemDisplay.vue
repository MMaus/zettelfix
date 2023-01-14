<template>
  <div class="m0 p0">
    <div
      v-if="isInCart"
      class="storedItem mt1 text-success text-left font-weight-bold"
      @click="toggleInCart"
    >
      {{ item.quantity }}x {{ item.itemName }}
    </div>

    <div v-else>
      <w-flex align-center class="my1 sh1 pa1 orange-light4--bg bdrs1">
        <div class="pa1 buttonsize">
          <w-button
            type="button"
            class="btn btn-primary"
            shadow
            lg
            v-on:click="decreaseQty"
          >
            -
          </w-button>
          <w-button type="button" outline lg>
            <b>{{ item.quantity }}</b>
          </w-button>
          <w-button
            type="button"
            class="btn btn-primary"
            v-on:click="increaseQty"
            lg
          >
            +
          </w-button>
        </div>
        <div class="spacer pl2 itemNameDisplay" @click="toggleInCart">
          <div class="itemtext">
            {{ item.itemName }}
          </div>
        </div>
        <div>
          <w-button
            bg-color="warning"
            class="btn btn-danger btn-sm pt1"
            @click="deleteItem"
            lg
          >
            <w-icon lg class="pa1">mdi mdi-delete-empty</w-icon>
          </w-button>
        </div>
      </w-flex>
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
  text-align: left;
  overflow: hidden;
  flex-grow: 1;
}

.itemtext {
  text-overflow: ellipsis;
  white-space: nowrap;
}

.buttonsize {
  min-width: 90px;
}
</style>
