<template>
  <div>
    <!-- <el-button plain @click="open">可自动关闭</el-button> -->
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.open3();
    }, 1);
  },
  methods: {
    open3() {
      this.$notify({
        title: "系统消息",
        message: "热烈欢迎帅哥美女光临本站！",
        // position: 'top-left',
        // type: "success",
        offset:150,
        iconClass:"el-icon-menu"
      });
    }
  }
};
</script>