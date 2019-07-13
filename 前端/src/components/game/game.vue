<template>
  <div id="game" class="wrap">
    <ul>
      <li v-for="(item,index) in arr " :key="index" @click="change(index)">{{item}}</li>
    </ul>
    <div class="content" v-if="0 === bool">
      <snake-nv></snake-nv>
    </div>
    <div class="content" v-if="1 === bool">

    </div>
    <div class="content" v-if="2 === bool">

    </div>
    <div class="content" v-if="3 === bool">

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      bool: 0,
      arr: ["贪吃蛇", "扫雷", "俄罗斯方块", "飞机大战"]
    };
  },
  methods: {
    change(index) {
      this.bool = index;
    }
  }
};
</script>
<style lang="less" scoped>
#game {
  // margin: 15px 10px;
  width: 100%;
  height: 760px;
  position: relative;
  ul {
    min-height: 760px;
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
    top: 30px;
    width: 92%;
    height: 100%;
  }
}
</style>