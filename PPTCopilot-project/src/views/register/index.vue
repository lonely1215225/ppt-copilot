<template>
  <div class="auth-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="auth-form" auto-complete="on"
             label-position="left">
      <div class="wrapper">
        <div class="title-container">
          <img
            src="https://user-images.githubusercontent.com/75596353/236753989-c95dd9d6-029e-4456-aec4-dd65363a9c5d.png"
            alt="PPTCopilot Logo" class="logo">
          <h1 class="title">注册</h1>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user"/>
          </span>
          <el-input ref="username" v-model="registerForm.username" placeholder="用户名"
                    name="username" type="text" tabindex="1" auto-complete="on"/>
        </el-form-item>

        <el-row>
          <el-col :span="18">
            <el-form-item prop="email">
          <span class="svg-container">
            <svg-icon icon-class="email"/>
          </span>
              <el-input ref="email" v-model="registerForm.email" placeholder="Email"
                        name="email" type="text" tabindex="2" auto-complete="on"/>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-button :loading="loading" type="primary"
                       style="margin-left: 10px;width: calc(100% - 10px); height: 55px;"
                       @click.native.prevent="sendEmail">验证
            </el-button>
          </el-col>
        </el-row>

        <el-form-item prop="ensurecode">
          <span class="svg-container">
            <svg-icon icon-class="email"/>
          </span>
          <el-input ref="ensurecode" v-model="registerForm.ensurecode" placeholder="验证码"
                    name="ensurecode" type="text" tabindex="2" auto-complete="on"/>
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"/>
          </span>
          <el-input :key="passwordType" ref="password" v-model="registerForm.password" :type="passwordType"
                    placeholder="密码" name="password" tabindex="3" auto-complete="on"
                    @keyup.enter.native="handleRegister"/>
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
          </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;"
                   @click.native.prevent="handleRegister">注册
        </el-button>

        <div class="auth-footer">
          <span>已经有账号？</span>
          <router-link to="/login">登录</router-link>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import {checkEmail, register, resetEmail, sendEmail} from "@/api/user";

export default {
  name: 'Register',

  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('用户名必须大于等于4个字符'));
      } else {
        callback();
      }
    };

    const validateEmail = (rule, value, callback) => {
      const emailRegEx = /\S+@\S+\.\S+/;
      if (!emailRegEx.test(value)) {
        callback(new Error('请输入正确的邮箱'));
      } else {
        callback();
      }
    };

    const checkcode = (rule, value, callback) => {
      if (value.length < 36) {
        callback(new Error('验证码格式错误'));
      } else {
        callback();
      }
    };

    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码必须大于等于6个字符'));
      } else {
        callback();
      }
    };

    return {
      registerForm: {
        username: '',
        email: '',
        password: '',
        ensurecode: ''
      },
      registerRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        email: [{required: true, trigger: 'blur', validator: validateEmail}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}],
        ensurecode: [{required: true, trigger: 'blur', validator: checkcode}]
      },
      loading: false,
      passwordType: 'password',
      formErrors: {} // Store form validation errors
    };
  },

  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleRegister() {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          //先检查验证码是不是正确
          checkEmail({
            'email': this.registerForm.email,
            'code': this.registerForm.ensurecode,
          })
            .catch(error => {
            })
            .then(() => {
              //注册
              register(this.registerForm)
                .then(() => {
                  this.$router.push({path: '/login'});
                  this.loading = false;
                  this.$message({
                    type: 'success',
                    message: '注册成功，请登录'
                  });
                })
                .catch(() => {
                  this.loading = false;
                });
            })
        } else {
          this.$message.error('请正确填写表单');
        }
      });
    },
    sendEmail() {
      //检查是不是邮箱
      if (this.registerForm.email.indexOf('@') === -1) {
        this.$message({
          message: '请输入正确的邮箱',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      sendEmail(this.registerForm.email).then(response => {
        this.$message({
          message: '验证码已发送',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
  }
};

</script>

<style lang="scss">
@import "@/assets/css/auth.scss";

@include authInput();

.el-form-item__error {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
</style>

<style lang="scss" scoped>
@import "@/assets/css/auth.scss";

@include authBackground();
</style>



