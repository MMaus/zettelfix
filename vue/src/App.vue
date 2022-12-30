<template>
  <w-app>
    <div id="mainapp">
      <w-toolbar shadow fixed bg-color="primary">
        <div class="pa2">
          <router-link to="/">
            <w-button shadow>
              <w-icon lg color="white">mdi mdi-home</w-icon>
            </w-button>
          </router-link>
        </div>
        <div class="xs-hide"><span class="title2">Zettelfix</span></div>
        <div class="route-actions ma2 text-right">
          <router-view name="actions"></router-view>
        </div>
        <div class="ml2">
          <auth-button @click="showLoginDialog = true"></auth-button>
        </div>
      </w-toolbar>

      <router-view class="view"></router-view>
      <login-dialog :show="showLoginDialog" @close="showLoginDialog = false" />
      <disclaimer-dialog
        :show="showConsent"
        @ok="onConsentConfirm"
        @cancel="onConsentCancel"
      ></disclaimer-dialog>
    </div>
  </w-app>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import AuthButton from "./components/auth/AuthButton.vue";
import LoginDialog from "./components/auth/LoginDialog.vue";
// import firebase from "firebase/app";

// // // Add the Firebase products that you want to use
// import "firebase/auth";
// import ModalDialog from "./components/common/ModalDialog.vue";
import DisclaimerDialog from "./components/common/DisclaimerDialog.vue";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
// import "firebase/analytics";

// function loginComplete(user: any) {
//   console.log("=== User: ===" + user);
//   if (user) {
//     if (user.emailVerified) {
//       return true;
//     }
//     return false;
//   }
//   return false;
// }

// export default {
//   components: { AuthButton, LoginDialog, DisclaimerDialog },

// data: function () {
const store = useStore();
// return {
// const loggedIn = ref(false);
// loggedIn: false, //loginComplete(firebase.auth().currentUser),
// const verificationRequired = ref(false);
const showLoginDialog = ref(false);
// const doShowConsent =
const showConsent = computed(() => !store.getters["app/isConsentValid"]);
//   };
// },

// methods: {
// toggleSignIn(user: any) {
//   console.log("user changed to " + user);
//   this.loggedIn = loginComplete(user);
//   if (user) {
//     this.verificationRequired = !user.emailVerified;
//     this.loggedOut = false;
//   } else {
//     this.verificationRequired = false;
//     this.loggedOut = true;
//   }
// },
function onConsentConfirm() {
  // this.showConsent = false;
  store.dispatch("app/confirmConsent");
}
function onConsentCancel() {
  console.error("Unable to proceed if consent is denied");
  // showConsent.value = false;
}
// }

// computed: {
// showConsent(): boolean {
//   return !this.$store.getters["app/isConsentValid"];
// },
// ...mapGetters("app", ["user"]),
//   },
// };
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
  padding-top: 64px;
}

.bordered {
  border: 1px solid red;
  padding: 1px;
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
.route-actions {
  flex-grow: 1;
  /* border: 1px solid red; */
}
</style>
