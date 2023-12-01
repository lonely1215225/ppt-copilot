<template>
  <div>
    <div @mouseenter="isEditing = true" @mouseleave="isEditing = false">
      <template v-if="!isEditing">
        <span>{{ text }}</span>
        <button @click="editMode">编辑</button>
      </template>
      <template v-else>
        <el-input v-model="inputText" placeholder="请输入内容"></el-input>
        <button @click="saveChanges">保存</button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isEditing: false,
      text: '示例文本',
      inputText: ''
    }
  },
  methods: {
    editMode() {
      this.inputText = this.text;
      this.isEditing = true;
    },
    saveChanges() {
      this.text = this.inputText;
      this.isEditing = false;
      this.$emit('content-updated', this.text); // 触发自定义事件并传递内容
    }
  }
}
</script>
