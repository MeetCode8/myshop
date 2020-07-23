<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片导航区 -->

    <el-card class="box-card">
      <!-- 输入框的内容 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="infoQuery.query" clearable @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户信息内容 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="mg_state">
          <!-- 插入一个插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 插入一个插槽 -->
          <template slot-scope="scope">
            <!-- 按钮编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 按钮删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 按钮设置 -->
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                :enterable="false"
                @click="getUserDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页栏 -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="infoQuery.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="10"
      ></el-pagination>
    </el-card>
    <!-- 添加用户弹出窗口 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form
        :model="addFrom"
        :rules="addFromRouter"
        ref="ruleFormRef"
        label-width="80px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="用户邮件" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="用户手机" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑修改用户 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editeDiologeClosed"
    >
      <el-form
        :model="editeFrom"
        :rules="editeFromRouter"
        ref="editeFromRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名称">
          <el-input v-model="editeFrom.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="用户邮箱">
          <el-input v-model="editeFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="用户手机">
          <el-input v-model="editeFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 设置分配角色 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%">
      <p>当前的用户： {{userInfo.username}}</p>
      <p>当前的角色： {{userInfo.role_name}}</p>
      <p>
        分配新的角色
        <el-select v-model="setUserSelect" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "users",
  data() {
    return {
      infoQuery: {
        query: "",
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      totle: 0,
      addDialogVisible: false,
      editDialogVisible: false,
      setRoleDialogVisible: false,
      userInfo: "",
      addFrom: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      roleList: [],
      setUserSelect: "",
      addFromRouter: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { min: 3, max: 11, message: "长度在 3 到 11 个字符", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入用户电话", trigger: "blur" },
          { min: 3, max: 12, message: "长度在 3 到 12 个字符", trigger: "blur" }
        ]
      },

      editeList: {},
      editeFromRouter: {
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入用户邮箱", trigger: "blur" },
          { trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入用户电话", trigger: "blur" },
          { trigger: "blur" }
        ]
      },
      editeFrom: {}
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.infoQuery
      });
      if (res.meta.status != 200)
        return this.$message.error("获取用户列表数据错误");
      this.userList = res.data.users;
      this.totle = res.data.totle;
      // console.log(res);
    },
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.infoQuery.pagesize = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.infoQuery.pagenum = newPage;
      this.getUserList();
    },
    // 请求的数据转态
    async userStatusChange(userinfo) {
      // console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        res.mg_state = !res.mg_state;
        this.$message.error("请求的转态错误");
      }
      console.log("请求的数据转态成功！");
    },
    addDialogClosed() {
      this.$refs.ruleFormRef.resetFields();
    },
    addUser() {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addFrom);
        console.log(res);

        if (res.meta.status !== 201) {
          this.$message.error("请求添加数据失败");
        }
        this.$message.success("请求数据成功！");
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    async showEditDialog(id) {
      // console.log(id);
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息错误！");
      }
      this.$message.success("查询用户信息成功！");
      this.editeFrom = res.data;
      this.editDialogVisible = true;
    },
    editeDiologeClosed() {
      this.$refs.editeFromRef.resetFields();
    },
    editUserInfo() {
      this.$refs.editeFromRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editeFrom.id,
          {
            email: this.editeFrom.email,
            mobile: this.editeFrom.mobile
          }
        );
        if (res.meta.status !== 200) {
          this.$message.error("修改用户信息错误!");
        }
        this.editDialogVisible = false;
        this.getUserList();
        this.$message.success("修改用户信息成功！");
      });
    },
    async removeUserById(id) {
      const comfirmRuselt = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => {
        return err;
      });
      if (comfirmRuselt !== "confirm") {
        return this.$message.info("用户取消删除！");
      }
      // console.log("用户确认了删除");
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户信息错误！");
      }
      this.$message.success("删除用户信息成功");
      this.getUserList();
    },
    async getUserDialog(userInfo) {
      this.userInfo = userInfo;

      // 获取角色列表的数据请求
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表的请求失败！");
      }
      this.$message.success("获取角色的请求数据成功!");
      this.roleList = res.data;
      console.log(this.roleList);
      this.setRoleDialogVisible = true;
    },
    async saveRolesInfo() {
      if (!this.setUserSelect) {
        return this.$message.error("请选择分配的角色!");
      }
      const { data: res } = await this.$http.post(
        `users/${this.userInfo.id}/role`,
        {
          rids: this.setUserSelect
        } 
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新角色失败！");
      }
      this.$message.success("更新角色成功");

      this.getUserList();

      this.setRoleDialogVisible = false;
    }
  }
};
</script>

<style scope lang='less'>
.el-breadcrumb {
  margin-bottom: 25px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15px);
}
.el-table {
  margin-top: 20px;
  font-size: 16px;
}
.el-pagination {
  margin-top: 20px;
}
</style>