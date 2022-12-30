<template>
  <w-card title-class="amber-light5--bg" class="orange-light5--bg">
    <template #title>
      <div class="title3">{{ props.shelf.name }}</div>
      <div class="spacer"></div>
      <w-confirm
        @confirm="emit('deleteShelf', props.shelf.id)"
        confirm="yes"
        cancel="no"
      >
        <w-icon bg-color="warning">mdi mdi-delete-forever-outline</w-icon>
      </w-confirm>
    </template>
    <w-flex>
      <span class="caption">
        {{ props.shelf.id }}
      </span>
    </w-flex>
  </w-card>
</template>
<script setup lang="ts">
import type { Shelf, UUID } from "../shoppingStore";

const props = defineProps<{ shelf: Shelf }>();
const emit = defineEmits<{
  (eventName: "deleteShelf", shelfId: UUID): void;
}>();
</script>
