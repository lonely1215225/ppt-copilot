<!-- Search.vue -->
<template>
  <div class="search-container" :class="{ 'search-centered': !totalResults }">
    <div v-if="!totalResults" class="logo">PPTCopilot</div>
    <el-input
      v-model="filterWords"
      placeholder="请输入搜索关键字"
      clearable
      :style="totalResults ? 'width: 30%; margin: 40px auto 0;' : 'width: 50%; margin: 20px auto;'"
    >
      <el-button slot="append" icon="el-icon-search" @click="searchProjectsHandler"/>
    </el-input>
    <img v-if="!totalResults" src="https://github.com/images/modules/search/home-desktop-light2x.webp" alt="Search"
         class="search-image"/>
    <div v-if="totalResults">
      <ProjectTable :projects="projects"/>
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalResults"
        layout="total, prev, pager, next"
        @current-change="changePageHandler"
        style="margin: 20px 100px 100px 222px"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {searchProjects} from '@/api/search'
import ProjectTable from './components/ProjectTable.vue'

export default {
  name: 'Search',
  components: {
    ProjectTable,
  },
  data() {
    return {
      filterWords: '',
      sortMethod: 'best-match',
      totalProjects: [],
      projects: [],
      currentPage: 1,
      pageSize: 3,
      totalResults: 0,
    }
  },
  methods: {
    searchProjectsHandler() {
      if (!this.filterWords) {
        this.$message.error('请输入搜索关键字')
        return
      }
      try {
        searchProjects(this.filterWords, this.sortMethod).then((res) => {
          console.log(res)
          this.totalResults = res.data.length
          this.totalProjects = res.data
          this.projects = res.data.slice(0, this.pageSize)

        }).catch((err) => {
          console.log(err)
        })
      } catch (error) {
        this.$message.error('搜索失败，请稍后再试')
      }
    },
    changePageHandler(newPage) {
      this.currentPage = newPage
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      this.projects = this.totalProjects.slice(start, end)
    },
  },
}
</script>

<style>
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.search-centered {
  justify-content: center;
  min-height: 100vh;
}

.logo {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 40px;
}

.search-image {
  width: 100%;
  max-width: 600px;
  margin: 20px auto;
}

.sort-container {
  display: flex;
  align-items: center;
  margin: 20px 89px 54px 162px;
}

.sort-label {
  font-size: 14px;
  margin-right: 10px;
}

.sort-radio-group {
  font-size: 12px;
}
</style>
