<template>
  <div class="roles-container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 按钮 -->
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>

      <!-- 数据表格 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, idx1) in scope.row.children" :key="item1.id" :class="['auth-list-row', 'bdbottom', idx1 === 0 ? 'bdtop' : '', 'vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row, item1.id)" closable="">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2, idx2) in item1.children" :key="item2.id" :class="[idx2 !== 0 ? 'bdtop' : '', 'vcenter']">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" width="100"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="level" label="操作" width="300">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <!-- 分配角色按钮 -->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 信息主体内容 -->
      <el-form ref="addFormRef" :model="addForm" label-width="70px" :rules="addFormRules">
        <!-- roleName -->
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- footer区域 -->
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色信息 对话框 -->
    <el-dialog title="编辑角色信息" :visible.sync="editDialogVisible" width="50%" @close="closeEditForm">
      <!-- 编辑角色表单 -->
      <el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="editFormRules">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="SetRightDialogCLosed">
      <!-- 树形控件 -->
      <el-tree :data="authList" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defCheckedKeys" ref="treeRef"> </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAuth">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      // 权限列表
      authList: [],
      // 树形控件对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中key数组
      defCheckedKeys: [],
      addDialogVisible: false, // 添加角色遮罩层展示
      // 添加角色表单
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色表单规则
      addFormRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名长度为3-10个字符之间', trigger: 'blur' }
        ]
      },
      // 编辑角色表单
      editForm: {},
      editFormRules: {
        roleName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名长度为3-10个字符之间', trigger: 'blur' }
        ]
      },
      // 编辑角色对话框
      editDialogVisible: false,
      // 分配权限对话框
      setRightDialogVisible: false,
      // 即将分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data
      this.$message.success(res.meta.msg)
    },

    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },

    // 添加角色提交
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return
        // 发起请求添加角色
        const { data: res } = await this.$http.post('/roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getRolesList()
        this.addDialogVisible = false
        return this.$message.success(res.meta.msg)
      })
    },

    // 点击编辑按钮
    async showEditDialog(id) {
      this.editDialogVisible = true // 显示对话框
      // 发起请求获取角色信息
      const { data: res } = await this.$http.get('/roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
    },

    // 关闭修改对话框
    closeEditForm() {
      this.$refs.editFormRef.resetFields() // 重置表单
    },
    // 编辑角色提交
    editRole() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        this.editDialogVisible = false
        const { data: res } = await this.$http.put('/roles/' + this.editForm.id, { roleName: this.editForm.roleName, roleDesc: this.editForm.roleDesc })
        console.log(res)
        // 更新失败
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)

        this.getRolesList() // 更新成功,刷新列表
        return this.$message.success(res.meta.msg)
      })
    },

    // 删除角色权限
    async removeRightById(role, rightId) {
      // 消息弹框
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      if (confirmResult !== 'confirm') return
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      role.children = res.data
      return this.$message.success(res.meta.msg)
    },

    // 分配权限按钮
    async showSetRightDialog(role) {
      // 保存即将分配权限的角色id
      this.roleId = role.id
      // 递归生成树形控件默认选中keys数组
      this.getDefCheckedKeys(role, this.defCheckedKeys)
      this.setRightDialogVisible = true
      // 获取所有权限列表
      const { data: res } = await this.$http.get('/rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.authList = res.data
    },

    // 获取树形控件key数组的递归方法
    getDefCheckedKeys(node, arr) {
      // 获取三级权限的id
      if (!node.children) return arr.push(node.id)

      node.children.forEach((item) => {
        this.getDefCheckedKeys(item, arr)
      })
    },
    // 监听分配权限对话框关闭事件
    SetRightDialogCLosed() {
      // 清空默认选中的key数组
      this.defCheckedKeys = []
    },
    // 分配权限提交
    async editAuth() {
      // 获取所有选中、半选中的权限id
      const authKeys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const keyStr = authKeys.join(',')
      // 发起请求分配权限
      const { data: res } = await this.$http.post(`/roles/${this.roleId}/rights`, { rids: keyStr })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getRolesList() // 刷新列表
      this.$message.success(res.meta.msg)
      this.setRightDialogVisible = false // 关闭对话框
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 15px 10px;
}

.bdtop {
  border-top: 1px solid #ccc;
}

.bdbottom {
  border-bottom: 1px solid #ccc;
}

.auth-list-row {
  margin: 0 15px;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
