<template>
  <div>
    <w-dialog
      :modelValue="props.modelValue"
      @update:modelValue="(value: boolean) => emit('update:modelValue', value)"
      width="600"
      height="400"
    >
      <template #title>Add shelf to {{ props.shopName }}</template>
      <w-input v-model="newShelfName"></w-input>
    </w-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, watchEffect } from "vue";

const props = defineProps<{ shopName: string; modelValue: boolean }>();
const emit = defineEmits<{
  (eventName: "update:modelValue", modelValue: boolean): void;
}>();

const newShelfName = ref("");
</script>
