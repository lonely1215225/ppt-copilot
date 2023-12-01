<template>
  <el-card
    v-loading="loading"
    class="outline-card">
    <div class="custom-tree-container">
      <div class="block" style="">
        <p style="text-align: center;display: inline-block">PPT Title</p>

        <el-tree
          :data="data"
          node-key="id"
          default-expand-all
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          :expand-on-click-node="false"
        >
              <span slot-scope="{ node, data }" class="custom-tree-node">

                <span style="align-items: start">
                  <template v-if="data.edit">
                    <el-input v-model="data.label" class="edit-input" size="mini"/>
                    <el-button
                      icon="el-icon-refresh"
                      type="text"
                      @click="cancelEdit(data)"
                    >
                      cancel
                    </el-button>
                  </template>
                  <span v-else>
                    <span v-if="data.label === 'Slides'"> <el-tag type="success">{{ data.label }}</el-tag></span>
                    <span v-else-if="data.label === 'Slide'"> <el-tag type="warning">{{ data.label }}</el-tag></span>
                    <span v-else> <el-tag type="info">{{ data.label }}</el-tag></span>
                  </span>
                </span>

                <span style="align-items: end">
                  <el-button
                    v-if="data.edit&&!data.is_slide&&!data.is_slides&&node.level===3"
                    icon="el-icon-circle-check-outline"
                    @click="confirmEdit(data)"
                    type="text"
                    class="comfirm_button"
                  >
                    Ok
                  </el-button>
                  <el-button
                    v-else-if="!data.is_slide&&!data.is_slides&&node.level===3"
                    type="text"
                    icon="el-icon-edit"
                    @click="f(data)"
                  >
                    Edit
                  </el-button>

                  <el-button
                    v-if="node.level===2||node.level===1"
                    type="text"
                    @click="() => append(node)"
                  >
                    Append
                  </el-button>
                  <el-button
                    v-if="node.level!==1"
                    type="text"
                    class="comfirm_button"
                    @click="() => remove(node, data)"
                  >
                    Delete
                  </el-button>
                </span>
              </span>
        </el-tree>
      </div>
    </div>
    <t-button type="primary" @click="createPPT">创建PPT</t-button>
  </el-card>
</template>
<script>

import {genOutline, gen_ppt} from "@/api/gpt";
import {Loading} from "element-ui";

