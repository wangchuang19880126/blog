<template>
  <div id="rightnv">
    <el-dropdown>
      <span class="el-dropdown-link">
        <i class="iconfont icon-daohang"></i>
        垂直导航
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <router-link :to="{name:'index',params:{
            title:'首页'
          }}">网站首页</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link :to="{name:'article',params:{
            title:'文章发表'
          }}">文章发表</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link :to="{name:'canvas',params:{
            title:'绘制canvas'
          }}">canvas绘制</router-link>
        </el-dropdown-item>
        <!-- <el-dropdown-item>
          <router-link :to="{name:'personal'}">案例展示</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link :to="{name:'game'}">JS小游戏</router-link>
        </el-dropdown-item>
        <el-dropdown-item disabled>
          <router-link :to="{name:'game'}">app下载</router-link>
        </el-dropdown-item> -->
        <el-dropdown-item v-if="active">
          <router-link :to="{name:'login',params:{
            title:'账号登录'
          }}">登录 /注册</router-link>
        </el-dropdown-item>
        <el-dropdown-item v-if="!active">
          <router-link :to="{name:'admin',params:{
            title:'个人中心'
          }}">
            <span class="iconfont icon-app_icons--">个人中心</span>
          </router-link>
        </el-dropdown-item>
        <el-dropdown-item v-if="!active">
          <a href="javascript:;" @click="loginOut">
            退出登录
          </a>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    active() {
      return this.$store.state.active;
    }
  },
  methods: {
    loginOut() {
      this.$store.commit("changeLogin", true);
      window.localStorage.removeItem("state");
      this.$ajax.get("/loginOut").then(res => res.data);
      this.$store.commit("increment");
      this.$router.push({
        name: "index",
        params: {
          title: "首页"
        }
      });
    }
  }
};
</script>
<style lang="less" >
#rightnv {
  position: absolute;
  right: 7%;
  top: 20px;
  width: 100px;
  height: 20px;
  z-index: 20000;
  display: none;
  font-weight: 100;
  .el-dropdown-link {
    cursor: pointer;
    color:#fff;
    font-size: 14px;
    width: 100%;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
}
</style>