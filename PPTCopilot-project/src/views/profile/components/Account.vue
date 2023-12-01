<template>
  <!--上传文件-->
  <div>
    <t-button type="primary" @click="handleCreate">
      <cloud-upload-icon slot="icon" />
      上传头像
    </t-button>
    <el-form>
      <el-form-item>
        <div>昵称</div>
        <el-input v-model="nameInput" placeholder="输入新昵称" />
      </el-form-item>
      <el-form-item>
        <div>个性签名</div>
        <el-input v-model="descriptionInput" placeholder="输入新个性签名" />
      </el-form-item>
      <el-form-item>
        <div>Email</div>
        <el-row>
          <el-col style="width: 92%;">
            <el-input v-model="EmailInput" placeholder="输入新邮箱" />
          </el-col>
          <t-button type="primary" style="margin-left: 1%; width: 7%;" @click = "sendEmail">验证</t-button>
        </el-row>
      </el-form-item>
      <el-form-item>
        <div>验证码</div>
        <el-input v-model.trim="code" />
      </el-form-item>
      <el-form-item>
        <t-button type="primary" @click="submit">更新</t-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  CloudUploadIcon,
} from 'tdesign-icons-vue';
import { upload,checkEmail,sendEmail,resetEmail,resetName,resetDescription } from '@/api/user'
export default {
  components: {
    CloudUploadIcon,
  },
  data() {
    return {
      code: '',
      nameInput: '',
      EmailInput: '',
      descriptionInput: '',
    }
  },
  computed: {
    ...mapGetters([
      'id',
    ])
  },

  methods: {
    submit() {
      //若用户名和邮箱都为空，则不更新
      if (this.nameInput === '' && this.EmailInput === '' && this.descriptionInput === '') {
        this.$message({
          message: '无更新',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      if(this.descriptionInput !== ''){
        resetDescription(this.id,this.descriptionInput).then(response => {
          this.updateUserInfo("", "", this.descriptionInput)
          this.$message({
            message: '个性签名修改成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      }
      //若邮箱不为空，则需要验证码
      if (this.EmailInput !== '') {
        this.resetEmail()
      }

      //若用户名，直接修改即可
      if (this.nameInput !== '') {
        //检查用户名是不是大于4位
        if (this.nameInput.length < 4) {
          this.$message({
            message: '用户名长度不能小于4位',
            type: 'error',
            duration: 5 * 1000
          })
          return
        }
        resetName(this.id, this.nameInput).then(response => {
          this.updateUserInfo(this.nameInput,"","")
          this.$message({
            message: '用户名修改成功',
            type: 'success',
            duration: 5 * 1000
          })
        })
      }

    },
    sendEmail(){
      //检查是不是邮箱
      if(this.EmailInput.indexOf('@') === -1){
        this.$message({
          message: '请输入正确的邮箱',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      sendEmail(this.EmailInput).then(response => {
        this.$message({
          message: '验证码已发送',
          type: 'success',
          duration: 5 * 1000
        })
      })
    },
    handleCreate() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';

      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];

        // 验证文件类型
        if (file.type !== 'image/png') {
          this.$message({
            message: '只能上传 PNG 文件',
            type: 'error',
            duration: 1 * 1000
          });
          return;
        }

        const formData = new FormData();
        formData.append('savedir', 'static/user/' + this.id);
        formData.append('uploadname', file, file.name);
        formData.append('savename', 'avatar.png');
        upload(formData).then(response => {
          this.$message({
            message: '上传成功',
            type: 'success',
            duration: 1 * 1000
          });
          location.reload();
        });
      });

      fileInput.click();
    },
    updateUserInfo(name,email,description){
      if(name!== ''){
        this.$store.dispatch('user/setName', name)
      }
      if(email!== '') {
        this.$store.dispatch('user/setEmail', email)
      }
      if(description!== '') {
        this.$store.dispatch('user/setDesprition', description)
      }
    },

    resetEmail(){
      if (this.code === '') {
        this.$message({
          message: '请输入验证码',
          type: 'error',
          duration: 5 * 1000
        })
      }
      else {
        //验证验证码
        checkEmail({
          'email': this.EmailInput,
          'code': this.code,
        }).then(response => {
          //验证码正确，修改邮箱
          resetEmail(this.id, this.EmailInput).then(response => {
            this.updateUserInfo("",this.EmailInput,"")
            this.$message({
              message: '邮箱修改成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        })
      }
    }
  }
}
</script>
