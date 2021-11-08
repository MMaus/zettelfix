import { createRouter, createWebHashHistory  } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue'

console.log("Creating router");

// Array<any> works as well
const routes: Array<RouteRecordRaw> = [ 
  {
    path: '/',
    name: 'Home',
    component: Home as any,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/shoppinglist',
    name: 'Shopping List',
    // route level code-splitting
    component: () => { return import(/* webpackChunkName: "shoppingList" */ '@/views/ShoppingListView.vue'); }
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/todo',
    name: 'Todo',
    // route level code-splitting
    component: () => import(/* webpackChunkName: "todo" */ '../views/Todo.vue')
  }
]

console.log("Routes defined:" + routes.length);
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

console.log("Router created");
export default router
