<template>
  <div class="top" id="header">
    <div class="process clearfix" v-show="state.process">
      <div id="total"></div>
      <div id="loaded" :style="{width:state.scale * 100 + '%'}"></div>
    </div>
    <div id="appTop" class="conter">
      <div class="header conter clearfix">
        <div class="logo"></div>
        <div class="left">
          <ul class="layui-nav" lay-filter>
            <li class="layui-nav-item" @mouseenter="enter" @mouseleave="out">
              <router-link :to="{name:'index',params:{
                title:'首页'
              }}">
                <i class="iconfont icon-index"></i>
                <span>首页</span>
              </router-link>
            </li>
            <li class="layui-nav-item" @mouseenter="enter" @mouseleave="out">
              <router-link
                :to="{name:'article',params:{
                title:'发表文章'
              }}"
              >
                <i class="iconfont icon-wenzhang"></i>
                <span>文章</span>
              </router-link>
            </li>
            <li class="layui-nav-item" @mouseenter="enter" @mouseleave="out">
              <router-link
                :to="{name:'canvas',params:{
                title:'绘制canvas'
              }}"
              >
                <i class="iconfont icon-canvass"></i>
                <span>canvas</span>
              </router-link>
            </li>
            <li class="layui-nav-item" @mouseenter="enter" @mouseleave="out">
              <router-link
                :to="{name:'personal',params:{
                title:'案例展示'
              }}"
              >
                <i class="iconfont icon-anli"></i>
                <span>案例</span>
              </router-link>
            </li>
            <li class="layui-nav-item" @mouseenter="enter" @mouseleave="out">
              <router-link :to="{name:'game',params:{
                title:'小游戏'
              }}">
                <i class="iconfont icon-youxi"></i>
                <span>游戏</span>
              </router-link>
            </li>
            <!-- <li class="layui-nav-item"  @mouseenter="enter" @mouseleave="out">
              <router-link
                :to="{name:'download',params:{
                title:'下载app'
              }}"
              >
                <i class="iconfont icon-xiazai"></i>
                <span>下载</span>
              </router-link>
            </li>-->
            <li class="layui-nav-item" @mouseenter="enter" @mouseleave="out">
              <router-link
                :to="{name:'chat',params:{
                title:'聊天室'
              }}"
              >
                <i class="iconfont icon-weixin"></i>
                <span>聊天室</span>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="center none clearfix">
          <span class="search iconfont icon-sousuo" ref="search" @click="search(-1,$event)"></span>
          <input
            type="text"
            placeholder="输入关键字"
            ref="ipt"
            id="ipt"
            v-model.trim="val"
            @input="change"
            @blur="leave"
            @focus="show"
            @keydown="search(num,$event)"
          >
          <ul ref="content" v-show="bool">
            <li
              v-for="(item,index) in data"
              :key="index"
              @mousedown="search(index,$event)"
              ref="list"
              class="ellipsis"
            >{{item}}</li>
            <p v-show="arr.length" @mousedown="clear">清楚历史记录</p>
          </ul>
        </div>
        <div class="right">
          <ul class="layui-nav">
            <div class="personal" v-if="!state.active">
              <li class="layui-nav-item" style="width:40%;padding:0;text-align:center">
                <router-link
                  :to="{name:'admin',params:{
                title:'个人中心'
              }}"
                >
                  <span class="iconfont icon-app_icons--">个人中心</span>
                </router-link>
              </li>
              <li class="layui-nav-item" style="width:60%;padding:0">
                <img :src="state.avatar" class="layui-nav-img">
                <span>{{state.user}}</span>
                <dl class="layui-nav-child">
                  <dd>
                    <a href="javascript:;" @click="loginOut">退出</a>
                  </dd>
                </dl>
              </li>
            </div>
            <div class="login" v-if="state.active">
              <li class="layui-nav-item info" style="width:35%">
                <router-link
                  :to="{name:'login',params:{
                  title:'登录'
                }}"
                >
                  登录
                  <span class="layui-badge-dot"></span>
                </router-link>
              </li>
              <li class="layui-nav-item" style="width:35%">
                <router-link
                  :to="{name:'regist',params:{
                  title:'注册'
                }}"
                >
                  注册
                  <span class="layui-badge-dot"></span>
                </router-link>
              </li>
            </div>
          </ul>
        </div>
      </div>
      <right-nv/>
    </div>
  </div>
</template>

