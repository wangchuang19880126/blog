<template>
  <div id="push" v-if="message.content">
    <!-- <div> -->
    <p>
      <i class="iconfont icon-icon-test"></i>
      全频道广播：{{message.content}}
    </p>
    <p>你的ip地址：{{message.ip}}</p>
    <!-- </div> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: "",
      ws: null
    };
  },
  created() {
    this.createPush();
    this.ws.addEventListener("beforeunload", () => this.ws.close());
  },
  beforeDestroy() {
    this.ws.close();
  },
  methods: {
    createPush() {
      this.ws = new WebSocket(this.$api.push);
      this.ws.addEventListener("open", e => {
        console.log("连接websocket成功");
        this.ws.send("你好！");
      });
      this.ws.addEventListener("message", msg => {
        console.log(1);
        let time = null;
        this.message = "";
        clearInterval(time);
        time = setTimeout(() => {
          this.message = JSON.parse(msg.data);
        }, 500);
      });
      this.ws.addEventListener("error", error => {
        console.log(error);
      });
    }
  }
};
</script>
<style lang="less" scoped>
#push {
  font-family: "宋体";
  position: fixed;
  top: 30%;
  left: 100%;
  width: 300px;
  padding: 5px;
  white-space: normal;
  background-color: #f56c6c;
  z-index: 1000;
  color: #fff;
  font-size: 16px;
  animation: push 2.5s linear;
  animation-fill-mode: forwards;
  border-radius: 5px;
  p {
    margin: 10px 0;
  }
  p:nth-child(1) {
    text-align: left;
    font-size: 16px;
  }
  p:nth-child(2) {
    text-align: center;
    font-size: 14px;
    text-indent: 25px;
  }
}
@keyframes push {
  from {
    transform: translate(0);
  }
  to {
    transform: translate(-120%);
  }
}
</style>