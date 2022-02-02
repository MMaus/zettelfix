<template>
  <div>
    <w-flex wrap>
      <router-card title="Shopping List" target="shoppinglist">
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

<script lang="ts">
import RouterCard from "@/components/home/RouterCard.vue";
import TodolistButton from "@/components/todolist/TodolistButton.vue";

export default {
  components: { RouterCard, TodolistButton },
  name: "Home",
};
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
</style>
