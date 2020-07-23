<template>
  <div>
    <!-- 角色管理的面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 角色权限列表 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
              class="bdcenter"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
            >
              <el-col :span="5">
                <!-- 一级权限的设置 -->
                <el-tag closable @close="getRightsById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二、三级权限的设置 -->
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  class="bdcenter"
                  :class="i2 == 0 ? '' : 'bdtop'"
                >
                  <!-- 二级权限的渲染 -->
                  <el-col :span="6">
                    <el-tag
                      type="success "
                      closable
                      @close="getRightsById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限的渲染 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="getRightsById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger " icon="el-icon-delete" size="mini">删除</el-button>
            <el-button
              type="warning "
              icon="el-icon-setting"
              size="mini"
              @click="getRightsDialogVisible(scope.row)"
            >分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 设置分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="50%"
      @close="setRightsDialogCleaned"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "rolse",
  data() {
    return {
      rolesList: [],
      setRightsDialogVisible: false,
      rightsList: [],
      treeProps: {
        label: "authName",
        children: "children"
      },
      // 默认选择的节点id的值数值
      defkeys: [],
      // 当前即将分配权限的角色id
      roleId: ""
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("角色列表请求失败!");
      }
      this.$message.success("角色列表获取成功!");
      this.rolesList = res.data;
      // console.log(this.rolesList);
    },
    async getRightsById(role, rightId) {
      const rightsRreult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (rightsRreult !== "confirm") {
        return this.$message.info("用户取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除请求失败！");
      }
      this.$message.success("删除请求成功！");
      role.children = res.data;
    },
    async getRightsDialogVisible(role) {
      this.setRightsDialogVisible = true;
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败！");
      }
      this.$message.success("获取权限列表成功");
      this.rightsList = res.data;

      console.log(this.rightsList);

      this.getLeafKeys(role, this.defkeys);

      this.setRightsDialogVisible = true;
    },
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach(item => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听分配权限对话框的关闭事件
    setRightsDialogCleaned() {
      this.defkeys = [];
    },

    // 点击为角色添加分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      // console.log(keys);

      const idStr = keys.join(",");

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.setRightsDialogVisible = false;
    }
  }
};
</script>

<style lang="less" scope>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #ccc;
}
.bdbottom {
  border-bottom: 1px solid #ccc;
}
.bdcenter {
  display: flex;
  align-items: center;
}
</style>