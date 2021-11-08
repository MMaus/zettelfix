import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import generateStore from "@/store";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/src/jquery.js";
import "bootstrap/dist/js/bootstrap.min.js";
import { importState } from "./store/shopping/importer";
import { Category } from "./store/shopping/types";
import { ItemRepository } from "./use/itemStore";

//  TODO: checkout axios (npm install axios --save)
// import axios from 'axios'
// Vue.prototype.$axios = axios
//

// const firebaseConfig = {
//   apiKey: "AIzaSyCjjVJikqJ1KwGPuOm8NOdZPt5ICrtCyg8",
//   authDomain: "jutebag.firebaseapp.com",
//   databaseURL: "https://jutebag.firebaseio.com",
//   projectId: "jutebag",
//   storageBucket: "jutebag.appspot.com",
//   messagingSenderId: "595630917273",
//   appId: "1:595630917273:web:b1d564c3efbc0461655a08",
//   measurementId: "G-JLRRL13388",
// };


const store = generateStore();
store.commit("shopping/computeNextItemId");

const enableImport = store.getters["app/enableShoppingListImport"];
console.log("====> enabling shopping list impoirt?", enableImport);
if (enableImport) {
  console.log("IMPORTING shoppingList from localStorage");
  const categories = importState();
  const existingCategories = store.getters["shopping/categories"] as Array<
    Category
  >;
  let anyItemImported = false;
  categories.forEach((cat) => {
    if (existingCategories.map((c) => c.catName).includes(cat.catName)) {
      console.log("SKIPPING category" + cat.catName);
      return;
    }
    anyItemImported = true;
    store.commit("shopping/createCategory", cat.catName);
    console.log(`Category ${cat.catName} has ${cat.items.length} items`);
    cat.items.forEach((it) =>
      store.commit("shopping/addItem", {
        itemName: it.itemName,
        quantity: it.quantity,
        categoryName: cat.catName,
        inCart: it.inCart,
      })
    );
  });

  store.commit("app/disableShoppingListImport");
  console.log("=== IMPORT DISABLED ===");
  if (!anyItemImported) {
    const itemStore = new ItemRepository("jutebag.shoppinglist");
    console.log("deleting store");
    // itemStore.deleteStore();
  }
}

// Vue.config.devtools = process.env.NODE_ENV === "development";
// Vue.config.devtools = true;

const app = createApp(App)
  .use(router)
  .use(store);

// @ts-ignore
// app.config.devtools = true;

app.mount("#app");
