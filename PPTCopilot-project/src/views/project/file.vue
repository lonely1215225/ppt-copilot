<template>
  <div class="project-container">
    <el-col :span="14">
      <el-card class="box-card">
        <div class="project-info-container">
          <div class="project-header">
            <h2>项目文件</h2>
            <div v-if="this.name === this.username">
              <t-button type="primary" @click="dialogFormVisible = true" style="margin-right: 10px">
                <add-icon slot="icon" />
                新建PPT</t-button>
              <t-dialog title="新建演示幻灯片" :visible.sync="dialogFormVisible">
                <t-form :model="form">
                  <t-form-item label="幻灯片标题" :label-width="formLabelWidth">
                    <t-input v-model="form.name" autocomplete="off"></t-input>
                  </t-form-item>
                </t-form>
                <span slot="footer" class="dialog-footer">
                  <t-button @click="dialogFormVisible = false">取消</t-button>
                  <t-button type="primary" @click="goto_direction">确认</t-button>
                </span>
              </t-dialog>
              <t-button type="primary" @click="handleCreate">
                <cloud-upload-icon slot="icon" />
                上传文件
              </t-button>
            </div>
            <!-- <div v-else>
              <t-button type="primary" @click="cloneProject">克隆项目</t-button>
            </div> -->
          </div>
        </div>

        <div v-for="file in files" :key="file.Id" class="file-item">
          <FileRow :id="id" :name="file.Name" :description="file.Project.Description" :updateTime="file.Updated"
            :deleteFile="deleteFile" :downloadFile="downloadFile" :renameFile="renameFile" :isOwner="checkOwner()" />
        </div>
        <t-dialog header="重命名" body="对话框内容" :visible.sync="renameVisible" @confirm="onRenameConfirm"
          :confirmOnEnter="true" :onConfirm="onRenameConfirmAnother" :onCancel="onRenameCancel" :onClose="renameClose">
          <t-input v-model="newFileName" placeholder="请输入新的文件名称"></t-input>
        </t-dialog>
      </el-card>
    </el-col>
    <el-col :span="9">
      <t-card :title="project_panel_title" header-bordered :style="{ width: '500px' }">
        <!-- 判断是否是自己的项目，如果是自己的项目，让克隆项目按钮不可用 -->
        <el-row>
          <el-col :span="7">
            <div v-if="checkOwner()">
              <t-button type="primary" disabled>
                <arrow-down-rectangle-icon slot="icon" />
                克隆项目</t-button>
            </div>
            <div v-else>
              <t-button type="primary" @click="cloneProject">
                <arrow-down-rectangle-icon slot="icon" />
                克隆项目</t-button>
            </div>
          </el-col>
          <el-col :span="7">
            <div v-if="this.username != this.name">
              <t-button type="primary" disabled>
                <edit-icon slot="icon" />
                {{ edit_button }}</t-button>
            </div>
            <div v-else>
              <t-button type="primary" @click="handleEdit">
                <edit-icon slot="icon" />
                {{ edit_button }}</t-button>
            </div>
          </el-col>
          <el-col :span="6">
            <div v-if="this.liked">
              <!-- <el-button type="primary" @click="unlikeProject">取消收藏</el-button>
                   -->
              <t-button theme="primary" @click="unlikeProject">
                <heart-filled-icon slot="icon" />
                取消 {{ this.star }}
              </t-button>
            </div>
            <div v-else>
              <!-- <el-button type="primary" @click="likeProject">收藏</el-button> -->
              <t-button theme="primary" @click="likeProject">
                <heart-icon slot="icon" />
                收藏 {{ this.star }}
              </t-button>
            </div>
          </el-col>
          <el-col :span="3">
            <t-button type="primary" @click="handleShare">
              <share-icon slot="icon" />
              分享
            </t-button>
          </el-col>
        </el-row>
        <el-row>
          <div style="display:block" id="project-info">
            <!-- <div style="display:block"> -->
            <h4>项目名: {{ this.projectName }}</h4>
            <p>项目简介: {{ this.description }}</p>
            <p>修改时间: {{ this.ProUpdated | formatDate }}</p>
          </div>
          <div style="display:none" id="project-info-edit">
            <h4>项目名: </h4>
            <t-input v-model="projectName" placeholder="请输入新的项目名称"></t-input>
            <p>项目简介: </p>
            <t-input v-model="description" placeholder="请输入新的项目简介"></t-input>
          </div>
        </el-row>

      </t-card>
      <t-card :title="user_panel_title" header-bordered :style="{ width: '500px' }">
        <h4>{{ this.username }}</h4>
        <img :src=user_avatar width="100px" height="100px" />
      </t-card>

    </el-col>
  </div>
</template>

