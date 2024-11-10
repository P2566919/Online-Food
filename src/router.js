// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import Register from "./components/Register.vue";
import Login from "./components/Login.vue";
import Dashboard from "./components/Dashboard.vue";


const routes = [
  { path: "/register", name: "Register", component: Register },
  { path: "/login", name: "Login", component: Login },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
