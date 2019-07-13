<template>
  <!-- <div> -->
    <div id="appFooter">
      <ul class="clearfix">
        <!-- <li>友情链接:</li> -->
        <li v-for="(item,index) in link" :key="index">
          <a href="#">{{item}}</a>
        </li>
      </ul>
      <p>Copyright @2011-2025 我有罪 许可证编号：鄂ICP备19008488号 版权所有 Powered by DedeCMS</p>
      <!-- <p class="time">{{msg}}</p> -->
      <div></div>
    </div>
  <!-- </div> -->
</template>
<script>
export default {
  data() {
    return {
      link: [
      ],
    };
  }
};
</script>
<style lang="less" scoped>
#appFooter {
  width: 100%;
  height: 300px;
  background-color: #010101;
  border: 1px solid transparent;
  overflow: hidden;
  ul {
    width: 40%;
    margin: 10px auto;
    li {
      float: left;
      margin: 5px 0;
      a {
        color: darkgreen;
        font-size: 14px;
        padding: 10px 10px;
        &:hover {
          color: #f60;
          text-decoration: underline;
        }
      }
    }
  }
  p {
    width: 80%;
    text-align: center;
    font-size: 12px;
    font-weight: 100;
    margin: 20px auto;
    white-space: normal;
    color: #fff;
  }
  div {
    width: 100%;
    height: 75%;
    margin: 45px auto;
    background: url("../../../static/images/bg.jpg") no-repeat center bottom/50% 130%;
  }
}
</style>