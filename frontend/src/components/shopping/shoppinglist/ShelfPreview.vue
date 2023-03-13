<template>
  <div class="px2">
    <w-card
      shadow
      :title="props.shelfpreview.name"
      class="my2 light-green-light6--bg"
    >
      <w-table :headers="tableHeaders" :items="itemData"> </w-table>
    </w-card>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { ShoppingShelfPreview } from "../shoppingStore";

const props = defineProps<{ shelfpreview: ShoppingShelfPreview }>();

const tableHeaders = [
  { label: "Qty", key: "amount", width: "72px" },
  { label: "Item", key: "name" },
];
const itemData = computed(() =>
  props.shelfpreview.items.map((pv) => {
    return {
      id: pv.item.id,
      amount: pv.amount,
      name: pv.item.name,
    };
  })
);
</script>
