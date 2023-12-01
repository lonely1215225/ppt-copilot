<template>
  <div class="project-card">
    <div class="project-image">
      <img :src="image" alt="">
    </div>
    <h3>{{ title }}</h3>
    <p>{{ Updated }}</p>
    <div class="project-actions">
      <t-button type="primary" @click="openFile">打开</t-button>
      <div v-if="edit">
        <t-dropdown :options="options">
          <t-button variant="outline">
            更多
          </t-button>
        </t-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectCard',
  data() {
    return {
      options: [
        {
          content: '重命名',
          value: 'rename',
          onClick: () => {
            this.handleRename(this.id)
          }
        },
        {
          content: '上传封面',
          value: 'upload',
          onClick: () => {
            this.handleUpload(this.id)
          }
        },
        {
          content: '删除',
          value: 'delete',
          onClick: () => {
            this.handleDelete(this.id)
          }
        },
      ]
    }
  },
  props: {
    image: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    Updated: {
      type: String,
      // 获取当前日期，不需要小时
      default: new Date().toLocaleDateString()
    },
    id: {
      type: Number,
      default: 1
    },
    handleDelete: {
      type: Function,
      required: true
    },
    handleRename: {
      type: Function,
      required: true
    },
    handleUpload: {
      type: Function,
      required: true
    },
    edit: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleClick() {
      // 处理点击事件
      this.$message.error('ok')
    },
    openFile() {
      console.log(1)
      this.$router.push({ path: '/project/' + this.id + '/file' })
    },
    
  }
}
</script>
<style scoped>
.project-card {
  border: 1px solid #ebebeb;
  border-radius: 4px;
  padding: 20px;
  margin: 10px;
}

.project-card:hover {
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.project-image {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.project-image img {
  max-width: 100%;
  max-height: 100%;
}

.project-actions {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

