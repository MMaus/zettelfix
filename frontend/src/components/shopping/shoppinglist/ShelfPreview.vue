<template>
  <div class="px2">
    <w-card shadow :title="props.shelfpreview.name" class="my2">
      <div v-for="item in shelfpreview.items">
        {{ item }}
      </div>
    </w-card>
  </div>
</template>
<script setup lang="ts">
import { ShoppingShelfPreview } from "../shoppingStore";

const props = defineProps<{ shelfpreview: ShoppingShelfPreview }>();
</script>
