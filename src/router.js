// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import Register from "./components/Register.vue";
import Login from "./components/Login.vue";
import Dashboard from "./components/Dashboard.vue";
import CartPage from "./components/CartPage.vue";
import MenuItemDetail from "./components/MenuItemDetail.vue";
// import Payment from "./components/Payment.vue"
const routes = [
  { path: "/register", name: "Register", component: Register },
  { path: "/login", name: "Login", component: Login },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/cart", name: "CartPage", component: CartPage },
  {
    path: "/menu/:id",  
    name: "MenuItemDetail",
    component: MenuItemDetail,
    props: true, 
  },

  {
    path: "/",
    name: "Menu",
    component: () => import("@/components/UserMenu.vue"),
    meta: { role: "user" },
  },
  {
    path: '/payment',
    name: 'PaymentPage',
    component: () => import('@/components/Payment.vue'),
  },  
  // {
  //   path: "/menu",
  //   name: "Menu",
  //   component: () => import("@/components/Menu.vue"),
  //   meta: { role: "user" },
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
