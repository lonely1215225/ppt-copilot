<template>
  <div class="container">
    <el-card>
      <el-row :gutter="20">
        <t-tag style="margin: 10px 10px;" theme="primary">{{ template_id | templateStatus }}</t-tag>
      </el-row>
      <el-row :gutter="20">
        <t-input v-model="topic" placeholder="请输入主题" style="width: 300px;margin: 10px 10px;" />
      </el-row>
      <el-row :gutter="20">
        <t-input v-model="sponsor" placeholder="请输入汇报人" style="width: 300px;margin: 10px 10px;" />
      </el-row>
      <el-row :gutter="20">
        <t-button type="primary" @click="createPPT" style="margin: 10px 10px;">创建PPT
        </t-button>
      </el-row>
      <h1>
        选择模板
      </h1>
      <div style="width: 80% ;margin: 0 auto;">
        <el-row :gutter="20" class="template-row">
          <el-col v-for="(card, index) in paginatedCards" :key="index" :span="6">
            <t-card class="template-card">
              <t-image :src="card.imageUrl" class="template-cover" />
              <el-radio v-model="template_id" :label="card.id" class="template-title">{{ card.title }}</el-radio>
            </t-card>
          </el-col>
        </el-row>
        <div class="pagination-container">
          <t-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
            :total="cards.length" layout="prev, pager, next, jumper" />
        </div>
      </div>


    </el-card>
  </div>
</template>
<script>
import { getAllTemplates } from "@/api/template";
export default {
  data() {
    return {
      topic: '',
      sponsor: '',
      template_id: 0,
      currentPage: 1,
      pageSize: 4,
      cards: [
      ]
    };
  },
  filters: {
    templateStatus(value) {
      if (value === 0) {
        return '未选择模板';
      } else {
        return '已选择模板';
      }
    }
  },
  computed: {
    paginatedCards() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.cards.slice(startIndex, endIndex);
    }
  },
  mounted() {
    getAllTemplates().then(response => {
      this.cards = response.data;
    });
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    createPPT() {
      if (this.template_id === 0) {
        this.$message({
          message: '请选择模板',
          type: 'warning'
        });
      } else if (this.topic === '') {
        this.$message({
          message: '请输入主题',
          type: 'warning'
        });
      } else if (this.sponsor === '') {
        this.$message({
          message: '请输入汇报人',
          type: 'warning'
        });
      } else {
        this.$router.push({
          path: '/direction/edit',
          query: {
            project_id: this.$route.query.project_id,
            file_name: this.$route.query.file_name,
            topic: this.topic,
            sponsor: this.sponsor,
            template_id: this.template_id
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 20px;
}

.template-row {
  margin-top: 20px;
  margin-left: -10px;
  margin-right: -10px;
}

.template-card {
  margin-bottom: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.template-cover {
  height: 120px;
  object-fit: cover;
  border-radius: 4px 4px 0 0;
}

.template-title {
  display: block;
  margin-top: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
