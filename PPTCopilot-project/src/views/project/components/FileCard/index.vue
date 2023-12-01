<template>
  <el-row class="file-row">
    <el-col :span="8">
      <div class="file-name">{{ name }}</div>
    </el-col>
    <el-col :span="8">
      <div class="file-update-time">{{ updateTime | formatDate }}</div>
    </el-col>
    <el-col :span="8">
      <div class="file-description">
        <div class="center-right">
          <t-button size="mini" v-show="showOpenBtn" @click="goto_pptist" style="margin-right: 10px">打开</t-button>
        </div>
        <div v-if="isOwner">
          <t-dropdown :options="options">
            <t-button variant="outline">
              更多
            </t-button>
          </t-dropdown>
        </div>
        <div v-else>
          <t-dropdown :options="guestoptions">
            <t-button variant="outline">
              更多
            </t-button>
          </t-dropdown>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    updateTime: {
      type: String,
      required: true
    },
    renameFile: {
      type: Function,
      required: true
    },
    deleteFile: {
      type: Function,
      required: true
    },
    downloadFile: {
      type: Function,
      required: true
    },
    isOwner: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      showOpenBtn: false,
      options: [
        {
          content: '重命名',
          value: 'rename',
          onClick: () => {
            this.renameFile(this.id, this.name)
          }
        },
        {
          content: '下载',
          value: 'download',
          onClick: () => {
            this.downloadFile(this.id, this.name)
          }
        },
        {
          content: '删除',
          value: 'delete',
          onClick: () => {
            this.deleteFile(this.id, this.name)
          }
        },
      ],

      guestoptions: [
        {
          content: '下载',
          value: 'download',
          onClick: () => {
            this.downloadFile(this.id, this.name)
          }
        },
      ]
    }
  },
  filters: {
    formatDate(time) {
      const date = new Date(time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      return `${year}-${month}-${day} ${hour}:${minute}`
    }
  },
  mounted() {
    if (this.name.split('.')[1] === 'json' || this.name.split('.')[1] === 'pptx' || this.name.split('.')[1] === 'pptist') {
      this.showOpenBtn = true
    }
  },
  methods: {
    goto_pptist() {
      this.$router.push({path: '/pptist/index', query: {project_id: this.id, file_name: this.name}})
    },
    handleCommand(command) {
      switch (command) {
        case 'rename': {
          this.renameFile(this.id)
        }
          break;
        case 'delete': {
          console.log('delete')
          this.deleteFile(this.id, this.name)
        }
          break;
      }
    }
  }
}
</script>

<style scoped>
.file-row {
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 10px;
}

.file-name {
  font-weight: bold;
}

.file-update-time {
  text-align: center;
}

.edit {
  display: flex;
  justify-content: flex-end;
}

.el-dropdown-link {
  cursor: pointer;
  color: #333;
}

.file-description {
  display: flex;
  justify-content: flex-end;
  align-items: center;

}

.center-right {
  margin-left: auto;
}
</style>
