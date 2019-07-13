<template>
  <div id="canvas" class="wrap">
    <p class="clearfix">
      <span v-for="(item,index) in canvasArr" :key="index" @click="showCanvas(index)">{{item}}</span>
    </p>
    <div class="show" v-if="idx === 0">
      <fl-nv></fl-nv>
    </div>
    <div class="show" v-if="idx === 1">
      <geyser/>
    </div>
    <div class="show" v-if="idx === 2">
      <flower/>
    </div>
    <div class="show" v-if="idx === 3">
      <rain/>
    </div>
  </div>
</template>
<script>
const flNv = () => ({
  component:import("./flower.vue"),
  delay:200,
  timeout:3000,
})
const flower = () => ({
  component:import("./flower-blash.vue"),
  delay:200,
  timeout:3000,
})
const geyser = () => ({
  component:import("./geyser.vue"),
  delay:200,
  timeout:3000,
})
const rain = () => ({
  component:import("./rain.vue"),
  delay:200,
  timeout:3000,
})
export default {
  data() {
    return {
      canvasArr: ["花卉爆炸", "喷泉", "花卉", "雷雨"],
      idx: 0
    };
  },
  components: {
    flNv,
    flower,
    geyser,
    rain
  },
  methods: {
    showCanvas(index) {
      this.idx = index;
    }
  },
};
</script>
<style lang="less" scope>
#canvas {
  width: 100%;
  background-color: #ddd;
  height: 760px;
  overflow: hidden;
  // margin:15px 10px;
  p {
    width: 100%;
    text-indent: 2em;
    background-color: #f60;
    height: 25px;
    span {
      float: left;
      width: 15%;
      height: 20px;
      line-height: 20px;
      padding: 4px;
      margin: 0 10px;
      color: #fff;
      cursor: pointer;
    }
  }
  .show{
    width:100%;
    height:760px !important;
  }
}
</style>