<template>
  <div>
    <calendar
      @choseDay="clickDay"
      @changeMonth="changeDate"
      @isToday="isToday"
      @singedToday="signedToday"
      :markDateMore="markDateMore"
      :signedMore="signedMore"
      :disabled="disabled"
    ></calendar>
    <notice></notice>
    <rank></rank>
  </div>
</template>
<script>
import vm from '../global/vm'
const calendar = () => ({
  component: import("@/components/vue-calendar-component"),
  delay: 200,
  timeout: 3000
});
const rank = () => ({
  component: import("@/components/other/rank"),
  delay: 200,
  timeout: 3000
});
const notice = () => ({
  component: import("@/components/other/notice"),
  delay: 200,
  timeout: 3000
});
function format(date) {
  date = new Date(date);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
export default {
  data() {
    return {
      markDateMore: this.$store.state.signedlist,
      message: {},
      disabled: false,
      signedMore: 0
    };
  },
  components: {
    calendar,
    rank,
    notice
  },
  created() {
    // 登录后执行获取签到信息
    !this.$store.state.active && this.getData();
    vm.$on("clearArr",msg => this.markDateMore = msg)
  },
  methods: {
    getData() {
      let _id = this.$store.state.id;
      // console.log(id)
      this.$ajax({
        url: this.$api.signed,
        method: "POST",
        data: {
          _id
        }
      }).then(res => {
        this.markDateMore = res.data.data[0].signedList;
        (this.signedMore = res.data.data[0].signedMore),
          (this.markDateMore = this.markDateMore.map(item => ({
            date: format(item.date),
            className: "mark1"
          })));
        // 判断是否可以点击签到
        let toDay = format(new Date());
        let isBool = this.markDateMore.find(item => item.date == toDay);
        this.disabled = isBool ? true : false;
      });
    },
    clickDay(data) {
      console.log(data); //选中某天
    },
    changeDate(data) {
      console.log(data); //左右点击切换月份
    },
    isToday(data) {
      console.log(data); //跳到了本月
    },
    signedToday(msg) {
      // 判断昨天是否签到
      let day1 = new Date();
      day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
      let yesterday =
        day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
      let bool = this.markDateMore.find(item => format(item.date) == yesterday);
      // 昨天签到+1，没有赋值成1
      if (bool) {
        this.signedMore += 1;
      } else {
        this.signedMore = 1;
      }
      this.markDateMore.push({
        date: format(msg),
        className: "mark1"
      });
      let signedlist = this.markDateMore.map(item => ({
        date:item.date
      }))
      this.$ajax({
        method: "POST",
        url: this.$api.signedlist,
        data: {
          _id: this.$store.state.id,
          signedMore: this.signedMore,
          signedlist,
        }
      }).then(res => {
        if (res.data) {
          this.markDateMore.push({
            date: format(msg),
            className: "mark1"
          });
          this.disabled = true;
        }
      });
    }
  }
};
</script>
<style>
.wh_content_item .mark1 {
  background: url("../../../static/1.png") no-repeat center center / 80% !important;
  color: #777 !important;
}
</style>