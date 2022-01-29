import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";
import ShoppingListView from "@/views/ShoppingListView.vue";
import ShoppingListActions from "@/views/ShoppingListActions.vue";
import Impressum from "@/views/Impressum.vue";
import NoActions from "@/views/NoActions.vue";
import TodoActions from "@/views/TodoActions.vue";
import SettingsView from "@/views/SettingsView.vue";

console.log("Creating router");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    components: {
      default: Home,
      actions: NoActions,
    },
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    components: {
      default: () =>
        import(/* webpackChunkName: "about" */ "@/views/About.vue"),
      actions: NoActions,
    },
  },
  {
    path: "/settings",
    name: "Settings",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    components: {
      default: SettingsView,
      actions: NoActions,
    },
  },
  {
    path: "/shoppinglist",
    name: "Shopping List",
    // route level code-splitting
    components: {
      default: ShoppingListView,
      actions: ShoppingListActions,
    },
  },
  {
    path: "/login",
    name: "Login",
    // route level code-splitting
    components: {
      default: () =>
        import(/* webpackChunkName: "login" */ "@/views/Login.vue"),
      actions: NoActions,
    },
  },
  {
    path: "/todo",
    name: "Todo",
    components: {
      default: () => import(/* webpackChunkName: "todo" */ "@/views/Todo.vue"),
      actions: TodoActions,
    },
  },
  {
    path: "/impressum",
    name: "Impressum",
    components: {
      default: Impressum,
      actions: NoActions,
    },
  },
];

console.log("Routes defined:" + routes.length);
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

console.log("Router created");
export default router;
