<template>
  <div>
    <w-card title="Settings" class="ma2" title-class="indigo-light4--bg">
      <div class="text-left">
        <span class="title3 mb2"> Push notifications </span>
      </div>
      <w-divider></w-divider>
      <w-flex class="mt2">
        <div>Enable TODO push notifications</div>
        <div class="spacer"></div>
        <div>
          <span v-if="!workerReady">(Service worker missing)</span>
          <w-switch
            color="success"
            label="enable"
            :disabled="!workerReady"
            v-model="enableTodoPush"
          >
          </w-switch>
        </div>
      </w-flex>
      <div class="mt5 pa2 text-left grey-light5--bg">
        <div class="ma4"><h6>deprecated</h6></div>
        Test service worker (Notification after 30 min):
        <w-button @click="testWorker">Test worker!</w-button>
        <div>
          Subscribe! via service worker
          <w-button @click="subscribe">Subscribe!</w-button>
        </div>
      </div>
      <div>Worker ready: <w-checkbox v-model="workerReady"></w-checkbox></div>
      <div>
        Subscription exists:
        <w-checkbox v-model="subsciptionExists"></w-checkbox>
      </div>
      <div>
        Notification permission:
        <w-checkbox v-model="notificationPermission"></w-checkbox>
      </div>
      <div>
        <w-button @click="unsubscribe">Unsubscribe</w-button>
        <span v-if="unsubscriptionSuccess">unsubscription Successful!</span>
        <span v-if="unsubscriptionFailed">unsubscription failed!</span>
      </div>
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const enableTodoPush = ref(false);
// const serviceWorkerEnabled = !!navigator.serviceWorker?.controller;

console.log("Checking for service worker:");

const workerReady = ref(false);
const subsciptionExists = ref(false);
const notificationPermission = ref(false);
if (Notification.permission === "granted") {
  notificationPermission.value = true;
}
if (!("serviceWorker" in navigator)) {
  console.error("Service worker feature not present!");
} else {
  navigator.serviceWorker.ready.then((reg) => {
    console.log("-- Service worker ready!");
    workerReady.value = true;
    reg.pushManager.getSubscription().then((sub) => {
      console.log("-- Subscription exists:", !!sub);
      subsciptionExists.value = !!sub;
    });
  });
}

const unsubscriptionSuccess = ref(false);
const unsubscriptionFailed = ref(false);
function unsubscribe() {
  navigator.serviceWorker.ready.then((reg) => {
    console.log("-- Service worker ready!");
    workerReady.value = true;
    reg.pushManager.getSubscription().then((sub) => {
      sub?.unsubscribe().then((res) => {
        unsubscriptionSuccess.value = res;
        unsubscriptionFailed.value = !res;
      });
    });
  });
}

watch(enableTodoPush, (isEnabled) => {
  if (isEnabled) {
    console.log("-- Starting registration of push notifications");
    Notification.requestPermission((result) => {
      if (result === "granted") {
        if (navigator.serviceWorker.controller) {
          console.log(
            "starting to post to ",
            navigator.serviceWorker.controller
          );
          navigator.serviceWorker.controller.postMessage({
            command: "subscribe",
          });
        } else {
          console.error("Service worker controller unknown!");
        }
      } else {
        alert("No permissions for notifications granted!");
        console.error(
          "User did not grant permission for Notifications, answer is:",
          result
        );
      }
    });
  }
});

function testWorker() {
  console.log("testing worker!");

  Notification.requestPermission((result) => {
    if (result === "granted") {
      navigator.serviceWorker.controller?.postMessage({
        command: "testnotification",
      });
    } else {
      alert("No permissions for notifications granted!");
      console.error(
        "User did not grant permission for Notifications, answer is:",
        result
      );
    }
  });
}

function subscribe() {
  console.log("creating subscription (still vue)");
  Notification.requestPermission((result) => {
    if (result === "granted") {
      console.log(
        "Navigator service worker:",
        navigator.serviceWorker.controller
      );
      navigator.serviceWorker.controller?.postMessage({
        command: "subscribe",
      });
    } else {
      alert("No permissions for notifications granted!");
      console.error(
        "User did not grant permission for Notifications, answer is:",
        result
      );
    }
  });
}
</script>

<style scoped>
p {
  margin-top: 1rem;
}
</style>
