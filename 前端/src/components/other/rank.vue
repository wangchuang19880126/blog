<template>
  <div id="rank">
    <p>
      <i class="el-icon-rank" style="font-size:18px"></i>
      文章热度↓
    </p>
    <ol>
      <li v-for="(item,index) in rank" :key="index">
        <span
          class="left"
          :style="{
          backgroundColor:color[index] || '#909399',
        }"
        >{{index + 1}}</span>
        <router-link
          :to="{name:'detail',params:{
          title:item.title,
          id:item._id
        }}"
        >
          <span
            class="slip"
            :style="{
              color:color[index] || '#909399',
            }"
          >
            <i class="el-icon-share"></i>
            {{item.title}}
          </span>
        </router-link>
      </li>
    </ol>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rank: [],
      num: 10,
      color: ["#67C23A", "#F56C6C", "#409EFF"]
    };
  },
  created() {
    // 获取排行数据
    this.$ajax.get(this.$api.rank).then(res => {
      this.rank = res.data;
      this.rank.sort((a, b) => b.num_x - a.num_x);
      // 分割数组获取排行榜前10数据
      this.rank.splice(this.num);
    });
  }
};
</script>
<style lang="less" scoped>
#rank {
  width: 100%;
  box-shadow: 0 0 2px #aaa;
  background-color: rgba(255, 255, 255, 0.6);
  overflow: hidden;
  font-family: "\5B8B\4F53";
  border-radius: 5px;
  padding:0 10px;
  p {
    width: 100%;
    height: 20px;
    line-height: 20px;
    margin: 5px auto;
    text-align: center;
    font-size: 16px;
    i {
      color: #f56c6c;
    }
  }
  ol {
    padding: 5px 0;
    min-height: 270px;
    margin: 0 auto;
    li {
      overflow: hidden;
      width: 100%;
      margin: 2px 0;
      span {
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        margin: 0 3px;
        text-align: center;
        font-size: 14px;
        vertical-align: middle;
        color: #fff;
        border-radius: 2px;
        cursor: pointer;
        box-sizing: content-box;
        transition: 0.7s;
        &:hover {
          border-radius: 50%;
        }
      }
      a {
        display: inline-block;
        width: 100%;
        .slip {
          text-decoration: none;
          min-width: 80%;
          display: inline-block;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          height: 30px;
          line-height: 30px;
          text-align: left;
          font-size: 14px;
          vertical-align: middle;
          cursor: pointer;
          transition: 1s;
          &:hover {
            text-decoration: underline;
            text-indent: 10px;
          }
        }
      }
    }
  }
}
</style>