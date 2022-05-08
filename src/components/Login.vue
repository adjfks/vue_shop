<template>
  <div class="login-container">
    <div class="login-box">
      <h2 class="login-title">登录</h2>
      <el-form ref="loginFormRef" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-button class="login-btn" type="primary" @click="login">登录</el-button>
        <a class="login-reset" @click="$refs.form.resetFields()">重置</a>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('/login', this.form)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功~')
        window.sessionStorage.setItem('token', res.data.token) // 存储token
        return this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e3fdfd;

  .login-box {
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 400px;
    height: 300px;
    background-color: #fff;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.03);
    padding: 0 50px;

    .login-title {
      text-align: center;
    }

    .login-btn {
      width: 100%;
      margin-bottom: 20px;
    }

    .login-reset {
      display: block;
      color: #9ba4b4;
      font-size: 12px;
      margin-left: auto;
      width: max-content;
      cursor: pointer;
    }
  }
}
</style>
