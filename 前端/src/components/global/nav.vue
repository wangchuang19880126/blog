<template>
  <div>
    <ul class="nav" ref="nav">
      <a href="javascript:void(0)" @click="up($event)" title="一直到顶部">
        <li class="iconfont icon-xiangshang"></li>
      </a>
      <!-- <a href="http://wpa.qq.com/msgrd?v=3&uin=1426909138&site=qq&menu=yes" target="_blank">
        <li class="iconfont icon-QQ"></li>
      </a>-->
      <!-- <a href="javascript:void(0)">
        <li class="iconfont icon-lianxidianhua--"></li>
      </a>
      <a href="javascript:void(0)">
        <li class="iconfont icon-weixin"></li>
      </a>
      <a href="javascript:void(0)">
        <li class="iconfont icon-xinfangjubao"></li>
      </a>-->
      <a href="javascript:void(0)" @click="down($event)" title="一直到底部">
        <li class="iconfont icon-xiangxia"></li>
      </a>
    </ul>
  </div>
</template>
<script>
import animation from "../../tools/linear.js";
export default {
  data() {
    return {
      dis_x: null,
      dis_y: null
    };
  },
  created() {
    let fn = this.throttle(200,this.scrolling)
    // 监听滚动事件 开启侧边导航
    window.addEventListener("scroll", () => fn());
    window.addEventListener("resize", () => fn())
  },
  methods: {
    // 防抖
    throttle(time, cb) {
      let timer = null;
      let that = this;
      return function () {
        let arg = Array.prototype.slice.call(arguments);
        clearTimeout(timer);
        timer = setTimeout(() => {
          cb && cb.apply(that, arg);
        }, time);
      };
    },
    scrolling() {
      let scrolling = document.documentElement.scrollTop >= 200;
      let msg = $("#app").width() / 2 - $("#app .main").width() / 2 > 50;
      animation(
        this.$refs.nav,
        {
          marginLeft: scrolling
            ? $("#app .main").width() / 2 + (msg ? 10 : -45)
            : 1000
        },
        1000
      );
    },
    // 侧边导航点击向上
    up() {
      document.documentElement.scrollTop -= 100;
      this.dis_x = requestAnimationFrame(this.up);
      if (document.documentElement.scrollTop <= 0) {
        cancelAnimationFrame(this.dis_x);
      }
    },
    // 侧边导航点击向下
    down() {
      document.documentElement.scrollTop += 100;
      this.dis_y = requestAnimationFrame(this.down);
      if (
        document.documentElement.scrollTop + window.innerHeight >=
        app.offsetHeight
      ) {
        cancelAnimationFrame(this.dis_y);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.nav {
  position: fixed;
  left: 50%;
  margin-left: 1000px;
  top: 50%;
  margin-top: -40px;
  z-index: 1000;
  a {
    &:nth-child(1),
    &:nth-child(2) {
      color: #999;
    }
    li {
      width: 40px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
      border-radius: 50%;
      margin: 10px 0;
      background-color: rgba(255, 255, 255, 1);
      box-shadow: 0 0 2px #aaa;
      transition: 1s;
    }
  }
  &:hover li {
    color: #fff;
    background-color: #67c23a;
    border-radius: 0%;
  }
}
</style>