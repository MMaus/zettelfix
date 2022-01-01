<template>
  <w-flex wrap>
    <div class="spacer"></div>
    <sync-button module="todo"></sync-button>
    <w-button shadow @click="showDialog = true">
      <w-icon lg>mdi mdi-newspaper-plus</w-icon></w-button
    >
  </w-flex>
  <add-todo-dialog
    v-model:dialogOpen="showDialog"
    transition="slide-fade-down"
    @close="createItem"
  >
  </add-todo-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AddTodoDialog from "@/components/todolist/AddTodoDialog.vue";
import { useStore } from "vuex";
import SyncButton from "@/components/common/SyncButton.vue";

const store = useStore();

const showDialog = ref(false);
function createItem(label: string) {
  if (label) {
    store.dispatch("todo/createTodoItem", label);
  }
  showDialog.value = false;
}
</script>
