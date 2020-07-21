import Vue from "vue";
import VueRouter from "vue-router";
import login from "../components/login.vue";
import home from "../components/home.vue";
import welcome from "../components/weclome.vue";
import users from "../components/user/users.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", redirect: "./login" },
  { path: "/login", component: login },
  {
    path: "/home",
    component: home,
    redirect: "/welcome",
    children: [
      { path: "/welcome", component: welcome },
      { path: "/users", component: users },
    ],
  },
];

const router = new VueRouter({
  routes,
});

// 导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") return next();
  const tokenStr = window.sessionStorage.getItem("token");
  if (!tokenStr) return next("/login");
  next();
});

export default router;
