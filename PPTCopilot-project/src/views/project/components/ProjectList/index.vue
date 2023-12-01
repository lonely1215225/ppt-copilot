<template>
  <div class="project-list">
    <div class="card-view">
      <el-row>
        <el-col v-for="item in projectList" :key="item.Id" :span="6">
          <ProjectCard :image="getImageUrl(item.Id)" :title="item.Name" :id="item.Id" :handle-delete="handleDelete"
            :handle-rename="handleRename" :handle-upload="handleUpload" :edit="edit" />
        </el-col>
      </el-row>
    </div>
    <t-dialog header="重命名" body="对话框内容" :visible.sync="renameVisible" @confirm="onRenameConfirm" :confirmOnEnter="true"
      :onConfirm="onRenameConfirmAnother" :onCancel="onRenameCancel" :onClose="renameClose">
      <t-input v-model="newProjectName" placeholder="请输入新的项目名称"></t-input>
    </t-dialog>
    <t-dialog header="删除项目" body="对话框内容" :visible.sync="deleteVisible" @confirm="onDeleteConfirm" :confirmOnEnter="true"
      :onConfirm="onDeleteConfirmAnother" :onCancel="onDeleteCancel" :onClose="deleteClose">
      <t-text>确定要删除项目吗？</t-text>
    </t-dialog>
  </div>
</template>

<script>
import ProjectCard from "@/views/project/components/ProjectCard/index.vue";
import { deleteProject, getProjectList, updateProject } from "@/api/project";
import { mapGetters } from "vuex";
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
export default {
  name: "ProjectList",
  components: { ProjectCard },
  data() {
    return {
      newProjectName: '',
      renameVisible: false,
      deleteVisible: false,
      now_id: 0,
    }
  },
  props: {
    projectList: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
      required: true,
    },


  },

  methods: {
    getImageUrl(id) {
      return "http://{{server_ip}}:8080/_static/project/" + id + "/cover.png?t=" + new Date().getTime()
    },

    handleCommand(id) {
      //进入文件
      console.log('click')
    },
    handleDelete(id) {
      this.now_id = id;
      this.deleteVisible = true;
    },
    handleRename(id) {
      this.renameVisible = true;
      this.now_id = id;
    },
    onRenameConfirm() {
      console.log('confirm')
    },
    onRenameConfirmAnother() {
      console.log('confirm another')
      updateProject(this.now_id, {
        'name': this.newProjectName,
      }).then(response => {
        console.log(response)
        this.loadData();
        this.$message({
          type: 'success',
          message: '项目' + this.newProjectName + '修改成功'
        })
      }).finally(() => {
        this.renameVisible = false;
        // 刷新页面
        window.location.reload();
      })
    },
    onRenameCancel() {
      console.log('cancel')
    },
    renameClose() {
      this.renameVisible = false;
    },
    onDeleteConfirm() {
      console.log('confirm')
    },
    onDeleteConfirmAnother() {
      console.log('confirm another')
      deleteProject(this.now_id).then(response => {
        console.log(response)
        this.loadData();
        this.$message({
          type: 'success',
          message: '项目删除成功'
        })
      }).finally(() => {
        this.deleteVisible = false;
        // 刷新页面
        window.location.reload();
      })
    },
    onDeleteCancel() {
      console.log('cancel')
    },
    deleteClose() {
      this.deleteVisible = false;
    },
    handleUpload(id) {
      this.now_id = id;
      const fileInput = document.createElement('input');
      // 限制只能传png
      fileInput.setAttribute('accept', 'image/png');
      fileInput.setAttribute('type', 'file');
      fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        // 在这里可以对文件进行处理，例如发送到服务器等
        const formData = new FormData();
        formData.append('uploadname', file, file.name);
        formData.append('savename', 'cover.png');
        uploadFile(this.now_id, formData).then(response => {
          this.getProjectFiles(this.now_id)
        }).finally(() => {
          // 刷新页面
          window.location.reload();
        });
      });
      fileInput.click();
      // 清除当前浏览器所有图片缓存
    },
  }
}

</script>

<style scoped></style>
