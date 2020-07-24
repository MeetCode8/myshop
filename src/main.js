import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
// 导入全局的字体图标;
import fonts from "./assets/fonts/iconfont.css";
import TreeTable from "vue-table-with-tree-grid";
// import VueQuillEditor from "vue-quill-editor";
Vue.config.productionTip = false;
// require styles
// import "quill/dist/quill.core.css";
// import "quill/dist/quill.snow.css";
// import "quill/dist/quill.bubble.css";

import Nprogress from "nprogress";
import "nprogress/nprogress";

// 导入全局的样式
import "./assets/css/global.css";

// 导入axios后台请求数据插件;
import axios from "axios";
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/";

// axios请求拦截（判断用户是否已经登录）
axios.interceptors.request.use((config) => {
  Nprogress.start();
  // 为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});

axios.interceptors.response.use((config) => {
  Nprogress.done();
  return config;
});

Vue.prototype.$http = axios;
// 定义全局组件的treetable
Vue.component("tree-table", TreeTable);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
