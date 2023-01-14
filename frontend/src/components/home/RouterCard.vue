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
<script setup lang="ts">
defineProps<{
  target: string;
  title: string;
}>();
</script>
<style scoped>
.cardbox {
  border-radius: 10px;
}
</style>
