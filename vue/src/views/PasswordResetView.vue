<template>
  <div>
    <w-card title="Reset Password" class="ma2" title-class="indigo-light4--bg">
      <w-divider></w-divider>
      <w-flex class="mt2">
        <div>Please enter your new password</div>
        <div class="spacer"></div>
      </w-flex>
      <w-input
        type="password"
        v-model="pw1"
        label="Enter new password"
      ></w-input>
      <w-input
        type="password"
        v-model="pw2"
        label="Confirm new password"
      ></w-input>
      <template #actions>
        <div class="spacer"></div>
        <w-button :disabled="!passwordsMatch" @click="submitPasswords"
          >Set new password</w-button
        >
      </template>
    </w-card>
    <w-dialog
      v-model="showDialog"
      :persistent="false"
      :width="600"
      title-class="primary-light1--bg white"
    >
      <template #title>
        <w-icon class="mr2">mdi mdi-tune</w-icon>
        Password Changed
      </template>
      Your password has been changed. You can log in now with your new password.
      <template #actions>
        <div class="spacer"></div>
        <w-button @click="gotoMain">Ok</w-button>
      </template>
    </w-dialog>
  </div>
</template>
<script setup lang="ts">
// import router from "@/router";

import router from "@/router";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const pwToken = route.params.token;
const showDialog = ref(false);
const pw1 = ref("");
const pw2 = ref("");

const passwordsMatch = computed(() => pw1.value && pw1.value === pw2.value);

function submitPasswords() {
  const requestData = {
    command: "resetPassword",
    password: pw1.value,
    token: pwToken,
  };
  fetch("api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  }).then((res) => {
    console.log("received response: ", res);
    showDialog.value = true;
  });
}
function gotoMain() {
  router.push("/");
}
</script>
