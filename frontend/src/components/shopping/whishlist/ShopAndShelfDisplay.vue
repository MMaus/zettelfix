<template>
  <div class="body mt1 mb2 pl2">
    <w-flex wrap>
      <div class="mr2 h5">
        {{ getLabel }}
      </div>
      <div v-for="shelf in props.shelves" :key="shelf.id" class="mr2">
        <span class="body">{{ shelf.name }}</span
        ><span class="caption">({{ shelf.shop.name }})</span>
      </div>
    </w-flex>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { ShelfReference } from "../shoppingStore";
const props = defineProps<{ shelves: ShelfReference[] }>();
const getLabel = computed(() => {
  return props.shelves.length > 1 ? "In these shelves: " : "In this shelf: ";
});
</script>
