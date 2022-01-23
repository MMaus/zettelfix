<template>
  <w-card title="Settings">
    <div>
      Test service worker (Notification after 30 min):
      <w-button @click="testWorker">Test worker!</w-button>
    </div>
    <div>
      Subscribe! via service worker
      <w-button @click="subscribe">Subscribe!</w-button>
    </div>
  </w-card>
</template>

<script setup lang="ts">
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
