<template>
  <div class="home-container">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
          <span class="title">电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
      </el-header>
      <!-- 内容区域 -->
      <el-container>
        <!-- 侧边栏区域 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 菜单栏 -->
          <el-menu :default-active="activePath" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#359bff" unique-opened :collapse="isCollapse" :collapse-transition="false" router>
            <!-- 导航1 -->
            <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
              <!-- 一级菜单 -->
              <template slot="title">
                <i :class="iconObj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      menuList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-lifangti',
        101: 'iconfont icon-shangping',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: '' // 激活菜单项
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear() // 清除token
      this.$router.push('/login')
    },
    // 获取所有菜单项
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error('获取菜单数据失败')
      this.menuList = res.data
    },
    // 点击按钮切换菜单折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存点击菜单项激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #363d40;

  .title {
    color: #fff;
  }
}

.el-container {
  min-height: 100vh;

  .el-aside {
    background-color: #313743;

    .toggle-button {
      background-color: #475163;
      color: #fff;
      text-align: center;
      font-size: 10px;
      line-height: 24px;
      letter-spacing: 0.2em;
      cursor: pointer;
    }

    .el-menu {
      border-right: none;
    }
  }
}

.iconfont {
  margin-right: 10px;
}
</style>
