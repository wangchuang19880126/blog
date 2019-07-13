<template>
  <div id="article" class="wrap">
    <div>
      <div>
        <el-input placeholder="输入发表文章的标题" v-model="title">
          <template slot="prepend">文章的标题</template>
        </el-input>
      </div>
      <div style="margin-top: 15px;">
        <el-input placeholder="输入发表文章的类型" v-model="type" class="input-with-select">
          <el-select v-model="type" slot="prepend" placeholder="文章类型" style="width:110px;">
            <el-option label="JavaScript" value="JavaScript"></el-option>
            <el-option label="html" value="html"></el-option>
            <el-option label="css" value="css"></el-option>
            <el-option label="web框架" value="web框架"></el-option>
            <el-option label="node.js" value="node.js"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-input>
      </div>
      <div>
        <p class="cover">上传封面图片</p>
        <el-upload
          class="avatar-uploader"
          action="http://47.110.139.9:3001/load/0"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
    <editor :theme="theme" @input="input" :clear="clear"></editor>
    <el-button type="primary" class="input" @click="open" plain>发表文章</el-button>
  </div>
</template>
<script>
import editor from "@/components/other/editor";
export default {
  components: {
    editor
  },
  data() {
    return {
      content: "",
      title: "",
      type: "",
      theme: "snow",
      clear: 0,
      imageUrl: ""
    };
  },
  created() {
    this.check()
  },
  methods: {
    check() {
      if (!this.$store.state.user) {
        return this.$alert("检测到您还没有登录！", {
          confirmButtonText: "确定",
          callback: action => {
            this.$message({
              type: "warning",
              message: "系统已经跳转到登录页面!"
            });
            this.$router.replace({
              name: "login"
            });
          }
        });
      }
    },
    open() {
      this.check();
      if (this.title && this.type && this.content && this.imageUrl) {
        let data = {
          title: this.title,
          type: this.type,
          content: this.content,
          username: !this.$store.state.user
            ? `游客${Date.now()}`
            : this.$store.state.id,
          imageUrl: this.imageUrl
        };
        console.log(data,this.$store.state)
        this.$store.state.process = true;
        let that = this;
        this.$ajax({
          method: "POST",
          url: this.$api.article,
          data: this.$qs.stringify(data),
          onUploadProgress(e) {
            let scale = e.loaded / e.total;
            that.$store.state.scale = scale;
            if (scale === 1) {
              setTimeout(() => {
                that.$store.state.process = false;
              }, 1000);
            }
          }
        }).then(res => {
          if (res.data.state) {
            this.$alert("文章发表成功", {
              confirmButtonText: "确定",
              callback: action => {
                this.title = "";
                this.type = "";
                this.content = "";
                this.imageUrl = "";
                this.clear = Math.random();
              }
            });
          } else {
            this.$alert("文章发表失败", {
              confirmButtonText: "确定",
              callback: action => {
                this.$message({
                  type: "info",
                  message: `请检查你的网络是否正常`
                });
              }
            });
          }
        });
      } else {
        this.$alert("标题，文章类型，文章的内容,文章封面图片必须填写", {
          confirmButtonText: "确定",
          callback: action => {
            this.$message({
              type: "info",
              message: `请重新填写`
            });
          }
        });
      }
    },
    input(msg) {
      this.content = msg;
    },
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.imageUrl = res.filenameurl;
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 或者 PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  }
};
</script> 

<style lang="less" scope>
#article {
  width: 100%;
  margin: 0 auto;
  height: 810px;
  .cover {
    font-size: 16px;
    margin: 20px 0;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: rgba(255, 255, 255, 0.6);
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .input {
    float: right;
    margin: 5px;
  }
}
</style>
