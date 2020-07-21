import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
// 导入全局的字体图标;
import fonts from "./assets/fonts/iconfont.css";
Vue.config.productionTip = false;

// 导入全局的样式
import "./assets/css/global.css";

// 导入axios后台请求数据插件;
import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";

// axios请求拦截（判断用户是否已经登录）
axios.interceptors.request.use((config) => {
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});

Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
