console.log("============== Hi from service worker v2!");
// self.__precacheManifest = [].concat(self.__precacheManifest || []);

if (typeof workbox === undefined) {
  console.log("========== workbox is undefined!");
} else {
  console.log("workbox is ", workbox);
}

workbox.core.setCacheNameDetails({ prefix: "Zettelfix" });

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
// workbox.precaching.suppressWarnings();
// workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

console.log("============== Service Worker v4 still alive!!");

self.addEventListener("message", (event) => {
  console.log("event heard");
  console.log("event origin:", event.origin);
  const isMatch = event.origin === self.location.origin;
  console.log("match: ", isMatch);
  if (isMatch) {
    // self.setTimeout(() => showAlarm(event.data), 20000);
    const prom = new Promise((resolver) =>
      self.setTimeout(
        () => showAlarmAndResolve(resolver, event.data),
        30 * 60_000
      )
    );
    // event.waitUntil(prom);
  }

  console.log("event data:", event.data);
});

self.addEventListener("install", function (event) {
  console.log("== service worker on install event");
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener("activate", function (event) {
  console.log("== service worker on activate event");
  event.waitUntil(self.clients.claim()); // Become available to all pages
});

async function showAlarmAndResolve(resolver, text) {
  console.log("Resolution starting...");
  //   self.Ser;
  console.log("Resolver = ", resolver);
  //   //   const options = {
  //   //     body: push_message.notification.body,
  //   //     icon: push_message.notification.icon,
  //   //     image: push_message.notification.image,
  //   //     tag: "alert",
  //   //   };
  const options = {
    body: text,
    icon: undefined,
    image: undefined,
    tag: "alert",
  };
  await self.registration.showNotification(
    "Nachricht fetzt! (Dies ist der  Titel)",
    options
  );
  resolver();
  //   event.waitUntil(
  //     self.registration.showNotification("Hallo Welt (Titel)!", options)
  //   );
}

//Web Push Notifications//
// let click_open_url;
// self.addEventListener("push", function (event) {
//   console.log("push event heard!");
//   //   let push_message = event.data.json();
//   // push notification can send event.data.json() as well
//   //   click_open_url = push_message.notification.data.url;
//   //   const options = {
//   //     body: push_message.notification.body,
//   //     icon: push_message.notification.icon,
//   //     image: push_message.notification.image,
//   //     tag: "alert",
//   //   };
//   const options = {
//     body: "Hallo Nachricht!",
//     icon: undefined,
//     image: undefined,
//     tag: "alert",
//   };
//   event.waitUntil(
//     self.registration.showNotification("Hallo Welt (Titel)!", options)
//   );
// });

// self.addEventListener("notificationclick", function (event) {
//   console.log("============ service worker: notification clicked");
//   const clickedNotification = event.notification;
//   clickedNotification.close();
//   if (click_open_url) {
//     const promiseChain = clients.openWindow(click_open_url);
//     event.waitUntil(promiseChain);
//   }
// });

console.log("============== Service Worker v6 init done!!");
