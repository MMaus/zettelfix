self.__precacheManifest = [].concat(self.__precacheManifest || []);
if (typeof workbox === "undefined") {
  console.error("Serviceworker: workbox is undefined!");
} else {
  console.log("workbox is ", workbox);
  workbox.core.setCacheNameDetails({ prefix: "Zettelfix" });
  workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
}

// FIXME: fetch from backend

console.log("============== Service Worker v4-b still alive!!");
async function createSubscription(event) {
  console.log("============= SERVICE WORKER: Creating subscription");
  const vapidPublicKey = await fetch("api/push/vapid").then((res) =>
    res.text()
  );
  console.log("Obtained VAPID Key", vapidPublicKey);
  try {
    const options = {
      userVisibleOnly: true,
      applicationServerKey: vapidPublicKey,
    };
    self.registration.pushManager
      .subscribe(options)
      .then((sub) => {
        console.log("---- POSTING TO API ---");
        fetch("api/push/subscription", {
          method: "POST",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sub.toJSON()),
        })
          .then((res) => {
            console.log("---- server responded with === ", res.status);
            if (res.status < 300) {
              console.log("Subscription activated: ", res.status);
              res
                .text()
                .then((msg) =>
                  console.info("Success Response message was:", msg)
                );
            } else {
              console.error(
                "Error creating subscription:",
                res.status,
                res.text()
              );
              res
                .text()
                .then((msg) => console.error("Response message was:", msg));
            }
          })
          .catch((err) => console.log("Error creating push subscription", err));
      })
      .catch((e) => console.error("Creating subscription FAILED", e));
  } catch (e) {
    console.error("Error during creation of push subscription", e);
  }
}

self.addEventListener("message", (event) => {
  console.log("event heard");
  console.log("event origin:", event.origin);
  const isMatch = event.origin === self.location.origin;
  console.log("match: ", isMatch);
  const data = event.data;
  if (isMatch) {
    if (data.command === "subscribe") {
      createSubscription();
    } else if (data.command === "testnofitication") {
      const prom = waitAndShowNotification(event.data);
      event.waitUntil(prom);
    } else {
      console.log("UNKNOWN COMMAND " + data.command + " in " + data);
    }
  }

  console.log("event data:", event.data);
});

async function waitAndShowNotification(msg) {
  return new Promise((resolver) =>
    self.setTimeout(() => showAlarmAndResolve(resolver, msg), 1 * 60_000)
  );
}

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
  // actions: [  // a list of "ACTION"s which will be available at the event of the notificationclick listener,
  // where `event.action` contains the "action" field of the Action object selected. to the event of the
  //   {
  //     title: "open TODO",
  //     action: "",
  //     icon: "todo-icon",
  //   },
  // ],

  const options = {
    body: "Sieh Dir Deine Aufgaben in Zettelfix an! ", // message body text
    icon: "img/todo.png", // ICON URL
    // image: "img/todo.png", // image URL - a big image displayed below the text!
    link: "/todo",
    renotify: true,
    vibrate: [300, 200, 300],
    // tag: "alert",
  };
  // FIXME: mayve
  // await self.registration.showNotification("Deine Aufgaben für heute", options);
  // resolver();
}

self.addEventListener("push", (event) => {
  const options = {
    body: "Sieh Dir Deine Aufgaben in Zettelfix an! ", // message body text
    icon: "img/todo.png", // ICON URL
    // image: "img/todo.png", // image URL
    link: "/todo",
    renotify: true,
    vibrate: [300, 200, 300],
    tag: "alert-todo",
  };
  // FIXME: checkout options.onclick !
  self.registration.showNotification("Deine Aufgaben für heute", options);
  // event.waitUntil(
  //   self.registration.showNotification("Hallo Welt (Titel)!", options)
  // );
});

// from https://stackoverflow.com/a/63249009/2055010
// self.addEventListener("notificationclick", function (event) {
//   console.log("On notification click: ", event.notification.tag);
//   // Android doesn't close the notification when you click on it
//   // See: http://crbug.com/463146
//   event.notification.close();

//   // This looks to see if the current is already open and
//   // focuses if it is
//   event.waitUntil(
//     clients
//       .matchAll({
//         type: "window",
//       })
//       .then(function (clientList) {
//         for (var i = 0; i < clientList.length; i++) {
//           var client = clientList[i];
//           if (client.url == "/" && "focus" in client) return client.focus();
//         }
//         if (clients.openWindow) {
//           return clients.openWindow("/");
//         }
//       })
//   );
// });

// modified from https://stackoverflow.com/a/63249009/2055010
self.addEventListener("notificationclick", function (event) {
  console.log("On notification click: ", event.notification.tag);
  // Android doesn't close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url == "/" && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow("/");
      }
    })
  );
});

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
// if (self.registration) {
//   ("=== INFO == During script loading, self.registration *is* known - creating subscription()!");
//   createSubscription();
// } else {
//   console.log(
//     "=== INFO == During script loading, self.registration is not known!"
//   );
// }
