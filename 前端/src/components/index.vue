<template>
  <div id="index" class="conter wrap">
    <div class="left_content">
      <div class="top">
        <span class="topp" ref="top"></span>
        <span class="rightv" ref="right"></span>
        <span class="bottom" ref="bottom"></span>
        <span class="left" ref="left"></span>
        <div class="banner" ref="banner">
          <el-carousel interval="4000">
            <el-carousel-item v-for="(item,index) in banner" :key="index">
              <div class="container">
                <div class="pic">
                  <p></p>
                </div>
                <img v-lazy="item" width="100%" height="100%" alt>
                <div class="cover">
                  <img v-lazy="`../../static/images/${index}.jpg`" width="100%" height="100%" alt>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="person none" v-if="person" ref="person">
          <div class="box" title="系统管理员">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <img src="../../static/images/admin.png" class="img" title="系统管理员" alt>
          <p>
            <img src="../../static/images/adminpic.png" alt>
            <span>我有罪</span>
          </p>
          <div class="button">
            <el-button type="primary" icon="iconfont icon-QQ" circle title="QQ私聊" @click="qq"></el-button>
            <el-button type="info" icon="el-icon-location" circle disabled></el-button>
            <el-button type="warning" icon="el-icon-star-off" circle title="收藏" @click="collect"></el-button>
            <el-button type="success" icon="iconfont icon-weixin" class="weixin" circle title="微信"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="remove" title="删除"></el-button>
          </div>
        </div>
      </div>
      <div class="option">
        <div class="layui-tab layui-tab-brief" lay-filter="docDemoTabBrief">
          <ul class="layui-tab-title">
            <li :class=" !isIf ?'layui-this' : ''" ref="article">文章列表☷</li>
            <li class="layui-this" v-if="isIf">音乐舞动♬</li>
            <li @click="show">图片展示※</li>
            <li>个人展示♒</li>
          </ul>
          <div class="layui-tab-content clearfix">
            <div class="layui-tab-item clearfix" :class=" !isIf ?'layui-show' : ''">
              <at-nv></at-nv>
            </div>
            <div class="layui-tab-item layui-show" v-if="isIf">
              <ct-nv></ct-nv>
            </div>
            <div class="layui-tab-item clearfix">
              <ul>
                <li v-for="(item,index) in image" :key="index">
                  <img v-lazy="item" alt>
                  <div class="description">简介:这是一张后台传过来的图片；来源：http://www.wby1988xyz;大小：xxxx。</div>
                </li>
              </ul>
              <load-more :status="status" @more="more"></load-more>
            </div>
            <div class="layui-tab-item">没有写入数据</div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <right-nv></right-nv>
    </div>
  </div>
</template>

