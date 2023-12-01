<template>
    <div class="project-view-container">
        <t-card :title="title" bordered hover-shadow class="box-card">
            <el-row>
                <el-col v-for="item in projectList" :key="item.Id" :span="6">
                    <ProjectViewCard :image="getImageUrl(item.Id)" :title="item.Name" :id="item.Id" :edit="edit"
                        :star="item.Star" />
                </el-col>
            </el-row>
        </t-card>
    </div>
</template>
<script>
import { getAllProject } from "@/api/project";
import ProjectViewCard from "@/views/around/components/ProjectViewCard/index.vue";
export default {
    components: { ProjectViewCard },
    data() {
        return {
            projectList: [],
            edit: false,
            title: "项目广场"
        }
    },
    created() {
        getAllProject().then(response => {
            this.projectList = response.data;
            // 随机排序
            this.projectList.sort(() => Math.random() - 0.5);
        })
    },
    methods: {
        getImageUrl(id) {
            return "http://{{server_ip}}:8080/_static/project/" + id + "/cover.png?time=" + new Date().getTime();
        },
    }
}
</script>

<style scoped>
.project-view-container {
    padding: 20px;
}
</style>