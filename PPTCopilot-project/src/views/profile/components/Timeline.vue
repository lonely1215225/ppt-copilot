<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of timeline" :key="index" :timestamp="item.timestamp" placement="top">
        <el-card>
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeline: [
        {
          timestamp: '2019/4/20',
          title: '新建项目1',
          content: '初始化项目 2019/4/20 20:46'
        },
        {
          timestamp: '2019/4/21',
          title: '修改项目1',
          content: '在项目1中增加了3页 2019/4/21 20:46'
        },
        {
          timestamp: '2019/4/22',
          title: '新建项目2',
          content: '初始化项目 2019/4/22 20:46'
        },
        {
          timestamp: '2019/4/23',
          title: '删除项目2',
          content: '删除项目 2019/4/23 20:46'
        }
      ]
    }
  }
}
</script>
