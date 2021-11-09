<template>
  <div class="xs6 md4 lg3 pa3">
    <router-link :to="target">
      <w-card
        :title="title"
        title-class="indigo-light4--bg"
        class="cardbox"
        shadow
        bg-color="grey-light5"
      >
        <slot></slot>
      </w-card>
    </router-link>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  props: {
    target: String,
    title: String,
  },
});
</script>
<style scoped>
.cardbox {
  border-radius: 10px;
}
</style>