<script>
import linear from "../tools/linear-speed.js";
import loadMore from "@/components/other/load-more.vue";
import favorite from "../tools/favorite.js";
const rightNv = () => ({
  component: import("@/components/other/right"),
  delay: 200,
  timeout: 3000
});
export default {
  data() {
    return {
      banner: [],
      images: [],
      image: [],
      arrNew: [],
      num: 0,
      // rervese: true,
      status: "more",
      limite: 4,
      isIf: true,
      person: true
    };
  },
  components: {
    loadMore,
    rightNv
  },
  created() {
    this.getBanner();
    this.resize();
    window.addEventListener("resize", () => this.resize());
  },
  mounted() {
    setTimeout(() => {
      this.$refs.article.click();
      document.documentElement.scrollTop = 0;
    }, 150000);
    layui.use("flow", function() {
      var flow = layui.flow;
    });
    window.addEventListener("scroll", () => {
      let dis_x = document.documentElement.scrollTop;
      let dis_y = document.documentElement.clientHeight;
      let totalHeight = document.documentElement.offsetHeight;
      // 滚动条到底部距离
      let bottom = totalHeight - dis_x - dis_y < 300;
      this.getMore(bottom);
    });
    linear({
      left: this.$refs.left,
      right: this.$refs.right,
      top: this.$refs.top,
      bottom: this.$refs.bottom,
      scale: "100%",
      scalex: "0%"
    });
  },
  methods: {
    qq() {
      window.open(
        "http://wpa.qq.com/msgrd?v=3&uin=1426909138&site=qq&menu=yes"
      );
    },
    collect() {
      favorite();
    },
    remove() {
      this.person = false;
      $(this.$refs.banner).animate(
        {
          width: "100%"
        },
        1000,
        () => {
          console.log("执行结束");
        }
      );
    },
    getBanner() {
      // 发送请求轮播图数据
      this.$ajax.get(this.$api.banner).then(res => {
        this.banner = res.data;
      });
    },
    resize() {
      let screen = window.screen < 500;
      let width = window.innerWidth < 500;
      if (screen || width) {
        this.isIf = false;
      } else {
        this.isIf = true;
      }
    },
    more(msg) {
      this.getMore(true);
    },
    getMore(bottom) {
      if (this.num === 8) this.status = "";
      if (this.status === "loading" || this.status === "" || !bottom) return;
      this.status = "loading";
      setTimeout(() => {
        this.image = this.image.concat(
          this.images.slice(
            12 + this.num * this.limite,
            12 + (this.num + 1) * this.limite
          )
        );
        this.num++;
        this.status = "more";
      }, 1000);
    },
    show() {
      // 请求图片
      let that = this;
      this.$store.state.process = true;
      this.$ajax({
        url: this.$api.image,
        methode: "GET",
        onDownloadProgress(e) {
          that.$store.state.scale = e.loaded / e.total;
          if (e.loaded / e.total === 1) {
            setTimeout(() => {
              that.$store.state.process = false;
            }, 3000);
          }
        }
      }).then(res => {
        this.images = res.data;
        this.images.sort((a, b) => Math.random() - 0.5);
        this.image = this.images.slice(0, 12);
        this.num = 0;
        this.status = "more";
      });
    }
  }
};
</script>
<style scoped lang="less">
#index {
  position: relative;
  width: 100%;
  min-height: 750px;
  .right {
    position: absolute;
    right: 0;
    top: 0;
    width: 24%;
    height: auto;
  }
  .left_content {
    background-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 2px #aaa;
    border-radius: 5px;
    width: 75%;
    .top {
      width: 100%;
      display: flex;
      height: 100%;
      position: relative;
      overflow: hidden;
      padding: 4px;
      transform-style: preserve-3d;
      -webkit-animation: 800;
      perspective-origin: center center;
      .topp {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 0;
        height: 1px;
        background-color: #67c23a;
      }
      .rightv {
        position: absolute;
        right: 0px;
        top: 0px;
        width: 1px;
        height: 0;
        background-color: #67c23a;
      }
      .bottom {
        position: absolute;
        right: 0px;
        bottom: 0px;
        width: 0;
        height: 1px;
        background-color: #67c23a;
      }
      .left {
        position: absolute;
        left: 0px;
        bottom: 0px;
        width: 1px;
        height: 0;
        background-color: #67c23a;
      }
      .banner {
        overflow: hidden;
        width: 65%;
        height: 100%;
        box-sizing: border-box;
        &:hover .container {
          transform: rotateY(90deg);
        }
        .container {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          -webkit-animation: 800;
          perspective-origin: center center;
          cursor: pointer;
          transition: 1s;
          .pic {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            width: 1%;
            height: 1%;
            margin: auto;
            color: #ddd;
            background-color: rgba(255, 255, 255, 0.2);
            animation: pic 6s linear infinite alternate;
            z-index: 1000;
          }
          img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
          .cover {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            transition: 1s;
            transform: rotateY(270deg);
            background-color: rgba(123, 34, 190, 0.2);
          }
        }
      }
      .person {
        position: relative;
        width: 35%;
        height: 300px;
        background-color: rgba(123, 34, 190, 0.2);
        .box {
          position: absolute;
          left: 50%;
          top: 15px;
          margin-left: -71px;
          width: 142px;
          height: 142px;
          background-color: rgba(123, 34, 190, 0.2);
          transition: 1s;
          border-radius: 50%;
          z-index: 1000;
          animation: box 4s linear infinite alternate;
          overflow: hidden;
          cursor: pointer;
          div {
            float: left;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.9);
            transform: scale(0.5);
            margin: 11px;
          }
          &:hover {
            animation-play-state: paused;
          }
        }
        @keyframes box {
          from {
            transform: scale(1.15) rotateZ(-270deg);
          }
          to {
            transform: scale(0.85) rotateZ(270deg);
          }
        }
        .img {
          width: 142px;
          height: 142px;
          display: block;
          border-radius: 50%;
          margin: 15px auto;
          transition: 1s;
          cursor: pointer;
          animation: img 4s linear infinite alternate;
        }
        p {
          text-align: center;
          font-size: 16px;
          letter-spacing: 5px;
          font-family: "宋体";
          color: #555;
          img {
            width: 25px;
            height: 25px;
            vertical-align: middle;
          }
          span {
            line-height: 25px;
            vertical-align: middle;
            cursor: text;
          }
        }
        .button {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          width: 100%;
          height: 35%;
          .weixin {
            position: relative;
            &:hover::after {
              display: block;
            }
          }
          .weixin::after {
            content: "";
            width: 80px;
            height: 80px;
            position: absolute;
            z-index: 1100;
            right: -15px;
            bottom: 50px;
            box-shadow: 0 0 2px #333;
            display: none;
            background-color: #fff;
            background: url("../../static/images/weixin.png") no-repeat left
              top/cover;
          }
        }
      }
    }
    .option {
      width: 100%;
      min-height: 700px;
      .layui-tab-item {
        width: 100%;
        ul {
          display: flex;
          justify-content: space-around;
          align-content: center;
          flex-wrap: wrap;
          width: 100%;
          li {
            width: 24%;
            margin: 5px 0;
            position: relative;
            cursor: pointer;
            overflow: hidden;
            &:hover .description {
              height: 50%;
            }
            img {
              width: 100%;
              height: 180px;
            }
            .description {
              position: absolute;
              left: 0;
              bottom: -10px;
              background-color: rgba(0, 0, 0, 0.6);
              padding: 5px 2px;
              width: 100%;
              height: 0;
              white-space: normal;
              overflow: hidden;
              transition: 1s;
              color: #fff;
              text-indent: 2em;
            }
          }
        }
      }
    }
  }
}
</style>

