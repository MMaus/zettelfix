<template>
  <w-dialog :model-value="props.dialogOpen" @input="handleClose">
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
      <w-button class="btn" @click="submit">Add</w-button>
    </template>
  </w-dialog>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, watchEffect } from "vue";

const props = defineProps<{
  dialogOpen: boolean;
}>();

const itemData = ref("");
const emit = defineEmits<{
  (e: "update:dialogOpen", value: boolean): void;
  (e: "close", label: string): void;
}>();

watchEffect(() =>
  console.log("IN DIALOG COMPONENT, WE HAVE OPEN=", props.dialogOpen)
);

function handleClose(val: boolean) {
  emit("update:dialogOpen", val);
}

const submit = (e: Event) => {
  e.stopPropagation();
  // if (newItem.value?.value) {
  //   itemData = newItem.value.value!;
  console.log("You entered " + itemData.value);
  // }
  emit("close", itemData.value);
};
</script>
