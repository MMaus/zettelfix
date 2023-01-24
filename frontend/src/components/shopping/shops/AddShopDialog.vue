<template>
  <div>
    <w-dialog
      :modelValue="props.modelValue"
      @update:modelValue="(value: boolean) => emit('update:modelValue', value)"
      width="600"
      height="400"
    >
      <template #title>Enter name of the shop</template>
      <div>
        <w-input
          @keyup.enter.stop="createShop"
          class="ma3"
          label="Shop name"
          v-model="newShopName"
        >
        </w-input>
      </div>
      <w-button @click="emit('update:modelValue', false)">Cancel</w-button>
      <w-button @click="createShop">Create</w-button>
    </w-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import { useShoppingStore } from "../shoppingStore";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (eventName: "update:modelValue", modelValue: boolean): void;
}>();

const newShopName = ref("");
watch(
  () => props.modelValue,
  async (newVal) => {
    if (newVal) {
      newShopName.value = "";
    }
  }
);

const shopStore = useShoppingStore();
const createShop = () => {
  shopStore.createShop(newShopName.value);
  emit("update:modelValue", false);
};
</script>
