<template>
  <div id="chatroom" @contextmenu.prevent @mousewheel.prevent>
    <el-container>
      <el-aside width="300px">
        <h2>
          <i class="iconfont icon-app_icons--"></i>
          房间成员列表({{userList.length}})
        </h2>
        <ul class="list">
          <li
            v-for="(item,index) in userList"
            :key="index"
            :class="item.username === userInfo.username ? 'bg': ''"
            :title="item.ip"
          >
            <img :src="item.avatar" alt />
            <span class="author">{{item.username==="owner" ? "我有罪" : item.username}}</span>
            <img src="../../../static/images/adminpic.png" alt v-if="!item.role" />
            <img src="../../../static/images/putongyonghu.png" alt v-if="item.role" />
          </li>
        </ul>
      </el-aside>
      <el-container>
        <el-header>
          <h3>公告</h3>
          <ul ref="enterBox">
            <li v-for="(item,index) in allUserList" :key="index">
              <span>
                <span v-if="item.isEnter" class="text">让我们用热烈的掌声欢迎</span>
                <span v-if="!item.isEnter" class="text">非常遗憾的告诉你</span>
                &nbsp;
                <span
                  class="author"
                >{{item.username==="owner" ? "系统管理员我有罪" : item.username}}</span>&nbsp;
                <span v-if="item.isEnter" class="text">进入房间</span>
                <span v-if="!item.isEnter" class="text">退出房间</span>
              </span>
              &nbsp;&nbsp;&nbsp;
              <span
                class="ip"
              >{{moment(item.time).format("L HH:mm:ss")}}</span>
            </li>
          </ul>
          <div class="animate1" v-if="isShow.animateEnter">超级管理员我有罪进入房间</div>
          <div class="animate2" v-if="isShow.animateLeave">超级管理员我有罪离开房间</div>
        </el-header>
        <el-main>
          <load-more :content-text="contentText" @more="more" :status="status"></load-more>
          <ul class="content" ref="list">
            <li v-for="(item,index) in messageList" :key="index">
              <p
                class="content_first"
                :style="`text-align:${item.username == userInfo.username ? 'right':'left'}`"
              >
                <img :src="item.avatar" alt />
                <span class="author">{{item.username==="owner" ? "我有罪" : item.username}}</span>
                <span>(ip:{{item.ip}})</span>
              </p>
              <p
                class="content_second"
                :style="`text-align:${item.username == userInfo.username ? 'right':'left'}`"
              >
                <span class="messageInfo">
                  {{item.content}}&nbsp;&nbsp;&nbsp;&nbsp;
                  {{moment(item.time).format("L HH:mm:ss")}}
                </span>
              </p>
            </li>
          </ul>
        </el-main>
        <el-footer>
          <div class="footer">
            <div class="message">
              <textarea
                name
                id
                cols="200"
                rows="10"
                @keypress.enter="sendMessage"
                v-model.trim="textarea"
                :disabled="isSend"
              ></textarea>
            </div>
            <div class="submit">
              <el-button type="success" @click="sendMessage" :disabled="isSend">{{submitMessage}}</el-button>
            </div>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import loadMore from "@/components/other/load-more";
