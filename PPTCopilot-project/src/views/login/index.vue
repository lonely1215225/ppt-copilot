<template>
  <div class="auth-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="auth-form" auto-complete="on"
             label-position="left">
      <div class="wrapper">
        <div class="title-container">
          <img
            src="https://user-images.githubusercontent.com/75596353/236753989-c95dd9d6-029e-4456-aec4-dd65363a9c5d.png"
            alt="PPTCopilot Logo" class="logo">
          <h1 class="title">登录</h1>
        </div>

        <el-form-item prop="username_or_email">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
          <el-input ref="username_or_email" v-model="loginForm.username_or_email" placeholder="Username or Email"
                    name="username_or_email" type="text" tabindex="1" auto-complete="on"/>
        </el-form-item>

        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
          <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType"
                    placeholder="Password" name="password" tabindex="2" auto-complete="on"
                    @keyup.enter.native="handleLogin"/>
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                   @click.native.prevent="handleLogin">登录
        </el-button>

        <div class="auth-footer">
          <span>没有账号？</span>
          <router-link to="/register">注册</router-link>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('The username can not be less than 4 digits'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username_or_email: 'john_doe',
        password: 'password123'
      },
      loginRules: {
        username_or_email: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.loading = true
      this.$store.dispatch('user/login', this.loginForm).then(() => {
        this.$router.push({path: this.redirect || '/'})
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/css/auth.scss";
@include authInput();
</style>

<style lang="scss" scoped>
@import "@/assets/css/auth.scss";
@include authBackground();
</style>