let id = 1000
let tab_id = 0
export default {
  data() {
    const render_data = []
    let source_xml_data = `
<slides>
    <section class='cover'>
       <p>我为什么玩明日方舟</p>
       <p>汇报人：dhf</p>
    </section>
    <section class='catalog'>
        <p>目录</p>
        <p>1. 游戏背景</p>
        <p>2. 独特的人设</p>
        <p>3. 挑战性的玩法</p>
        <p>4. 社区互动</p>
        <p>5. 结语</p>
    </section>
    <section class='content'>
        <p>游戏背景</p>
        <p>内容概要：介绍明日方舟的世界观，讲述感染者与感染病毒的斗争，以及玩家在游戏中扮演的医疗救援人员的角色。</p>
    </section>
    <section class='content'>
        <p>独特的人设</p>
        <p>内容概要：分享明日方舟各种不同种族，不同职业的角色形象，以及他们的个性、故事和能力等。</p>
    </section>
    <section class='content'>
        <p>挑战性的玩法</p>
        <p>内容概要：介绍明日方舟各种游戏模式和关卡，以及它们的难度和挑战性，包括如何提高玩家的战斗技巧和策略。</p>
    </section>
    <section class='content'>
        <p>社区互动</p>
        <p>内容概要：讲述明日方舟社区的特点和优势，包括玩家之间的互动、交流和创作，以及开发团队与玩家之间的沟通和回应。</p>
    </section>
    <section class='content'>
        <p>结语</p>
        <p>内容概要：总结明日方舟的优点和吸引力，以及我个人对它的喜爱和热爱，鼓励更多的人加入明日方舟的世界。</p>
    </section>
</slides>
`
    return {
      render_data,
      data: JSON.parse(JSON.stringify(render_data)),
      source_xml_data,
      topic: '',
      sponsor: '',
      loading: true,
      outline_id:0
    }
  },
  created() {
    // const is_debug = false
    // if(is_debug){
    //   this.render_data = this.update_source_xml_data_to_render_data(this.source_xml_data)
    //   this.dfs(this.render_data)
    //   console.log(JSON.stringify(this.render_data, ' ', 2))
    //
    //   this.loading = false
    //
    //   this.data = this.render_data
    //
    //   const d = this.convert_tree_to_xml(this.render_data)
    //
    //   console.log(d)
    //
    //   this.outline_id = 2
    //
    //   return
    // }

    // 获取路由参数
    this.topic = this.$route.query.topic
    this.sponsor = this.$route.query.sponsor
    // 发送请求
    genOutline({
      'topic': this.topic, 'sponsor': this.sponsor
    }).then(res => {
      // 将\n替换为换行
      console.log(res)
      this.source_xml_data = res.data.Outline.replace(/\\n/g, '\n')
      this.outline_id = res.data.Id
      console.log(this.source_xml_data)

      console.log(JSON.stringify(this.data, ' ', 2))

      this.render_data = this.update_source_xml_data_to_render_data(this.source_xml_data)
      this.dfs(this.render_data)
      console.log(JSON.stringify(this.render_data, ' ', 2))

      this.data = this.render_data

      this.loading = false
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    createPPT()
    {
      const loadingInstance = Loading.service()
      gen_ppt({
        'outline_id': parseInt(this.outline_id),
        'template_id': parseInt(this.$route.query.template_id),
        'project_id': parseInt(this.$route.query.project_id),
        'file_name': this.$route.query.file_name,
      }).then(res => {
        loadingInstance.close()
        console.log(res)
        this.$router.push({
          path: '/pptist/index',
          query: {
            project_id: this.$route.query.project_id,
            file_name: this.$route.query.file_name,
          }
        })
      }).catch(err => {
        loadingInstance.close()
        console.log(err)
      })
    },
    convert_tree_to_xml (tree_data){
      // 遍历data，获取label，递归遍历children
      const root_slides_name = 'slides'
      const slide_name = 'section'
      const top_dom = document.createElement(root_slides_name)
      console.log(tree_data[0])
      const data = tree_data[0]
      for(var i=0;i<data.children.length;i++){
        // 在根节点下创建子节点
        const child = document.createElement(slide_name)

        for(var j =0 ;j<data.children[i].children.length;j++) {
          const my_Element_dom = document.createElement('p')
          my_Element_dom.innerTextnerHTML = data.children[i].children[j].label
          child.appendChild(my_Element_dom)
        }

        top_dom.appendChild(child)
      }
      console.log(top_dom.outerHTML)
      return top_dom.outerHTML
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === 'Level two 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('Level three 3-1-1') === -1
    },
    dfs(node) {
      if (!Array.isArray(node)) {
        this.$set(node, 'edit', false)
        this.$set(node, 'original_label', node.label)
        let is_slides = false
        let is_slide = false
        if (node.label === 'Slides') {
          is_slides = true
        }
        if (node.label === 'Slide') {
          is_slide = true
        }
        this.$set(node, 'is_slides', is_slides)
        this.$set(node, 'is_slide', is_slide)
        // node.edit = false
        // node.original_label = node.label
        if ('children' in node) {
          this.dfs(node.children)
        } else {
          return
        }
      } else {
        for (var i = 0; i < node.length; i++) {
          this.dfs(node[i])
        }
      }
    },
    f(data) {
      console.log(data)
      data.edit = !data.edit
      // this.$set(data, 'edit', !data.edit)
    },
    append(node) {
      console.log(node)
      let name = ''
      if (node.level === 1) {
        name = 'Slide'
      } else {
        name = 'New Item'
      }
      const newChild = {id: id++, label: name, 'edit': false, 'original_label': 'new item', children: []}
      if (!node.data.children) {
        this.$set(node.data, 'children', [])
      }
      node.data.children.push(newChild)
    },
    remove(node, data) {
      // console.log((node))
      // console.log(data)
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      // console.log(children)
      // console.log(parent)
      if (children.length === 1 && parent.level === 0) {
        this.$message({
          message: '无法删除根节点！',
          type: 'failure'
        })
        return
      }
      children.splice(index, 1)
    },
    cancelEdit(data) {
      data.label = data.original_label
      data.edit = false
      this.$message({
        message: '操作取消！',
        type: 'warning'
      })
    },
    confirmEdit(data) {
      data.edit = false
      data.original_label = data.label
      this.$message({
        message: '编辑结束！',
        type: 'success'
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    update_source_xml_data_to_render_data(xml) {
      // 功能：将xml转换为前端能渲染的json
      // 参数：gpt返回的xml大纲
      // 说明：
      // 返回值：前端能渲染的json

      const parser = new DOMParser()

      const top_dom = parser.parseFromString(xml, 'application/xml')

      if (top_dom.documentElement.nodeName === 'parsererror') {
        // console.error('XML 解析失败 when update_xml_to_dom_to_slide')
      } else {
        // console.log('XML 解析成功\n', xml)

        const render_data = []
        render_data.push({
          id: id++,
          label: 'Slides',
          children: []
        })

        top_dom.querySelectorAll('section').forEach((slide) => {
            // console.log(slide)

            render_data[0].children.push({
              id: id++,
              label: 'Slide',
              children: []
            })

            // 注意：这是遍历直接子级元素
            let child = slide.firstChild
            while (child) {
              if (child.nodeType === Node.ELEMENT_NODE) {
                // console.log(child.nodeType, child.textContent, child instanceof Element)
                console.log(child.textContent)

                render_data[0].children[render_data[0].children.length - 1].children.push({
                  id: id++,
                  label: child.textContent,
                  children: []
                })
              }
              if (child?.nextSibling) {
                child = child.nextSibling
              } else {
                break
              }
            }
          }
        )
        return render_data
      }
    }
  }
}
</script>
<style>
.outline-card {
  width: 1500px;
  margin: 0 auto;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.delete_button {
  background-color: white;
  color: red;
}

.confirm_button {
  background-color: white;
  color: green;
}
</style>
