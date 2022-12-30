<template>
  <w-dialog
    v-model="data.showDialog"
    :persistent="false"
    :width="600"
    title-class="primary-light1--bg white"
  >
    <template #title>
      <w-icon class="mr2">mdi mdi-tune</w-icon>
      Login or Sign Up
    </template>
    <div v-if="!loggedIn">
      <w-tabs :items="data.tabItems" bg-color="indigo-light5">
        <template v-slot:[`item-content.1`]>
          <h4>Login</h4>
          <w-form no-keyup-validation>
            <w-input
              v-model="data.account"
              type="email"
              label="Email"
              :validators="[validators.email, validators.required]"
              required
            /><br />
            <w-input
              v-model="data.password"
              type="password"
              label="Password"
            /><br />
            <w-button
              @click="closeDialog"
              bg-color="grey"
              color="white"
              class="m-2"
              >Cancel
            </w-button>
            <w-button @click="logIn">Log In</w-button>
          </w-form>
        </template>
        <template v-slot:[`item-content.2`]>
          <w-form no-keyup-validation>
            <h4>Sign Up</h4>
            <w-input
              v-model="data.account"
              type="email"
              label="Email"
              :validators="[validators.email, validators.required]"
            /><br />
            <w-input
              v-model="data.password"
              type="password"
              label="Password"
            /><br />
            <w-input
              v-model="data.passwordConfirm"
              type="password"
              label="Confirm Password"
            /><br />
            <w-button
              @click="closeDialog"
              bg-color="grey"
              color="white"
              class="m-2"
              >Cancel
            </w-button>
            <w-button @click="register" :disabled="passwordsDiffer">{{
              signUpButtonLabel
            }}</w-button></w-form
          >
        </template>
        <template v-slot:[`item-content.3`]>
          <w-form no-keyup-validation>
            <h4>Reset Password</h4>
            <w-input
              v-model="data.account"
              type="email"
              label="Email"
              :validators="[validators.email, validators.required]"
            /><br />
            <w-button
              @click="closeDialog"
              bg-color="grey"
              color="white"
              class="m-2"
              >Cancel
            </w-button>
            <w-button @click="requestPasswordReset"
              >Send password reset via e-mail
            </w-button></w-form
          >
        </template>
      </w-tabs>
    </div>
    <div v-else>
      <h3>Logged in as {{ account }}</h3>
      <w-button
        @click="refresh"
        bg-color="primary"
        class="m1 p2 mr4"
        icon="mdi mdi-cached"
      ></w-button>
      <w-button @click="logout" bg-color="success" class="m1 p2">
        Logout
      </w-button>
    </div>
  </w-dialog>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, watch } from "vue";
import { useStore } from "vuex";
import { createClient } from "@/store/httpClient";
// import { createClient } from "../../store/httpClient";

// Technically, this is too simplified and does not match RFC 822, but ... its handy and matches 99.99%
const simpleEmailRegex = /^\S+@\S+\.\S+$/;
export default defineComponent({
  emits: ["close"],
  props: {
    show: Boolean,
  },
  setup(props, context) {
    const validators = {
      required: (value: unknown) => !!value || "Eingabe erforderlich",
      email: (value: string | null | undefined) =>
        simpleEmailRegex.test("" + value) || "Ungültige Email",
    };
    let data = reactive({
      showDialog: props.show,
      account: "",
      password: "",
      passwordConfirm: "",
      tabItems: [
        { title: "Login", content: "Login (Placeholder)" },
        { title: "Sign Up", content: "SignUp (Placeholder)" },
        { title: "Reset password", content: "Reset Password (Placeholder)" },
      ],
    });
    const store = useStore();
    const httpClient = createClient(store);
    const loggedIn = computed(() => store.getters["app/userLoggedIn"]);
    watch(
      () => props.show,
      (val) => {
        data.showDialog = val;
      }
    );
    // close when auth state changes
    watch(
      () => loggedIn.value,
      () => context.emit("close")
    );
    watch(
      () => data.showDialog,
      (val) => {
        if (!val) {
          context.emit("close");
        }
      }
    );
    const passwordsDiffer = computed(
      () => data.password !== data.passwordConfirm
    );
    const signUpButtonLabel = computed(() =>
      passwordsDiffer.value ? "Passwords don't match" : "Sign Up"
    );

    onMounted(() => console.log("logged in: ", loggedIn));
    return {
      data,
      validators,
      passwordsDiffer,
      loggedIn,
      signUpButtonLabel,
      account: computed(() => store.getters["app/user"]),
      logIn() {
        console.log("Login clicked");
        store.dispatch("app/login", {
          account: data.account,
          password: data.password,
        });
      },
      async refresh() {
        const loginStatus = await httpClient.GET("/login");
        store.dispatch("app/updateLoginStatus", loginStatus);
      },
      logout() {
        store.dispatch("app/logout");
        context.emit("close");
      },
      register() {
        store.dispatch("app/register", {
          account: data.account,
          password: data.password,
        });
      },
      requestPasswordReset() {
        const postData = {
          command: "requestPasswordReset",
          account: data.account,
        };
        httpClient
          .POST("/login", postData, "JSON")
          .then((res) => res.text())
          .then((txt) => {
            console.log("HEARD RESULT: ", txt);
            context.emit("close");
          }); // FIXME: handle reset, give feedback, ...
      },
      closeDialog() {
        context.emit("close");
      },
    };
  },
});
</script>
