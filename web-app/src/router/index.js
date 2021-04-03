import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index";

import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/Login"),
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/auth/Register"),
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/views/auth/ForgotPassword"),
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/verify-otp",
    name: "VerifyOTP",
    component: () => import("@/views/auth/VerifyOTP"),
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("@/views/auth/ResetPassword"),
    meta: {
      requireAuth: false,
    },
  },
  // challenges
  {
    path: "/challenge/:id",
    name: "Challenge",
    component: () => import("@/views/challenges/Challenge"),
    meta: {
      requireAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const hasUser = store.state.user.user;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!hasUser) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
