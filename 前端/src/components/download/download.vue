<template>
  <div id="download" class="wrap">
    <el-row>
      <el-button type="primary" @click="downLoad">下载安卓app</el-button>
    </el-row>
    <div class="wrap">
      <!-- <img src="../../../static/images/apk.jpg" alt> -->
      <el-carousel style="width:275px;height:480px;" indicator-position="outside">
        <el-carousel-item
          v-for="(item,index) in arr"
          :key="index"
          style="width:275px;height:480px;"
        >
          <img :src="item" alt width="275" height="480">
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      arr: [
        "../../../static/images/apk.jpg",
        "../../../static/images/apk1.jpg",
        "../../../static/images/apk2.jpg"
      ]
    };
  },
  computed: {
    role() {
      return this.$store.state.role;
    }
  },
  created() {
    // if (!this.$store.state.user) {
    //   alert("检测到你没有登录！");
    //   this.$router.push({
    //     name: "login"
    //   });
    //   return;
    // }
  },
  methods: {
    downLoad() {
      let val = prompt("请输入6位数字密码！");
      if (val * 1 !== 1688943) return alert("密码错误！");
      this.$store.state.process = true;
      this.$ajax({
        url: "/downLoad",
        method: "GET",
        onDownloadProgress: e => {
          this.$store.state.scale = e.loaded / e.total;
          if (e.loaded / e.total === 1) {
            setTimeout(() => {
              this.$store.state.process = false;
            }, 1000);
          }
        }
      }).then(res => {
        const blob = new Blob([res.data]);
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = `${Date.now()}.apk`;
        link.click();
      });
    }
  }
};
</script>
<style scoped lang="less">
#download {
  position: relative;
  width: 75%;
  height: 760px;
  margin: 15px 10px;
  .wrap {
    width: 275px;
    height: 480px;
    border-radius: 10px;
    border: 1px solid #ccc;
    position: absolute;
    overflow: hidden;
    left: 50%;
    top: 50%;
    margin-left: -187px;
    margin-top: -330px;
    transition: 0.8s;
    &:hover {
      transform: scale(1.1);
    }
    img {
      cursor: pointer;
    }
  }
}
</style>