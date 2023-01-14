<template>
  <div>
    <w-card
      title="Acccount settings"
      title-class="indigo-light4--bg"
      class="mx2 text-left"
    >
      <h4 class="mb2">Account (Email)</h4>
      <w-flex>
        <div>{{ accountName }}</div>
        <div class="spacer"></div>
        <div>
          <w-button @click="sendVerificationEmail"
            >Send Verification Email</w-button
          >
        </div>
      </w-flex>
      <w-divider class="my2" />
      <h4 class="mb2">User details</h4>
      <w-input label="Name"></w-input>
      <w-input label="Phone"></w-input>
      <template #actions>
        <div class="spacer"></div>
        <w-button @click="showChangePasswordDialog = true"
          >Change Password</w-button
        >
        <w-button>Save</w-button>
      </template>
    </w-card>
    <change-password-dialog
      v-model:showDialog="showChangePasswordDialog"
    ></change-password-dialog>
  </div>
  <!-- <div>
    <div class="jumbotron">
      <h1>Login</h1>
      <div v-if="loggedIn">
        <span class="lead">Logged in as</span>
        {{ currentUser }}
        <button type="button" class="button btn btn-primary" @click="logout">
          logout
        </button>
        <button
          v-if="!userVerified"
          type="button"
          class="button btn btn-warning"
          @click="sendVerification"
        >
          Verify Email!
        </button>
      </div>
      <div v-else>
        <input type="email" v-model="email" placeholder="email" />
        <input type="password" v-model="password" placeholder="password" />
        <button type="button" class="button btn btn-primary" @click="login">
          login
        </button>
        <hr />
        <span class="lead">
          <b>or</b>
        </span>
        <hr />
        <button type="button" class="button btn btn-warning" @click="signUp">
          Sign Up!
        </button>
      </div>
    </div>
    <div class="bg-danger text-white" v-if="showError">
      <h4 class="text-white">ERROR</h4>
      {{ errMsg }}
    </div>
    <div class="bg-success text-white" v-if="showSuccess">
      <h4 class="text-white">Success!</h4>
      {{ successMsg }}
    </div>
  </div> -->
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import ChangePasswordDialog from "@/components/user/ChangePasswordDialog.vue";
import { useStore } from "vuex";
import { createClient } from "@/store/httpClient";
const showChangePasswordDialog = ref(false);
const store = useStore();
const accountName = computed(
  () => store.getters["app/user"] || "Not logged in"
);
async function sendVerificationEmail() {
  const requestData = {
    command: "sendVerificationEmail",
    account: accountName.value,
  };
  const httpClient = createClient(useStore());
  const response = await httpClient.POST(
    "/login/sendVerificationEmail",
    requestData,
    "JSON"
  );
  // const response = await fetch("api/login/sendVerificationEmail", {
  //   method: "POST",
  //   cache: "no-cache",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(requestData),
  // });
  console.log("Email Verification Response:", response);
}
</script>
