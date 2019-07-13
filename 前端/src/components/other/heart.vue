<template>
  <div>
    <span
      class="heart"
      :style="`left:${item.style.left}px;top:${item.style.top}px`"
      v-for="(item,index) in content"
      :key="index"
    >{{item.text}}</span>
  </div>
</template>
<script>
export default {
  data() {
    this.time = null;
  },
  props: ["content"],
  mounted() {
  },
};
</script>
<style lang="less" scoped>
.heart {
  position: fixed;
  color: red;
  font-size: 20px;
  z-index: 10000;
  transition: 1s;
}
</style>