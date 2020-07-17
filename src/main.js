import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
// 导入全局的字体图标;
import fonts from "./assets/fonts/iconfont";
Vue.config.productionTip = false;

// 导入全局的样式
import "./assets/css/global.css";

// 导入axios后台请求数据插件;
import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";
Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
