<template >
  <div id="articleDetail" class="wrap">
    <div class="detail_left">
      <div class="list" v-for="(item,index) in articleDetail" :key="index">
        <div class="breadcrumb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/article'}">文章发表</el-breadcrumb-item>
            <el-breadcrumb-item>文章详情</el-breadcrumb-item>
            <el-breadcrumb-item>
              <span style="color:#F56C6C">类型:{{item.type}}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <p class="header clearfix">
          <i class="el-icon-edit-outline"></i>
          <span>{{item.title}}</span>
        </p>
        <div class="content">
          <div class="icn">
            <span>
              <i class="iconfont icon-app_icons--"></i>
              作者:{{item.author ? (item.author.username === "owner" ? "我有罪" : item.author.username): item.visitor}}
            </span>
            <span>
              <i class="iconfont icon-shijian"></i>
              发表时间:{{moment(item.created).format("llll")}}
            </span>
          </div>
          <div class="image">
            <img :src="item.imageUrl" alt>
          </div>
        </div>
        <hr style="background:#666">
        <div class="intro" v-html="item.content"></div>
        <hr style="background:#666">
        <p class="detail clearfix">
          <el-badge :value="item.num_x" class="item">
            <el-button size="small" class="iconfont icon-zan" disabled></el-button>
          </el-badge>
          <el-badge :value="item.num_y" class="item">
            <el-button size="small" class="iconfont icon-cai" disabled></el-button>
          </el-badge>
          <el-badge :value="item.commentNum" class="item" type="primary">
            <el-button size="small">评论</el-button>
          </el-badge>
          <el-badge :value="0" class="item" type="warning">
            <el-button size="small">回复</el-button>
          </el-badge>
        </p>
        <ul ref="ul">
          <li v-for="(v,i) in commentList" :key="i">
            <img :src="v.author?  v.author.avatar : icon">
            <span>{{v.author ? v.author.username : v.visitor}}</span>
            <div v-html="v.content" class="content"></div>
            <p class="time">
              <span>
                <i class="iconfont icon-shijian"></i>
                评论时间：{{moment(v.created).format("llll")}}
              </span>
            </p>
          </li>
        </ul>
      </div>
      <editor :theme="theme" @input="input" :clear="clear"></editor>
      <el-button type="primary" @click="submit" plain class="input">提交评论</el-button>
    </div>
    <div class="right">
      <right-nv :bool="false"></right-nv>
    </div>
  </div>
</template>
<script>
const rightNv = () => ({
  component: import("@/components/other/right"),
  delay: 200,
  timeout: 3000
});
const editor = () => ({
  component: import("@/components/other/editor"),
  delay: 200,
  timeout: 3000
});
export default {
  data() {
    return {
      moment,
      articleDetail: [],
      commentList: [],
      icon: "../../../static/images/icon.jpg",
      content: "",
      clear: 0,
      id: ""
      // theme:"",
    };
  },
  watch: {
    $route: {
      handler() {
        this.request(this.$route.params.id);
      },
      deep: true
    }
  },
  components: {
    editor,
    rightNv
  },
  created() {
    this.id = this.$route.params.id;
    this.request(this.$route.params.id);
  },
  methods: {
    request(id) {
      let that = this;
      this.$store.state.process = true;
      this.$ajax({
        url: `/articleList/${id}`,
        method: "GET",
        onDownloadProgress(e) {
          that.$store.state.scale = e.loaded / e.total;
          if (e.loaded / e.total === 1) {
            setTimeout(() => {
              that.$store.state.process = false;
              that.$store.state.scale = 0;
            }, 3000);
          }
        }
      }).then(res => {
        this.articleDetail = res.data;
        document.documentElement.scrollTop = 0;
      });
      this.$ajax.get(`/comment/${id}`).then(res => {
        this.commentList = res.data;
        this.commentList.forEach(item => {
          if (!item.author) return;
          item.author.avatar = "http://47.110.139.9:3001" + item.author.avatar;
        });
      });
    },
    submit() {
      if (!this.content) {
        this.$alert("别这么无聊，写点啥吧", {
          confirmButtonText: "确定",
          callback: action => {
            this.content = "";
            this.clear = Math.random();
          }
        });
        return;
      }
      let visitor = "游客" + Date.now();
      let data = {
        article: this.id,
        author: this.$store.state.user ? this.$store.state.id : visitor,
        avatar: this.$store.state.user ? this.$store.state.avatar : this.icon,
        content: this.content
      };
      this.$ajax({
        method: "POST",
        url: "/comment",
        data: this.$qs.stringify(data)
      }).then(res => {
        this.commentList = res.data.data;
        this.commentList.forEach(item => {
          if (!item.author) return;
          item.author.avatar = "http://47.110.139.9:3001" + item.author.avatar;
        });
        this.$alert(res.data.msg, {
          confirmButtonText: "确定",
          callback: action => {
            this.title = "";
            this.type = "";
            this.content = "";
            this.clear = Math.random();
          }
        });
      });
      this.content = "";
    },
    input(msg) {
      this.content = msg;
    }
  }
};
</script>
<style lang="less" scope>
#articleDetail {
  position: relative;
  width: 100%;
  margin: 0 auto;
  .detail_left {
    font-family: "\5B8B\4F53";
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 2px #aaa;
    border-radius: 5px;
    overflow: hidden;
    width: 75%;
    padding: 5px;
    .breadcrumb {
      margin: 10px;
    }
    .list {
      width: 100%;
      margin: 10px auto;
      color: #666;
      font-size: 14px;
      line-height: 18px;
      .header {
        width: 100%;
        margin: 30px auto;
        color: #fff;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background-color: #67c23a;
        border-radius: 5px;
      }
      .content {
        width: 100%;
        font-size: 16px;
        text-indent: 2em;
        min-height: 30px;
        .icn {
          text-align: center;
          white-space: normal;
          span {
            margin: 0 10px;
          }
        }
        .image {
          width: 100%;
          height: 250px;
          img {
            width: 90%;
            max-width: 500px;
            height: 100%;
            display: block;
            margin: 10px auto;
          }
        }
      }
      .intro {
        font-size: 16px;
        white-space: normal;
        overflow: hidden;
        min-height: 150px;
        p {
          text-indent: 2em;
          margin: 10px 0;
          letter-spacing: 1px;
          font-family: "\5B8B\4F53";
        }
      }
      .detail {
        width: 100%;
        margin: 10px auto;
        font-size: 14px;
        display: flex;
        justify-content: space-around;
      }
      .footer {
        width: 100%;
        margin: 10px auto;
        font-size: 14px;
        i {
          color: skyblue;
          cursor: pointer;
          &:nth-child(1) {
            font-size: 19px;
          }
        }
        span {
          color: #ccc;
          margin: 0 10px;
        }
      }
      ul {
        width: 100%;
        font-size: 14px;
        color: #444;
        li {
          margin: 10px auto;
          background-color: #e2e2e2;
          border-radius: 5px;
          padding: 10px;
          .content {
            line-height: 16px;
            margin: 10px auto;
            text-indent: 2em;
          }
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 5px solid #1e9fff;
          }
          .time {
            text-align: right;
          }
        }
      }
    }
    .input {
      float: right;
      margin: 5px;
    }
  }
  .right {
    position: absolute;
    right: 0;
    top: 0;
    width: 24%;
    height: auto;
  }
}
</style>