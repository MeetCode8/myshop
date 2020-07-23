import Vue from "vue";
import {
  Button,
  Input,
  Form,
  FormItem,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  input,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  tooltip,
  pagination,
  dialog,
  MessageBox,
  tag,
  Tree,
  select,
  option,
} from "element-ui";

Vue.use(Button);
Vue.use(Form);
Vue.use(Input);
Vue.use(FormItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItemGroup);
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(input);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(tooltip);
Vue.use(pagination);
Vue.use(dialog);
Vue.use(tag);
Vue.use(Tree);
Vue.use(select);
Vue.use(option);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox;
