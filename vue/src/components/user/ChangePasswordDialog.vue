<template>
  <w-dialog v-model="dialogOpen"> Change Password here! </w-dialog>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";
const dialogOpen = ref(false);
const props = defineProps<{
  showDialog: boolean;
}>();
const emit = defineEmits<{
  (e: "update:showDialog", value: boolean): void;
}>();

watch(
  () => props.showDialog,
  (val) => {
    dialogOpen.value = val;
  }
);
watch(
  () => dialogOpen.value,
  (val) => {
    emit("update:showDialog", val);
  }
);
</script>
