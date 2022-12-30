<template>
  <div>
    <w-flex wrap>
      <Transition>
        <router-card
          v-if="homeStore.showLegacyApps"
          title="Shopping List (legacy)"
          target="shoppinglist"
        >
          <img alt="zettelfix logo" src="../assets/logo.png" />
        </router-card>
      </Transition>
      <router-card title="Shopping List (new)" target="shoppinglist2">
        <img alt="zettelfix logo" src="../assets/logo.png" />
      </router-card>
      <todolist-button></todolist-button>
      <router-card target="about" title="About">
        <w-icon size="90px">mdi mdi-list-status</w-icon>
        About
      </router-card>
      <router-card target="account" title="Account">
        <w-icon size="90px">mdi mdi-card-account-details</w-icon>
      </router-card>
      <router-card target="settings" title="Settings / Debug">
        <w-icon size="90px">mdi mdi-cogs</w-icon>
      </router-card>
    </w-flex>

    <footer class="footer">
      <router-link to="impressum"
        ><p class="body white mt2 mb1 mr4">Impressum</p></router-link
      >
    </footer>
  </div>
</template>

<script setup lang="ts">
import RouterCard from "@/components/home/RouterCard.vue";
import TodolistButton from "@/components/todolist/TodolistButton.vue";
import { ref } from "vue";

import { useHomeStore } from "@/home/homestore";
const homeStore = useHomeStore();
</script>
<style scoped>
.footer {
  position: fixed;
  bottom: 0px;
  width: 100%;
  background-color: #234781;
  color: aliceblue;
  text-align: right;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
