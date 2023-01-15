/* eslint-disable no-console */

import { register } from "register-service-worker";

// for webpack: baseUrl = process.env.BASE_URL
const baseUrl = import.meta.env.BASE_URL;
//  if (process.env.NODE_ENV === 'production') {
console.log(`trying to look up ${baseUrl}service-worker.js`);
register(`${baseUrl}service-worker.js`, {
  ready() {
    console.log(
      "App is being served from cache by a service worker.\n" +
        "For more details, visit https://goo.gl/AFskqB"
    );
  },
  registered() {
    console.log("Service worker has been registered.");
    Notification.requestPermission((result) =>
      console.log("Notification permission is", result)
    );
  },
  cached() {
    console.log("Content has been cached for offline use.");
  },
  updatefound() {
    console.log("New content is downloading.");
  },
  updated() {
    console.log("New content is available; please refresh.");
  },
  offline() {
    console.log(
      "No internet connection found. App is running in offline mode."
    );
  },
  error(error) {
    console.error("Error during service worker registration:", error);
  },
});
//  }