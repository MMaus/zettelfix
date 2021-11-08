<template>
  <div id="mainapp">
    <div id="title" class="bg-dark text-light p-1">
      <h2><img src="favicon.png" height="30em" />JuteBag.IO</h2>
      <h3>Your Shopping Bag</h3>
    </div>
    <div
      id="nav"
      class="navbar m-0 navbar-expand-sm navbar-dark bg-secondary mb-1 pb-1 sticky-top"
    >
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        Menu
        <span class="navbar-toggler-icon text-right"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <router-link
          to="/"
          class="nav-item nav-link"
          data-toggle="collapse"
          data-target=".navbar-collapse.show"
          >Home</router-link
        >
        <router-link
          to="about"
          class="nav-item nav-link"
          data-toggle="collapse"
          data-target=".navbar-collapse.show"
          >About</router-link
        >
        <router-link
          to="login"
          class="nav-item nav-link"
          data-toggle="collapse"
          data-target=".navbar-collapse.show"
          >Account</router-link
        >
        <router-link
          to="todo"
          class="nav-item nav-link"
          data-toggle="collapse"
          data-target=".navbar-collapse.show"
          >Todo List</router-link
        >
        <router-link
          to="shoppinglist"
          class="nav-item nav-link"
          data-toggle="collapse"
          data-target=".navbar-collapse.show"
          >Go Shopping!</router-link
        >
      </div>
      <div class="boxed bg-success text-white lead p-2 rounded" v-if="loggedIn">
        Signed In
      </div>
      <div
        class="boxed bg-warning text-white lead p-2 rounded"
        v-if="loggedOut"
      >
        Not logged in
      </div>
      <div
        class="boxed bg-warning text-white lead p-2 rounded"
        v-if="verificationRequired"
      >
        verify email!
      </div>
    </div>
    <router-view class="view"></router-view>
    <modal-dialog
      :show="showConsent"
      @ok="onConsentConfirm"
      @cancel="onConcentCancel"
    >
      <h2>WARNING</h2>
      <div class="text-left">
        This application is a hobby project.
        <strong>Do not provide personal information</strong>, because it is not
        protected. Personal information may be anything which is not testing
        data.
        <br />
        All data you enter will be stored locally in your browser.
        <br />
        If you create and use an account, those data will be stored on the
        server, where they are publicly accessible! As this violates public
        laws, you are not allowed to enter personal information when you are
        using an account. Personal information may be any information you might
        enter, except for testing purposes.
        <br /><br />
        <b>Do you agree to never enter any personal data here?</b>
      </div>
    </modal-dialog>
  </div>
</template>

<script>
// import firebase from "firebase/app";

// // // Add the Firebase products that you want to use
// import "firebase/auth";
import ModalDialog from "./components/common/ModalDialog.vue";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
// import "firebase/analytics";

function loginComplete(user) {
  console.log("=== User: ===" + user);
  if (user) {
    if (user.emailVerified) {
      return true;
    }
    return false;
  }
  return false;
}

export default {
  components: { ModalDialog },

  data: function() {
    return {
      loggedIn: false, //loginComplete(firebase.auth().currentUser),
      verificationRequired: false,
      loggedOut: true,
    };
  },

  methods: {
    toggleSignIn(user) {
      console.log("user changed to " + user);
      this.loggedIn = loginComplete(user);
      if (user) {
        this.verificationRequired = !user.emailVerified;
        this.loggedOut = false;
      } else {
        this.verificationRequired = false;
        this.loggedOut = true;
      }
    },
    onConsentConfirm() {
      // this.showConsent = false;
      this.$store.dispatch("app/confirmConsent");
    },
    onConcentCancel() {
      // this.showConsent = false;
    },
  },

  computed: {
    showConsent() {
      return !this.$store.getters["app/isConsentValid"];
    },
  },
};
</script>

<style>
body {
  height: 100%;
}
html {
  scroll-behavior: smooth;
  height: 100%;
}

.view {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  /* padding: 30px; */
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
