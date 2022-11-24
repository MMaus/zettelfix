import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";
import HomeActions from "@/views/HomeActions.vue";
import ShoppingListView from "@/views/ShoppingListView.vue";
import ShoppingListActions from "@/views/ShoppingListActions.vue";
import ShoppingView from "@/views/ShoppingView.vue";
import ShoppingActions from "@/views/ShoppingActions.vue";
import Impressum from "@/views/Impressum.vue";
import NoActions from "@/views/NoActions.vue";
import TodoActions from "@/views/TodoActions.vue";
import SettingsView from "@/views/SettingsView.vue";

import ShopsView from "@/components/shopping/ShopsView.vue";
import ShoppingItemsView from "@/components/shopping/ShoppingItemsView.vue";
import ShoppingNowView from "@/components/shopping/ShoppingNowView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    components: {
      default: Home,
      actions: HomeActions,
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
    name: "Shopping",
    // route level code-splitting
    components: {
      default: ShoppingListView,
      actions: ShoppingListActions,
    },
  },
  {
    path: "/shoppinglist2",
    name: "Shopping List",
    // Fixme: route level code-splitting
    components: {
      default: ShoppingView,
      actions: ShoppingActions,
    },
    children: [
      {
        path: "shops",
        component: ShopsView,
        meta: {
          index: 1,
          transitionName: "default",
        },
      },
      {
        path: "items",
        component: ShoppingItemsView,
        meta: {
          index: 2,
          transitionName: "default",
        },
      },
      {
        path: "shopping",
        component: ShoppingNowView,
        meta: {
          index: 3,
          transitionName: "default",
        },
      },
      {
        // default with redirect
        path: "",
        redirect: "/shoppinglist2/items",
      },
    ],
  },
  {
    path: "/account",
    name: "Account",
    // route level code-splitting
    components: {
      default: () =>
        import(/* webpackChunkName: "account" */ "@/views/Account.vue"),
      actions: NoActions,
    },
  },
  {
    path: "/resetPassword/:token",
    name: "Reset Password",
    // route level code-splitting
    components: {
      default: () =>
        import(
          /* webpackChunkName: "passwordReset" */ "@/views/PasswordResetView.vue"
        ),
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

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.afterEach((to, from) => {
  if (!!to.meta?.index && !!from.meta?.index) {
    to.meta.transitionName =
      to.meta.index > from.meta.index ? "switchToRight" : "switchToLeft";
    console.log(`Setting transition to ${to.meta.transitionName}.`);
  }
});

export default router;
