<template>
  <div id="articleList" class="wrap">
    <div class="article">
      <div class="list" v-for="(item,index) in articleList" :key="index">
        <div class="content">
          <img v-lazy="item.imageUrl" :title="item.type" alt>
        </div>
        <div class="detail clearfix">
          <div class="intro clearfix">
            <p class="type">{{item.type}}</p>
            <p class="title ellipsis">{{item.title}}</p>
          </div>
          <div class="thing clearfix">
            <span class="author">
              <i class="el-icon-edit"></i>
              作者：{{item.author ? (item.author.username === "owner" ? "我有罪" : item.author.username): item.visitor}}
            </span>
            <span class="time">
              <i class="iconfont icon-shijian"></i>
              发表时间:{{moment(item.created,'YYYYMMDD').fromNow()}}
            </span>
            <span class="num">
              <i class="el-icon-success"></i>
              阅览数量:{{item.commentNum}}
            </span>
          </div>
          <div class="footer">
            <i
              class="iconfont icon-zan"
              title="点个赞"
              @click="add(index,item._id)"
              style="font-size:20px;"
            ></i>
            <span ref="support">{{item.num_x}}</span>
            <i class="iconfont icon-cai" title="踩一下" @click="remove(index,item._id)"></i>
            <span ref="tread">{{item.num_y}}</span>
          </div>
          <div class="read">
            <router-link
              :to="{name:'detail',params:{
                title:item.title,
                id:item._id
              }}"
            >
              <span title="点击阅读文章详情">
                阅读全文
                <i class="el-icon-more"></i>
              </span>
            </router-link>
          </div>
        </div>
        <span class="line"></span>
      </div>
    </div>
    <div class="page" v-show="(maxPage - 1)">
      <el-pagination
        background
        layout="total,prev, pager, next, jumper"
        :total="arr.length"
        page-size="8"
        @prev-click="previous"
        @next-click="next"
        @current-change="pageChange"
        small="true"
        pager-count="5"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import vm from "../global/vm.js";
export default {
  data() {
    return {
      articleList: [],
      defaultImage: "../../../static/images/icon.jpg",
      istrue: true,
      isfalse: true,
      maxPage: 1,
      limit: 8,
      page: 1,
      arr: [],
      ip: [],
      moment
    };
  },
  created() {
    this.$ajax({
      method: "GET",
      url: this.$api.articleList,
    }).then(res => {
      this.maxPage = Math.ceil(res.data.length / this.limit);
      this.arr = res.data;
      this.cut(this.page);
    });
  },
  methods: {
    pageChange(e) {
      this.page = e;
      this.cut(this.page);
    },
    previous(e) {
      this.page--;
      this.cut(this.page);
    },
    next(e) {
      this.page++;
      this.cut(this.page);
    },
    cut(i) {
      this.articleList = this.arr.slice((i - 1) * this.limit, this.limit * i);
    },
    add(index, id) {
      let uid = this.$store.state.id;
      if (!uid) {
        this.$alert("检测到你还没有登录！", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push({
              name: "login"
            });
          }
        });
        return;
      }
      this.$ajax
        .post(
          this.$api.support,
          this.$qs.stringify({
            id,
            uid
          })
        )
        .then(res => {
          if (!res.data.state) return;
          this.$refs.support[index].innerText++;
        });
    },
    remove(index, id) {
      let uid = this.$store.state.id;
      if (!uid) {
        this.$alert("检测到你还没有登录！", {
          confirmButtonText: "确定",
          callback: action => {
            this.$router.push({
              name: "login"
            });
          }
        });
        return;
      }
      this.$ajax
        .post(
           this.$api.tread,
          this.$qs.stringify({
            id,
            uid
          })
        )
        .then(res => {
          if (!res.data.state) return;
          this.$refs.tread[index].innerText++;
        });
    },
    detail(id) {
      vm.articleId = id;
      vm.defaultImage = this.defaultImage;
    }
  }
};
</script>
<style lang="less" scope>
#articleList {
  width: 100%;
  margin: 0 auto;
  .article {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .list {
      position: relative;
      display: flex;
      align-content: center;
      width: 100%;
      padding: 15px 0;
      margin: 5px 0;
      border-bottom: 1px solid #ccc;
      font-family: "\5B8B\4F53";
      color: #666;
      cursor: text;
      transition: 0.7s;
      p {
        margin: 5px 0;
      }
      .content {
        width: 30%;
        margin-right: 30px;
        height: 175px;
        overflow: hidden;
        border-radius: 5px;
        vertical-align: middle;
        min-width: 220px;
        img {
          display: block;
          width: 100%;
          height: 100%;
          max-width: 460px;
          margin:0 auto;
          cursor: pointer;
          transition: 1s;
          &:hover {
            transform: scale(1.2);
          }
        }
      }
      .detail {
        width: 80%;
        font-size: 14px;
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        div {
          width:100%;
        }
        .intro {
          .title {
            float: left;
            max-width: 60%;
            height: 25px;
            line-height: 25px;
            font-size: 17px;
            margin-left: 10px;
          }
          .type {
            position: relative;
            float: left;
            height: 25px;
            line-height: 25px;
            width: 80px;
            text-align: center;
            background-color: #67c23a;
            color: #fff;
            border-radius: 2px;
            &::before {
              position: absolute;
              top: 3px;
              right: -18px;
              border: 10px solid transparent;
              border-left-color: #67c23a;
              content: "";
              height: 0;
              width: 0;
            }
          }
        }
        .thing {
          width: 100%;
          span {
            float:left;
            margin: 5px 10px;
            i {
              font-size: 18px;
              color: #666;
            }
            &:hover {
              color: #f60;
            }
          }
        }
        .footer {
          width: 100%;
          margin: 10px auto;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-indent: 5px;
          i {
            color: #409eff;
            cursor: pointer;
            &:hover {
              font-size: 17px;
              color: #e6a23c;
            }
          }
          span {
            color: #f56c6c;
            font-size: 16px;
            margin: 0 2px;
          }
        }
        .read {
          width: 100px;
          height: 30px;
          line-height: 28px;
          font-size: 15px;
          border-radius: 5px;
          background-color: #9466ff;
          color: #ddd;
          border: 1px solid;
          text-align: center;
          a:hover {
            color: #fff;
          }
        }
      }
      .line {
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 0;
        height: 1px;
        background-color: #f56c6c;
        transition: 1s;
      }
      &:hover .line {
        width: 100%;
      }
    }
  }
  .page {
    margin: 20px 0;
    display: flex;
    justify-content: space-around;
  }
}
</style>