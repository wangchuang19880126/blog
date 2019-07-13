<template>
  <div id="admin" class="wrap">
    <p class="user">
      欢迎尊贵的
    {{wyz}}
      <img :src="state.avatar" alt>
      <span>{{state.user}}</span>登录!
    </p>
    <ul class="clearfix">
      <li v-for="(item, index) in arr" 
      :key="index">
        <span
          :class="{info:index==flag}"
          @click="change(index)"
          v-if="!state.role||(index!==3)&&(index !== 4)"
        >{{item.title}}</span>
        <div :class="{active:index==flag}" class="content" v-if="!role||(index!==3)">
          <div class="layui-form" v-if="flag === 0">
            <table class="layui-table">
              <colgroup>
                <col width="150">
                <col width="150">
                <col width="200">
                <col>
              </colgroup>
              <thead>
                <tr>
                  <th>文章id</th>
                  <th>评论数量</th>
                  <th>发表的时间</th>
                  <th>文章的作者</th>
                  <th>标题</th>
                  <th>类型</th>
                  <th>点赞数量</th>
                  <th>点踩数量</th>
                  <th>其他操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(v,i) in article" :key="i">
                  <td>{{v._id}}</td>
                  <td>{{v.commentNum}}</td>
                  <td>{{new Date(v.updatedAt).toLocaleString()}}</td>
                  <td>{{v.author? v.author.username: v.visitor}}</td>
                  <td>{{v.title}}</td>
                  <td>{{v.type}}</td>
                  <td>{{v.num_x}}</td>
                  <td>{{v.num_y}}</td>
                  <td @click="removeArticle(v._id,i)">删除</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="layui-form" v-if="flag === 1">
            <table class="layui-table">
              <colgroup>
                <col width="150">
                <col width="150">
                <col width="200">
                <col>
              </colgroup>
              <thead>
                <tr>
                  <th>评论id</th>
                  <th>评论文章标题</th>
                  <th>评论时间</th>
                  <th>内容</th>
                  <th>评论作者</th>
                  <th>其他操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(vl,l) in comment" :key="l">
                  <td>{{vl._id}}</td>
                  <td>{{ vl.article.title}}</td>
                  <td>{{new Date(vl.updatedAt).toLocaleString()}}</td>
                  <td v-html="vl.content"></td>
                  <td>{{vl.author ? vl.author.username :vl.visitor}}</td>
                  <td @click="removeComment(vl._id,l)">删除</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="layui-form" v-if="flag === 2">
            <label
              for="pic"
              style="cursor:pointer;margin:10px;padding:5px;box-shadow:0 0 2px skyblue"
            >点击上传头像</label>
            <input type="file" name="file" id="pic" style="display:none" ref="load" @change="send">
          </div>
          <div class="layui-form" v-if="flag === 3">
            <table class="layui-table">
              <colgroup>
                <col width="150">
                <col width="150">
                <col width="200">
                <col>
              </colgroup>
              <thead>
                <tr>
                  <th>用户id</th>
                  <th>用户权限</th>
                  <th>用户名字</th>
                  <th>文章发表数量</th>
                  <th>评论数量</th>
                  <th>创建的时间</th>
                  <th>其他操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(al,m) in user" :key="m">
                  <td>{{al._id}}</td>
                  <td>{{al.role}}</td>
                  <td>{{al.username}}</td>
                  <td>{{al.articleNum}}</td>
                  <td>{{al.commentNum}}</td>
                  <td>{{new Date(al.updatedAt).toLocaleString()}}</td>
                  <td @click="removeUser(al._id,m)">删除</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="layui-form" v-if="flag === 4">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              v-model.trim="textarea"
              maxlength="30"
              show-word-limit
            ></el-input>
            <p style="text-align:right;padding:10px;">
              <el-button type="primary" @click="push">推送</el-button>
            </p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      load: "",
      arr: [
        { title: "文章管理", info: "article" },
        { title: "评论管理", info: "comment" },
        { title: "头像上传", info: "avatar" },
        { title: "用户管理", info: "user" },
        { title: "全频道广播", info: "" }
      ],
      article: [],
      comment: [],
      user: [],
      flag: 0,
      bool: true,
      textarea: ""
    };
  },
  created() {
    if (!this.state.user)
      return this.$alert("检测到您还没有登录！", {
        confirmButtonText: "确定",
        callback: action => {
          this.$message({
            type: "warning",
            message: "系统已经跳转到登录页面!"
          });
          this.$router.replace({
            name: "login",
            params: {
              title: "登录账号"
            }
          });
        }
      });
    let that = this;
    this.arr.forEach((v, i) => {
      if (i === 2) return;
      if (i === 3 && that.$store.state.role === 1) return;
      this.$store.state.process = true;
      this.$ajax({
        url: `/admin/${v.info}`,
        method: "GET",
        params: {
          id: that.$store.state.id,
          role: that.$store.state.role
        },
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
        that[v.info] = res.data.data;
      });
    });
  },
  computed: {
    state() {
      return this.$store.state;
    }
  },
  methods: {
    send(e) {
      let file = e.target.files[0];
      let formdata1 = new FormData();
      formdata1.append("file", file);
      let that = this;
      that.$store.state.process = true;
      this.$ajax({
        method: "POST",
        url: `/load/${that.$store.state.id}`,
        data: formdata1,
        onUploadProgress(e) {
          that.$store.state.scale = e.loaded / e.total;
          if (e.loaded / e.total === 1) {
            setTimeout(() => {
              that.$store.state.process = false;
            }, 1000);
          }
        }
      }).then(res => {
        if (res.data.state) {
          e.target.fiels = [];
        } else {
          alert("上传失败，检查图片大小是否过大");
        }
      });
    },
    change(i) {
      this.flag = i;
    },
    // 删除文章
    removeArticle(v, idx) {
      this.$ajax
        .delete(`/article/${v}`, {
          name: "123"
        })
        .then(res => {
          if (res.data.state) {
            this.article.splice(idx, 1);
          } else {
            alert(res.data.msg);
          }
        });
    },
    // 删除评论
    removeComment(v, idx) {
      this.$ajax.delete(`/comment/${v}`).then(res => {
        if (res.data.state) {
          this.comment.splice(idx, 1);
        } else {
          alert(res.data.msg);
        }
      });
    },
    // 删除用户
    removeUser(v, idx) {
      this.$ajax.delete(`/user/${v}`).then(res => {
        if (res.data.state) {
          this.user.splice(idx, 1);
        } else {
          alert(res.data.msg);
        }
      });
    },
    push() {
      console.log(this.textarea);
      this.$ajax({
        url: this.$api.pusher,
        methods: "GET",
        params: {
          message: this.textarea
        }
      }).then(res => {
        if (res.data.state) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.textarea = ''
        }
      });
    }
  }
};
</script>
<style scope lang="less">
#admin {
  width: 100%;
  min-height: 760px;
  box-shadow: 0 0 2px skyblue;
  .user {
    width: 100%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    color: purple;
    margin: 10px 0;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-left: 5px;
    }
    span {
      color: red;
      margin-right: 5px;
    }
  }
  ul {
    position: relative;
    padding: 5px 0;
    li {
      float: left;
      height: 20px;
      line-height: 20px;
      width: 15%;
      overflow: hidden;
      cursor: pointer;
      span {
        padding: 6px 10px;
      }
      .content {
        position: absolute;
        left: 0;
        top: 30px;
        box-shadow: 0 0 2px #ccc;
        width: 100%;
        height: 650px;
        padding: 5px;
        display: none;
        overflow: auto;
      }
      .content.active {
        display: block !important;
      }
      span.info {
        border-bottom: 1px solid #f60;
        color: #f60;
      }
    }
  }
  .active {
    display: block !important;
  }
}
</style>