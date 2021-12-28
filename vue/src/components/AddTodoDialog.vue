<template>
  <w-dialog
    :model-value="props.dialogOpen"
    @input="handleClose"
    :width="600"
    class="mx3"
  >
    <template #title><h4 class="black">Create new Todo item</h4> </template>
    <w-input
      type="text"
      placeholder="enter new TODO item"
      label="Title"
      v-model="itemData"
      @keydown.enter="submit"
    />

    <template #actions>
      <div class="spacer"></div>
      <w-button class="btn" :disabled="!itemData.trim()" @click="submit"
        >Add</w-button
      >
    </template>
  </w-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue";

const props = defineProps<{
  dialogOpen: boolean;
}>();

const itemData = ref("");
const emit = defineEmits<{
  (e: "update:dialogOpen", value: boolean): void;
  (e: "close", label: string): void;
}>();

function handleClose(val: boolean) {
  emit("update:dialogOpen", val);
}

const submit = (e: Event) => {
  e.stopPropagation();
  if (itemData.value) {
    emit("close", itemData.value);
    itemData.value = "";
  }
};
</script>
