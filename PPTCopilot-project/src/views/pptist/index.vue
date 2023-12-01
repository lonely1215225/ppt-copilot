<template>
  <!--  显示外部界面-->

  <div id="app">
    <iframe src="http://{{server_ip}}:7777" id="pptist-frame" frameborder="0" @load="handleIframeLoad" width="100%"
            height="100%"></iframe>
  </div>
</template>

<script>

import {getStaticFile, saveStaticFile} from "@/api/project";
import axios from 'axios';
import request from "@/utils/request";

import { Loading } from 'element-ui'


export default {
  props: ['project_id', 'file_name'], // 接收父组件传递的参数
  data() {
    return {}
  },
  mounted() {

  },
  methods: {
    handleIframeLoad() {

      const loadingInstance = Loading.service()

      // 导入选定文件
      let matches = document.cookie.match(/token=([^;]+)/);
      let token = (matches ? matches[1] : null);
      const iframe = document.getElementById('pptist-frame');
      const iframeWindow = iframe.contentWindow;
      const projectId = this.project_id === undefined ? 1 : this.project_id;
      const fileName = this.file_name === undefined ? 'test.json' : this.file_name;
      getStaticFile(projectId, fileName).then(res => {
        console.log("this is pptits")
        console.log(res)
        loadingInstance.close()
        // print length
        iframeWindow.postMessage(res, 'http://{{server_ip}}:7777');
      }).catch(err => {
        loadingInstance.close()
        console.log(err)
      })

      window.addEventListener('message', function(event) {
        if (event.origin !== 'http://{{server_ip}}:7777') return
        const blobStr = event.data;
        console.log(JSON.stringify(event))
        const blob = new Blob([blobStr], {type: '*'});
        console.log("template length: " + blobStr.length)
        saveStaticFile(projectId, fileName, blob).then(res => {
          console.log('template 9529: save success')
        }).catch(err => {
          console.log(err);
        });
      });
    }
  }
}


</script>

<style scoped>
#app {
  height: 800px;
  width: 100%;
}
</style>
