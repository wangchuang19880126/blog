<template>
  <div id="personal" class="wrap">
    <ul>
      <li v-for="(item,index) in arr " :key="index" @click="change(index)">{{item}}</li>
    </ul>
    <div class="content" v-if="0 === bool">
      <th-nv></th-nv>
    </div>
    <div class="content" v-if="1 === bool">
      <cl-nv></cl-nv>
    </div>
    <div class="content" v-if="2 === bool">
      <cd-nv></cd-nv>
    </div>
    <div class="content" v-if="3 === bool">
      <fly-nv></fly-nv>
    </div>
    <div class="content" v-if="4 === bool">
      <test-nv></test-nv>
    </div>
  </div>
</template>
<script>
// import thNv from './th3d.vue'
const thNv = () => ({
  component: import('./th3d.vue'),
  delay: 200,
  timeout: 3000
})
const clNv = () => ({
  component: import('./clNv.vue'),
  delay: 200,
  timeout: 3000
})
// import clNv from './clNv.vue'
const cdNv = () => ({
  component: import('./card.vue'),
  delay: 200,
  timeout: 3000
})
// import cdNv from './card.vue'
const flyNv = () => ({
  component: import('./fly.vue'),
  delay: 200,
  timeout: 3000
})
// import flyNv from './fly.vue'
const testNv = () => ({
  component: import('./test.vue'),
  delay: 200,
  timeout: 3000
})
// import testNv from './test.vue'
export default {
  data() {
    return {
      bool: 0,
      arr: ["3d旋转", "时钟", "翻牌", "图片飞入", "测量图片"]
    };
  },
  methods: {
    change(index) {
      this.bool = index;
    }
  },
  mounted(){
  },
  components:{
    thNv,
    clNv,
    cdNv,
    flyNv,
    testNv
  },
  destroyed() {
  },
};
</script>
<style lang="less" scoped>
#personal {
  // margin:15px 10px;
  width: 100%;
  height: 760px;
  position: relative;
  ul {
    // min-height: 760px;
    background-color: #eee;
    li {
      float: left;
      margin: 5px 0;
      width: 15%;
      height: 25px;
      text-align: center;
      line-height: 25px;
      box-shadow: 0 0 2px skyblue;
      cursor: pointer;
    }
  }
  .content {
    position: absolute;
    left: 0;
    top: 34px;
    width: 100%;
    height: 95%;
  }
}
</style>