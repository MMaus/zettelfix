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
          <w-button
            bg-color="success"
            label="subscribe to notifications"
            :disabled="!workerReady"
            @click="subscribe"
            >Subscribe
          </w-button>
          <w-button
            label="unsubscribe"
            :disabled="!subsciptionExists"
            @click="unsubscribe"
            >Unsubscribe
          </w-button>
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
    </w-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "vuex";

const workerReady = ref(false);
const subsciptionExists = ref(false);
const notificationPermission = ref(false);
const store = useStore();
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

function subscribe() {
  console.log("-- Starting registration of push notifications");
  const token = store.getters["app/bearerToken"];
  Notification.requestPermission((result) => {
    if (result === "granted") {
      if (navigator.serviceWorker.controller) {
        console.log("starting to post to ", navigator.serviceWorker.controller);
        navigator.serviceWorker.controller.postMessage({
          command: "subscribe",
          token: token,
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
</script>

<style scoped>
p {
  margin-top: 1rem;
}
</style>
