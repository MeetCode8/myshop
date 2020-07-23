<template>
  <el-container class="home_container">
    <!-- 头部布局 -->
    <el-header>
      <div>
        <img src="../assets/img/yu.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 主体内容布局 -->
    <el-container>
      <!-- 主体内容左侧布局 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠部分 -->
        <div class="loggle_button" @click="tollge_collapse">|||</div>
        <el-menu
          default-active="2"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObject[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="subItem.path + ''"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体内容右侧布局 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
      menulist: [],
      iconsObject: {
        "125": "iconfont icon-icon_user",
        "103": "iconfont icon-shangpin",
        "101": "iconfont icon-danju",
        "102": "iconfont icon-tijikongjian",
        "145": "iconfont icon-baobiao"
      },
      isCollapse: false
    };
  },
  created() {
    // 组件创建的时候调用getMenuList()方法
    this.getMenuList();
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取左侧菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      // console.log(res);
    },
    tollge_collapse() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style scope lang="less">
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin-left: 0;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
  div img {
    width: 50px;
    height: 50px;
  }
}

.el-aside {
  background-color: #333744;
  el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home_container {
  height: 100%;
}
.iconfont {
  margin-right: 10px;
}
.loggle_button {
  background-color: #4a5064;
  line-height: 24px;
  color: #fff;
  font-size: 14px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
