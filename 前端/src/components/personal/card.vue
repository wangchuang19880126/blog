<template>
  <div id="card">
    <div id="wrap">
      <ul>
        <li v-for="(item,index) in card.arr" :key="index">
          <img :src="item.src" alt>
          <img :src="item.url" alt class="back">
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      card: []
    };
  },
  mounted() {
    class Card {
      constructor(opt) {
        this.ul = document.querySelector(opt.ele);
        this.arr = [];
        this.newArr = [];
        this.init();
        this.ul.addEventListener("click", e => this.show(e));
      }
      init() {
        let url = "../../../static/images/cards/back1.jpg";
        let count = 0;
        for (let i = 0; i < 8; i++) {
          this.arr.push({
            url,
            mark: count++,
            src: `../../../static/images/cards/modle${count - 1}.jpg`
          });
        }
        this.random();
      }
      random() {
        this.arr = [...this.arr, ...this.arr];
        this.arr.sort((a, b) => Math.random() - 0.5);
      }
      show(e) {
        let target = e.target || e.srcElement;
        if (target.className !== "back") return;
        this.arr.forEach((item, index) => {
          if (target.parentNode === this.ul.children[index]) {
            this.animation(
              target,
              {
                top: 73,
                left: 73
              },
              1000,
              () => {
                this.newArr.push({
                  flag: target,
                  mark: this.arr[index].mark
                });
                if (this.newArr.length !== 2) return;
                let bool = this.newArr[0].mark === this.newArr[1].mark;
                if (!bool) {
                  this.newArr.forEach((v, i) => {
                    this.animation(
                      v.flag,
                      {
                        top: 0,
                        left: 0
                      },
                      1000
                    );
                  });
                }
                this.newArr = [];
              }
            );
          }
        });
      }
      animation(ele, obj = {}, time = 500, cb = () => {}) {
        // function animation(ele, obj = {}, time = 500, cb = () => {}) {
        var startValue = {};
        var changeValue = {};
        var firstTime = new Date();
        var val = getStyle(ele);
        // console.log(isNaN(parseFloat(val[key])))
        for (var key in obj) {
          startValue[key] = Number.isNaN(parseFloat(val[key]))
            ? 0
            : parseFloat(val[key]);
          changeValue[key] = parseFloat(obj[key]) - startValue[key];
        }
        calculation();
        function calculation() {
          window.requestAnimationFrame =
            window.requestAnimationFrame ||
            function(sb) {
              return setTimeout(sb, 1000 / 60);
            };
          var nowTime = new Date() - firstTime;
          var scale = nowTime / time;
          if (scale >= 1) {
            scale = 1;
          } else {
            requestAnimationFrame(calculation);
          }
          for (var key in obj) {
            ele.style[key] = startValue[key] + changeValue[key] * scale + "px";
          }
          if (scale === 1) {
            cb && cb();
          }
        }
        //兼容获取内部css函数
        function getStyle(ele) {
          return ele.currentStyle || getComputedStyle(ele);
        }
      }
    }
    this.card = new Card({
      ele: "#card ul"
    });
  }
};
</script>
<style lang="less" scoped>
#card {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: skyblue;
  #wrap {
    width: 340px;
    height: 340px;
    margin: 100px auto;
    ul {
      width: 100%;
      height: 100%;
      li {
        position: relative;
        float: left;
        height: 73px;
        width: 73px;
        cursor: pointer;
        box-shadow: 5px 5px rgba(0, 0, 0, 0.5);
        overflow: hidden;
        border-radius: 10px;
        margin-left: 10px;
        margin-top: 10px;
        img {
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }
  }

  //   ul li span {
  //     display: none;
  //   }
}
</style>