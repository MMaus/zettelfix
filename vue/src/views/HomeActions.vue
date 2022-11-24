<template>
  <w-flex>
    <div class="spacer"></div>
    <div>
      <w-switch
        label="show legacy apps"
        color="amber-light3"
        v-model="homeStore.showLegacyApps"
        ><span class="primary--bg">show legacy apps</span></w-switch
      >
    </div>
  </w-flex>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { useHomeStore } from "@/home/homestore";

const homeStore = useHomeStore();
// store.showLegacyApps;

// const showLegacyApps = ref(false);
</script>
