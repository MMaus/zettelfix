<template>
  <w-card title="Settings">
    Test service worker (Notification after 30 min):
    <w-button @click="testWorker">Test worker!</w-button>
  </w-card>
</template>

<script setup lang="ts">
function testWorker() {
  console.log("testing worker!");
  Notification.requestPermission((result) => {
    if (result === "granted") {
      navigator.serviceWorker.controller?.postMessage("Foo");
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
