<template>
  <div id="chat">
    <p class="progress">
      <el-progress :percentage="percentage" v-if="percentage"></el-progress>
    </p>
    <p class="button">
      <el-button type="info" :loading="disabled" @click="connection" :disabled="disabled">{{msg}}</el-button>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      percentage: 0,
      timeId: null,
      disabled:false,
      msg:"加入聊天室"
    };
  },
  created() {
    //   console.log(this.$router.options.routes)
  },
  methods: {
    connection() {
      this.disabled = true
      clearInterval(this.timeId);
      this.timeId = setInterval(() => {
        this.percentage += 20;
        if (this.percentage === 100) {
          clearInterval(this.timeId);
          if(this.$store.state.user){
            this.$message({
              message: '欢迎进入聊天室',
              type: 'success'
            })
          }else{
            window.localStorage.getItem("userInfo")||window.localStorage.setItem("userInfo",JSON.stringify({
              username:`游客${Date.now()}`,
              role:1,
              avatar:"../../../static/images/icon.jpg"
            }))
            this.$message({
              message: '检测到你没有登录，将以游客方式进入聊天室！',
              type: 'warning'
            })
          }
          this.$router.replace({
            name:"chatroom"
          })
        }
      }, 300);
    }
  }
};
</script>
<style lang="less" scoped>
#chat {
  position: relative;
  width: 100%;
  height: 400px;
  background-color: rgba(255, 255, 255, 0.6);
    border-top: 1px solid transparent;
  .progress{
    width:80%;
    margin:40px auto;
  }
  .button {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 100px;
    height: 40px;
  }
}
</style>