<script>
import FileRow from '@/views/project/components/FileCard/index.vue';
import {
  getFile,
  uploadFile,
  deleteFile,
  getProject,
  likeProject,
  cloneProject,
  unlikeProject,
  checkLikePorject
} from "@/api/project"
import { mapGetters } from 'vuex'
import {
  AddIcon,
  HeartIcon,
  HeartFilledIcon,
  CloudUploadIcon,
  ArrowDownRectangleIcon,
  ShareIcon,
  EditIcon,
} from 'tdesign-icons-vue';
import { updateProject, renameFile } from '@/api/project';
export default {
  components: {
    FileRow,
    HeartIcon,
    HeartFilledIcon,
    CloudUploadIcon,
    AddIcon,
    ArrowDownRectangleIcon,
    ShareIcon,
    EditIcon,
  },
  data() {
    return {
      id: this.$route.params.id,
      files: [],
      projectName: "我的项目",
      star: "0",
      ProUpdated: "2020-01-01",
      username: "",
      description: "暂无简介",
      mine: false,
      liked: false,
      dialogFormVisible: false,
      form: {
        name: '',
      },
      project_panel_title: '项目信息',
      user_panel_title: '用户信息',
      edit_button: '编辑信息',
      renameVisible: false,
      onEdit: false,
      newFileName: '',
      oldFileName: '',
      user_avatar: '',
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getProjectFiles(this.id);
    this.getProjectInfo();
    this.checklikepro();
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      return year + "-" + month + "-" + day + " " + hour + ":" + minute;
    }
  },
  computed: {
    ...mapGetters([
      'name',
    ])
  },
  methods: {
    handleEdit() {
      if (this.onEdit) {
        this.onEdit = false
        this.edit_button = '编辑信息'
        // 将id为project-info的div隐藏，将id为project-info-edit的div显示
        document.getElementById("project-info").style.display = "block";
        document.getElementById("project-info-edit").style.display = "none";
        //
        updateProject(this.id,
          {
            "name": this.projectName,
            "description": this.description,
          }
        ).then(response => {
          this.getProjectInfo()
        })
        return;
      } else {
        this.onEdit = true
        this.edit_button = '保存信息'
        // 将id为project-info的div隐藏，将id为project-info-edit的div显示
        document.getElementById("project-info").style.display = "none";
        document.getElementById("project-info-edit").style.display = "block";

      }
    },
    checkOwner(){
      return this.name === this.username;
    },
    handleShare() {
      // 复制当前页面的url
      // 并弹出提示“复制分享链接成功”
      var url = window.location.href; // 获取当前页面的url
      var oInput = document.createElement('input'); // 创建一个隐藏input（重要！）
      oInput.value = url; // 将url放到这个input的value里面去
      document.body.appendChild(oInput); // 将这个input加入到dom中
      oInput.select(); // 选中input框中的内容
      document.execCommand("Copy"); // 执行复制
      oInput.className = 'oInput';
      oInput.style.display = 'none';
      this.$message({
        type: 'success',
        message: '复制分享链接成功'
      })
    },
    goto_direction() {
      this.dialogFormVisible = false
      this.$router.push({
        path: '/direction/index',
        query: {
          project_id: this.id,
          file_name: this.form.name + '.json',
        }
      });
    },
    getProjectInfo() {
      getProject(this.id).then(response => {
        this.projectName = response.data.Name
        this.star = response.data.Star
        this.ProUpdated = response.data.Updated
        this.username = response.data.Creator.Username
        this.user_id = response.data.Creator.Id
        this.user_avatar = "http://{{server_ip}}:8080/_static/user/" + this.user_id + "/avatar.png?time=" + new Date().getTime();
        this.description = response.data.Description
      })
    },
    getProjectFiles(id) {
      getFile(id).then(response => {
        this.files = response.data
      })
    },
    deleteFile(id, filename) {
      deleteFile(id, filename).then(response => {
        this.getProjectFiles(this.id)
      })
      // 实现删除文件的逻辑
    },
    downloadFile(id, filename) {
      // 实现下载文件的逻辑
      // 打开新窗口
      window.open("http://{{server_ip}}:8080/_static/project/" + id + "/" + filename)
    },
    renameFile(id, filename) {
      // 实现重命名文件的逻辑
      this.renameVisible = true
      this.oldFileName = filename
    },
    handleCreate() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';

      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        // 在这里可以对文件进行处理，例如发送到服务器等
        const formData = new FormData();
        formData.append('uploadname', file, file.name);
        formData.append('savename', file.name);
        uploadFile(this.id, formData).then(response => {
          this.getProjectFiles(this.id)
        })
      });
      fileInput.click();
    },
    likeProject() {
      // 实现收藏项目的逻辑
      likeProject(this.id).then(response => {
        this.$message({
          type: 'success',
          message: '收藏项目成功'
        })
        this.liked = true
        this.checklikepro()
        this.getProjectInfo()
      })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '收藏项目失败'
          })
        })
    },
    cloneProject() {
      // 实现克隆项目的逻辑
      cloneProject(this.id).then(response => {
        this.$message({
          type: 'success',
          message: '克隆项目成功'
        })
      })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '克隆项目失败'
          })
        })
    },
    unlikeProject() {
      // 实现取消收藏项目的逻辑
      unlikeProject(this.id).then(response => {
        this.$message({
          type: 'success',
          message: '取消收藏项目成功'
        })
        this.liked = false
        this.checklikepro()
        this.getProjectInfo()
      })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '取消收藏项目失败'
          })
        })
    },
    checklikepro() {
      checkLikePorject(this.id).then(response => {
        this.liked = response.data
      })
    },
    onRenameConfirm() {
      // 实现重命名文件的逻辑
      renameFile(this.id,
        {
          "old_name": this.oldFileName,
          "new_name": this.newFileName,
        }
      ).then(response => {
        this.renameVisible = false
        this.getProjectFiles(this.id)
      })
    },
    onRenameConfirmAnother() {

    },
    onRenameCancel() {
      this.renameVisible = false
    },
    renameClose() {
      this.renameVisible = false
    },
  }
}
</script>

<style scoped>
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.file-item {
  margin-bottom: 10px;
}

.el-card {
  margin: 10px;
}
</style>
