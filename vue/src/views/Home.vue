<template>
  <div class="home">
    <img alt="jutebag logo" src="../assets/logo.png" />
    <div class="jumbotron">
      <h2>Welcome to Jutebag.IO!</h2>
      <br />
      Please select one of the pages to go to from the menu.
    </div>
    <hr />
    <a href="#/about">about (direct link)</a>

    <hr />
    <router-link to="login">Account (router link)</router-link>
    <hr />
    <router-link to="todo">Todo (router link)</router-link>
    <hr />
    <router-link to="shoppinglist">shopping (router link)</router-link>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
};
</script>
