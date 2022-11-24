<template>
  <w-card :title="shopTitle" title-class="amber-light5--bg">
    <add-shelf-dialog
      :shop-name="props.shop.name"
      v-model="dialogVisible"
    ></add-shelf-dialog>
    <w-flex>
      <div class="grow"></div>
      <div>
        <w-button class="ma1 sh1" @click="showAddShelfDialog"
          >Add shelf</w-button
        >
      </div>
    </w-flex>
  </w-card>
</template>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { Shop } from "../shoppingStore";
import AddShelfDialog from "./AddShelfDialog.vue";

const props = defineProps<{ shop: Shop }>();

const shopTitle = `Shop: ${props.shop.name}`;

const dialogVisible = ref(false);
const showAddShelfDialog = () => {
  dialogVisible.value = true;
};
</script>
