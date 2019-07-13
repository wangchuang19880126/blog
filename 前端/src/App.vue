<template>
  <div id="app" ref="app">
    <bg/>
    <hd-nv></hd-nv>
    <message/>
    <push-nv/>
    <div class="conter">
      <div class="main conter">
        <transition name="el-zoom-in-center">
          <!-- <el-collapse-transition> -->
          <!-- <keep-alive> -->
            <router-view></router-view>
          <!-- </keep-alive> -->
          <!-- </el-collapse-transition> -->
        </transition>
      </div>
    </div>
    <nav-hd></nav-hd>
    <ft-nv></ft-nv>
  </div>
</template>
<script>
import vm from "./components/global/vm.js";
const message = () => ({
  component: import("./components/other/message"),
  delay: 200,
  timeout: 3000
});
const navHd = () => ({
  component: import("./components/global/nav.vue"),
  delay: 200,
  timeout: 3000
});
const pushNv = () => ({
  component: import("./components/chat/push.vue"),
  delay: 200,
  timeout: 3000
});
export default {
  name: "App",
  data() {
    return {
      bool: false,
      isShow: true,
      right: true,
      content: []
    };
  },
  computed: {
    state() {
      return this.$store.state;
    }
  },
  components: {
    message,
    navHd,
    pushNv
  },
  watch: {
    $route() {
      // 监听路由变化
      document.documentElement.scrollTop = 0;
    },
    state: {
      // 监听vuex变化
      handler() {
        let obj = this.$store.state;
        window.localStorage.setItem("state", JSON.stringify(obj));
      },
      deep: true
    }
  },
  created() {

    let obj = JSON.parse(window.localStorage.getItem("state")) || [];
    for (let key in this.$store.state) {
      this.$store.state[key] = obj[key];
    }
    this.$ajax({
      method: "GET",
      url: "/",
      withCredentials: true
    }).then(res => {
      if (!res.data.uid) {
        //cookie过期
        this.$store.commit("changeLogin", true);
        this.$store.commit("increment");
      } else {
        // console.log(res.data)
        // this.$store.commit("increment", res.data);
        this.$store.commit("changeLogin", false);
      }
    });
  }
};
</script>

<style scoped lang="less">
#app {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 255, 0.09);
  .main {
    position: relative;
    width: 90%;
    margin-top: 65px;
    min-height: 573px;
    border-radius: 5px;
  }
}
</style>
