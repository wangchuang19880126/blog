<template>
  <div id="notice">
    <div class="notice">
      <p>
        <i class="iconfont icon-gonggao"></i>
        建站日志
      </p>
      <div class="ip">
        <span class="total">
          <i class="iconfont icon-shuliang1"></i>
          今日访问量:{{visitor}}
        </span>
        <span class="visitor" @mouseenter="look" @mouseleave="close">
          <i class="iconfont icon-ip"></i>
          查看访客ip↑
          <i
            :class="!isIp? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
            style="margin-left:10px"
          ></i>
          <div class="detail" v-if="isIp" @mouseenter="look" @mouseleave="close">
            <ul>
              <li v-for="(item,index) in address" :key="index">
                <span :class="{red:index === 0}">{{item}}</span>
              </li>
            </ul>
          </div>
        </span>
      </div>
      <ul class="content">
        <div class="step">
          <el-steps
            direction="vertical"
            :active="8"
            style="cursor:pointer"
            space="80px"
            finish-status="info"
          >
            <el-step
              :title="item.time"
              v-for="(item,index) in arr"
              :icon="item.icon"
              :key="index"
              :description="item.content"
            ></el-step>
          </el-steps>
        </div>
      </ul>
    </div>
  </div>
</template>
<script>
import vm from "../global/vm.js";
import { mapState } from "vuex";
export default {
  data() {
    return {
      isIp: false,
      arr: [
        {
          content: "重构成响应式布局！",
          // icon: "el-icon-picture",
          time: "2018/9/23"
        },
        {
          content: "加入拦截器,每次跳转滚动条定位在最顶端",
          // icon: "el-icon-upload",
          time: "2018/7/10"
        },
        {
          content: "新增进度条，数据交互自动显示和隐藏",

          time: "2018/5/13"
        },
        {
          content: "修复部分浏览器背景画布布局错乱",
          time: "2018/3/7"
        },
        {
          content: "新增音乐舞动",
          time: "2018/3/5"
        },
        {
          content: "新增侧边导航",
          time: "2018/2/13"
        },
        {
          content: "重新布局",
          time: "2017/10/23"
        },
        {
          content: "重新布局",
          time: "2017/9/10"
        },
        {
          content: "优化网站响应速度1s",
          time: "2017/9/5"
        },
        {
          content: "网站上线,node.js后台搭建成功",
          time: "2017/8/20"
        }
      ],
      address: [],
      visitor: 0,
      time: null
    };
  },
  computed: {
    // ...mapState(["ip"])
  },
  mounted() {
    this.arr.reverse();
    this.getIp();
    // this.animation();
  },
  methods: {
    // animation() {
    //   setInterval(() => {
    //     let start = this.arr.slice(0, 1);
    //     let end = this.arr.slice(1);
    //     this.arr = end.concat(start);
    //   }, 500)
    // },
    getIp() {
      this.$ajax({
        url: this.$api.ip,
        method: "GET"
      }).then(res => {
        this.address = res.data.splice(0, 20);
        this.visitor = res.data.length;
      });
    },
    look() {
      if (!this.address.length) {
        this.getIp();
      }
      this.isIp = true;
      clearTimeout(this.time);
    },
    close() {
      this.time = setTimeout(() => {
        this.isIp = false;
      }, 100);
    }
  }
};
</script>
<style scoped lang="less">
#notice {
  width: 100%;
  height: 280px;
  box-shadow: 0 0 2px #aaa;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 5px;
  margin: 10px 0;
  overflow: hidden;
  padding: 10px;
  font-family: "\5B8B\4F53";
  .notice {
    width: 100%;
    height: 100%;
    font-size: 14px;
    overflow: hidden;
    p {
      width: 100%;
      height: 25px;
      line-height: 25px;
      font-size: 16px;
      margin: 2px 0;
      text-align: center;
      color: #555;
      font-family: "宋体";
      i {
        font-size: 17px;
        color: #f56c6c;
      }
    }
    .ip {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      text-align: center;
      margin: 1% 0;
      span {
        margin: 5px;
      }
      .total {
        // float: left;
        font-size: 12px;
        color: #67c23a;
        margin-right: 10px;
      }
      .visitor {
        // float: right;
        position: relative;
        font-size: 12px;
        cursor: pointer;
        color: #409eff;
        line-height: 20px;
        cursor: pointer;
        .detail {
          position: absolute;
          top: 35px;
          left: 0;
          width: 100%;
          height: 200px;
          border: 5px;
          z-index: 2000;
          padding: 5px 0;
          filter: drop-shadow(0 0 2px #aaa);
          background-color: #fff;
          &::before {
            position: absolute;
            left: 40%;
            top: -10px;
            content: "";
            border: 10px solid transparent;
            border-bottom-color: #fff;
            border-top-color: red;
            border-top: none;
            width: 0;
            height: 0;
          }
          ul {
            overflow: auto;
            width: 250%;
            height: 100%;
            li {
              font-size: 12px;
              padding-left: 10px;
              width: 40%;
              color: #909399;
              cursor: pointer;
              margin: 2px 0;
              .red {
                color: #f60;
              }
            }
          }
        }
      }
    }
    .content {
      width: 100%;
      overflow: hidden;
      .step {
        width: 100%;
        height: 100%;
        margin-top: 300px;
        padding: 0 10px;
        animation: step linear 10s infinite;
        // will-change: margin-top;
        &:hover {
          animation-play-state: paused;
        }
      }
      @keyframes step {
        from {
          transform: translateY(300px);
        }
        to {
          transform: translateY(-1100px);
        }
      }
    }
  }
}
</style>