// code : 0 用户列表 1 聊天数据 2退出用户数据 3 查看更多记录数据
export default {
  data() {
    return {
      textarea: "",
      userList: [],
      ws: null,
      userInfo: {},
      messageList: [],
      moment,
      isSend: false,
      submitMessage: "发送消息",
      enterList: [],
      quiteList: [],
      isShow: {
        animateEnter: false,
        animateLeave: false
      },
      contentText: {
        contentdown: "查看更多聊天记录",
        contentrefresh: "正在加载数据中...",
        contentnomore: "没有更多记录了"
      },
      watchMore: [],
      status: "more",
      limit: 10,
      page: 0,
      relink:null,
    };
  },
  components: {
    loadMore
  },
  computed: {
    allUserList() {
      return this.enterList
        .concat(this.quiteList)
        .sort((a, b) => a.time - b.time);
    }
  },
  created() {
    // 识别用户身份
    this.getUserInfo();
    // 创建websocket连接
    this.createLink(this.userInfo);
    // 获取服务器推送的消息
    this.getMessage();
    // 监听刷新或者关闭浏览器事件
    window.addEventListener("beforeunload", () => {
      this.ws.close();
    });
        // 监听网络异常或者服务器断开连接
    this.ws.addEventListener("close", message => {
      if(message.code !== 1005){
        clearTimeout(this.relink)
        console.log("每5s钟重新连接服务器一次")
        this.relink = setInterval(() => {
          this.createLink(this.userInfo)
        }, 5000);
      }
    });
    this.ws.addEventListener("error", error => {
      console.log(error);
    });
  },
  // 离开组件断开连接
  beforeDestroy() {
    this.ws.close();
  },
  methods: {
    getUserInfo() {
      if (this.$store.state.user) {
        this.userInfo = {
          username: this.$store.state.user,
          role: this.$store.state.role,
          avatar: this.$store.state.avatar
        };
      } else {
        if (!window.localStorage.getItem("userInfo")) {
          this.$message({
            message: "你是非法用户！",
            type: "warning"
          });
          this.$router.replace({
            name: "chat"
          });
          return;
        }
        this.userInfo = JSON.parse(window.localStorage.getItem("userInfo"));
      }
    },
    // 监听服务器推送消息
    getMessage() {
      this.ws.addEventListener("message", message => {
        let msg = JSON.parse(message.data);
        // console.log(msg)
        if (!msg.code) {
          this.userList = msg.userList;
          this.enterList = this.enterList.concat(msg.enterList);
          let role = this.enterList[this.enterList.length - 1].role;
          if (!role) {
            this.isShow.animateEnter = false;
            setTimeout(() => {
              this.pullTop(this.$refs.enterBox);
              this.isShow.animateEnter = true;
            }, 500);
          }
        } else if (msg.code == 1) {
          this.messageList = this.messageList.concat(msg.messageList);
          this.sortData(this.messageList);
          setTimeout(() => {
            this.pullTop(this.$refs.list);
          }, 500);
        } else if (msg.code == 2) {
          this.userList = msg.userList;
          this.quiteList = this.quiteList.concat(msg.quiteList);
          let role = this.quiteList[this.quiteList.length - 1].role;
          if (!role) {
            this.isShow.animateLeave = false;
            setTimeout(() => {
              this.pullTop(this.$refs.enterBox);
              this.isShow.animateLeave = true;
            }, 500);
          }
        } else if (msg.code == 3) {
          this.watchMore = this.watchMore.concat(msg.watchMore);

          this.watchMore.reverse();
          this.cutData();
          this.sortData(this.messageList);
        }
      });
    },
    // 分割数据
    cutData() {
      let num = this.watchMore.length / this.limit;
      this.page++;
      if (this.page > Math.ceil(num)) return (this.status = "");
      setTimeout(() => {
        this.status = "more";
        this.messageList = this.messageList.concat(
          this.watchMore.slice(
            (this.page - 1) * this.limit,
            this.limit * this.page
          )
        );
        this.sortData(this.messageList);
      }, 500);
    },
    // 给数据排序
    sortData(el) {
      el.sort((a, b) => a.time - b.time);
    },
    // 查看更多聊天记录
    more(msg) {
      this.status = "loading";
      if (!this.watchMore.length) {
        return this.ws.send(
          JSON.stringify({
            code: 3
          })
        );
      }
      this.cutData();
    },
    // 滚动条拉到最底部
    pullTop(ele) {
      ele.scrollTop = ele.scrollHeight - ele.offsetHeight;
    },
    // 创建连接
    createLink(info) {
      info.code = 0;
      info.time = Date.now();
      this.ws = new WebSocket(this.$api.chatroom);
      this.ws.addEventListener("open", () => {
        this.ws.send(JSON.stringify(info));
        // console.log(1111111111111111)
        // 关闭重新连接服务器de定时器
        clearTimeout(this.relink)
      });
    },
    // 聊天发送消息
    sendMessage() {
      if (!this.textarea)
        return this.$message({
          message: "别搞事情呀，发点东西吧！",
          type: "error"
        });
      let obj = {
        content: this.textarea,
        code: 1,
        username: this.userInfo.username,
        avatar: this.userInfo.avatar,
        role: this.userInfo.role
      };
      this.userInfo.role && this.roleControl();
      this.ws.send(JSON.stringify(obj));
      this.textarea = "";
    },
    // 5s后发送消息
    roleControl() {
      this.isSend = true;
      let count = 5;
      let time = null;
      clearInterval(time);
      time = setInterval(() => {
        this.submitMessage = `${count}s`;
        if (count < 0) {
          (this.submitMessage = "发送消息"), (this.isSend = false);
          clearInterval(time);
        }
        count--;
      }, 1000);
    }
  }
};
</script>
<style lang="less" scoped>
#chatroom {
  background-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 10px #909399;
  border-radius: 10px;
  overflow: hidden;
  font-size: "宋体";
  margin-bottom: 20px;
  .el-aside {
    max-height: 550px;
    overflow: auto;
    h2 {
      margin: 10px 0;
    }
    .list {
      li.bg {
        background-color: #f56c6c;
        color: #67c23a;
      }
      li {
        box-sizing: border-box;
        border-radius: 5px;
        width: 90%;
        padding: 5px;
        margin: 5px auto;
        cursor: pointer;
        // margin:5px 0;
        img {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          vertical-align: middle;
        }
        .author {
          display: inline-block;
          width: 180px;
          height: 35px;
          line-height: 35px;
          text-align: left;
          font-size: 16px;
          vertical-align: middle;
        }
      }
    }
  }
  .el-footer {
    padding: 0;
    .footer {
      width: 100%;
      height: 100%;
      display: flex;
      .message {
        width: 85%;
      }
      .submit {
        width: 15%;
        button {
          width: 100%;
          height: 100%;
          font-size: 20px;
        }
      }
    }
  }
  .el-main {
    .content {
      max-height: 300px;
      width: 100%;
      overflow: auto;
      li {
        width: 100%;
        // height: 60px;
        padding: 10px;
        p {
          margin: 5px 0;
        }
        .content_first {
          img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
          }
          span {
            margin: 5px;
            font-size: 16px;
            color: #e6a23c;
          }
        }
        .content_second {
          width: 80%;
          margin: 0 auto;
          font-size: 14px;
          span {
            display: inline-block;
            background-color: #909399;
            color: #fff;
            padding: 10px;
            border-radius: 5px;
            white-space: normal;
          }
        }
      }
    }
  }
  .el-header {
    position: relative;
    width: 100%;
    max-height: 95px;
    overflow: hidden;
    h3 {
      margin: 5px;
      font-size: 16px;
    }
    ul {
      width: 120%;
      max-height: 50px;
      overflow: auto;
      li {
        text-align: left;
        width: 60%;
        margin: 0 auto;
        font-size: 12px;
        cursor: text;
        .text {
          color: #909399;
        }
        .author {
          color: #f56c6c;
        }
        .ip {
          color: #909399;
        }
      }
    }
    .animate1 {
      position: absolute;
      left: 100%;
      top: 0;
      width: 30%;
      min-height: 95px;
      line-height: 95px;
      color: #fff;
      font-size: 16px;
      background-color: rgba(255, 0, 0, 0.6);
      animation: admin1 8s linear;
      border-radius: 5%;
    }
    .animate2 {
      position: absolute;
      left: -100%;
      top: 0;
      width: 30%;
      min-height: 95px;
      line-height: 95px;
      color: #fff;
      font-size: 16px;
      background-color: rgba(255, 0, 0, 0.6);
      animation: admin2 8s linear;
      border-radius: 5%;
    }
    @keyframes admin1 {
      from {
        left: 100%;
      }
      to {
        left: -100%;
      }
    }
    @keyframes admin2 {
      from {
        left: -100%;
      }
      to {
        left: 100%;
      }
    }
  }
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  min-height: 95px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  min-height: 550px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  //   text-align: center;
  padding: 10px;
  min-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
}
</style>