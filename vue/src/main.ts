import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import generateStore from "./store";

import { importState } from "./store/shopping/importer";
import { Category } from "./store/shopping/types";

import WaveUI from "wave-ui";
import "wave-ui/dist/wave-ui.css";

//  TODO: checkout axios (npm install axios --save)
// import axios from 'axios'
// Vue.prototype.$axios = axios
//

const store = generateStore();
store.commit("shopping/computeNextItemId");

const enableImport = store.getters["app/enableShoppingListImport"];
console.log("====> enabling shopping list impoirt?", enableImport);
if (enableImport) {
  console.log("IMPORTING shoppingList from localStorage");
  const categories = importState();
  const existingCategories = store.getters[
    "shopping/categories"
  ] as Array<Category>;
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
  // console.log("=== IMPORT DISABLED ===");
  // if (!anyItemImported) {
  //   const itemStore = new ItemRepository("zettelfix.shoppinglist");
  //   console.log("deleting store");
  //   // itemStore.deleteStore();
  // }
}

// Vue.config.devtools = process.env.NODE_ENV === "development";
// Vue.config.devtools = true;

const app = createApp(App).use(router).use(store);

new WaveUI(app, {});

// @ts-ignore
// app.config.devtools = true;

app.mount("#app");