<script>
import animation from "../../tools/linear-speed.js";
import vm from "./vm.js";
layui.use("element", function() {
  var element = layui.element;
});
export default {
  data() {
    return {
      url: "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?",
      url_x: "http://www.baidu.com/s",
      data: [],
      bool: false,
      ipt: "",
      arr: JSON.parse(localStorage.getItem("key")) || [],
      num: -1,
      val: "",
      target: ""
    };
  },
  computed: {
    state() {
      return this.$store.state;
    }
  },
  mounted() {
    let fn = this.throttle(200, this.scrolling);
    window.addEventListener("scroll", () => {
      fn();
    });
    this.action();
  },
  methods: {
    enter(e) {
      this.target = e.target.firstElementChild.lastElementChild.innerText;
      let num = Math.floor(this.target.length / 2);
      let start = this.target.slice(0, num);
      let middeware = "❤";
      let end = this.target.slice(num);
      e.target.firstElementChild.lastElementChild.innerHTML = `${start}<span style="color:red">${middeware}</span>${end}`;
    },
    out(e) {
      e.target.firstElementChild.lastElementChild.innerText = this.target;
    },
    // 防抖
    throttle(time, cb) {
      let timer = null;
      let that = this;
      return function() {
        let arg = Array.prototype.slice.call(arguments);
        clearTimeout(timer);
        timer = setTimeout(() => {
          cb && cb.apply(that, arg);
        }, time);
      };
    },
    action() {
      setTimeout(() => {
        ipt.focus();
      }, 500);
    },
    scrolling() {
      let msg = document.documentElement.scrollTop > 400;
      $("#header").animate(
        {
          top: msg ? -65 : 0,
          opacity: msg ? 0 : 1
        },
        1000,
        () => {}
      );
      msg && ipt.blur();
    },
    search(index, e) {
      if (e.which === 38 || e.which === 40) {
        this.num += e.which === 38 ? -1 : 1;
        if (this.num < 0) this.num = this.data.length - 1;
        this.num %= this.data.length;
        this.$refs.list.forEach(item => (item.style.backgroundColor = ""));
        this.$refs.list[this.num].style.backgroundColor = "#ccc";
        this.val = this.data[this.num];
        return;
      }
      if (e.which !== 13 && e.which !== 1) return;
      this.val = index === -1 ? this.val : this.data[index];
      if (!this.val) return;
      this.save();
      window.open(this.url_x + `?wd=${this.val}`, "_blank");
    },
    change() {
      if (!this.val) {
        this.show();
        return;
      }
      this.$jsonp(this.url, {
        wd: this.val,
        callbackQuery: "cb",
        callbackName: "jsonpFunc"
      }).then(msg => {
        this.data = msg.s;
      });
    },
    leave() {
      this.bool = false;
    },
    show() {
      this.bool = true;
      if (!this.val) {
        this.data = JSON.parse(window.localStorage.getItem("key")) || [];
      }
    },
    save() {
      this.arr = JSON.parse(window.localStorage.getItem("key")) || [];
      this.arr.push(this.val);
      window.localStorage.setItem("key", JSON.stringify(this.arr));
    },
    clear() {
      this.arr = [];
      window.localStorage.clear();
    },
    loginOut() {
      this.$store.commit("changeLogin", true);
      window.localStorage.removeItem("state");
      this.$ajax({
        method: "GET",
        url: this.$api.loginOut,
        withCredentials: true
      }).then(res => console.log(res.data));
      this.$store.commit("increment");
      vm.$emit("clearArr",[])
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

<style scoped lang="less">
#header {
  width: 100%;
  height: 60px;
  background-color: #000;
  position: fixed;
  top: 0;
  z-index: 1000;
  box-shadow: 0 0 2px #aaa;
  .process {
    position: fixed;
    width: 100%;
    height: 5px;
    z-index: 5000;
    #total {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
    }
    #loaded {
      position: absolute;
      left: 0;
      top: 0;
      width: 0%;
      height: 100%;
      background-color: skyblue;
      // transition: 2s;
    }
  }
  #appTop {
    position: relative;
    width: 100%;
    height: 60px;
    .header {
      width: 90%;
      max-height: 60px;
      .logo {
        float: left;
        width: 14%;
        height: 60px;
        background: url("../../../static/images/1.png") no-repeat left center /
          100% 90%;
        img {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
      .left {
        float: left;
        width: 50%;
        // li {
        // transition: 1s;
        // &:hover {
        //   transform: translate(10px);
        // }
        // }
      }
      .center {
        position: relative;
        float: left;
        width: 10%;
        height: 60px;
        margin-left: 10px;
        input {
          position: absolute;
          right: 0;
          top: 0;
          width: 30px;
          height: 30px;
          outline: none;
          margin-top: 15px;
          border-radius: 15px;
          border: none;
          text-indent: 1em;
          font-size: 14px;
          transition: 1.5s;
          color: #fff;
          background-color: #ff5722;
          &:hover {
            width: 100%;
          }
          &:focus {
            width: 100%;
          }
        }
        .search {
          overflow: hidden;
          position: absolute;
          right: 0;
          top: 15px;
          cursor: pointer;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 18px;
          border-radius: 50%;
          transition: 0.5s;
          color: #fff;
          background-color: #ff5722;
          z-index: 1000;
          &:hover ~ input {
            width: 100%;
          }
        }
        ul {
          position: absolute;
          top: 45px;
          left: 0;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 0 2px #ccc;
          background-color: #ff5722;
          border-radius: 5px;
          margin-top: 1px;
          li {
            height: 20px;
            padding: 0 5px;
            margin: 5px 0;
            cursor: pointer;
          }
          p {
            text-align: right;
            padding: 5px;
            &:hover {
              color: #fff;
              cursor: pointer;
            }
          }
        }
      }
      .right {
        .info {
          background-color: #67c23a;
        }
        float: right;
        width: 22%;
        text-align: center;
        span {
          font-size: 16px;
          line-height: 16px;
        }
      }
    }
  }
}
</style>
