import Vue from "vue";
import VueRouter from "vue-router";
import login from "../components/login.vue";
import home from "../components/home.vue";
import welcome from "../components/weclome.vue";
import users from "../components/user/users.vue";
import rights from "../components/power/rights.vue";
import roles from "../components/power/roles.vue";
import cate from "../components/goods/cate.vue";
import Add from "../components/goods/Add.vue";
import Params from "../components/goods/Params.vue";
import GoodsEdit from "../components/goods/GoodsEdit.vue";
import GoodsList from "../components/goods/List.vue";
import Order from "../components/order/Order.vue";
import Report from "../components/report/Report.vue";

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
