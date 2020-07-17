import Vue from "vue";
import { Button, Input, Form, FormItem, Message } from "element-ui";

Vue.use(Button);
Vue.use(Form);

Vue.use(Input);
Vue.use(FormItem);
Vue.prototype.$message = Message;
