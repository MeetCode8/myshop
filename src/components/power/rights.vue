<template>
  <div>
    <!-- 权限管理的面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 权限管理的card -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0' ">标签一</el-tag>
            <el-tag v-else-if="scope.row.level === '1' " type="success">标签二</el-tag>
            <el-tag type="info" v-else>标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "rights",
  data() {
    return {
      //   获取权限列表信息
      rightsList: []
    };
  },
  created() {
    this.getRigthList();
  },
  methods: {
    async getRigthList() {
      const { data: res } = await this.$http.get("rights/list");
      if (res.meta.status !== 200) {
        return this.$message.err("获取用户的权限错误!");
      }
      this.$message.success("获取用户权限成功!");
      this.rightsList = res.data;
      console.log(this.rightsList);
    }
  }
};
</script>

<style scope>
</style>