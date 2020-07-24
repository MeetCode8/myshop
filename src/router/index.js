import Vue from "vue";
import VueRouter from "vue-router";
const login = () => import("../components/login.vue");
const home = () => import("../components/home.vue");
const welcome = () => import("../components/weclome.vue");
const users = () => import("../components/user/users.vue");
const rights = () => import("../components/power/rights.vue");
const roles = () => import("../components/power/roles.vue");
const cate = () => import("../components/goods/cate.vue");
const Add = () => import("../components/goods/Add.vue");
const Params = () => import("../components/goods/GoodsEdit.vue");
const GoodsEdit = () => import("../components/power/rights.vue");
const GoodsList = () => import("../components/goods/List.vue");
const Order = () => import("../components/order/Order.vue");
const Report = () => import("../components/report/Report.vue");

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
      { path: "/rights", component: rights },
      { path: "/roles", component: roles },
      { path: "/categories", component: cate },
      { path: "/goods/add", component: Add },
      { path: "/params", component: Params },
      { path: "/goods", component: GoodsList },
      { path: "/orders", component: Order },
      { path: "GoodsEdit", component: GoodsEdit },
      { path: "/reports", component: Report },
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

// 为了解决Element-Ui 导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default router;
