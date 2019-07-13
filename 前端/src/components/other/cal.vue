<template>
  <div id="calendar">
    <!-- <div class="content"> -->
    <Calendar
      ref="Calendar"
      :markDateMore="arr"
      :markDate="arr2"
      v-on:isToday="clickToday"
      agoDayHide="1530115221"
      v-on:choseDay="clickDay"
      v-on:changeMonth="changeDate"
    ></Calendar>
  </div>
</template>

<script>
import Calendar from "vue-calendar-component";
export default {
  data() {
    return {
      // arr2: ['2018/6/23'],
      arr2: [],
      arr: []
    };
  },
  components: {
    Calendar
  },
  created() {
    console.log(22222222222222)
  },
  methods: {
    clickDay(data) {
      console.log("选中了", data); //选中某天
    },
    clickToday(data) {
      console.log("跳到了本月今天", data); //跳到了本月
    },
    changeDate(data) {
      console.log("左右点击切换月份", data); //左右点击切换月份
    },
    demo() {
      this.$refs.Calendar.ChoseMonth("2018-12-13"); //跳到12月12日选中12月12日
    }
  },
  created() {
    function format(date, index) {
      date = new Date(date);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${index}`;
    }
    // setTimeout(() => {
    //   this.arr.push({
    //     date: format(new Date(), 15),
    //     className: "mark1"
    //   });
    // }, 300);
  }
};
</script>
<style scoped>
.wh_container >>> .mark1 {
  /* background: url("../../../assets/1.png") no-repeat left top /cover */
}

.wh_container >>> .mark2 {
  background-color: blue;
}
.wh_content_item > .wh_isMark {
  background: orange;
}
.wh_container >>> .wh_content_all {
  background-color: #fff;
  /* color:#333; */
}
.wh_container >>> .wh_content_item {
  color: #333;
}
.wh_container >>> .wh_content_li {
  color: #333;
}
.wh_container >>> .wh_item_date,
.wh_isToday {
  background-color: #fff;
}
</style>