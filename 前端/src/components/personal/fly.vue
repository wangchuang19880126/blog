<template>
  <div id="fly">
    <div id="wrapper"></div>
  </div>
</template>
<script>
export default {
  data() {
      return{

      }
  },
  mounted() {
    const animation = (ele, obj = {}, time = 500, cb = () => {}) => {
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
    let wrapper = document.getElementById("wrapper");
    // console.log(wrapper)
    let arr = [];
    let count = 0;
    for (let i = 0; i < 100; i++) {
      arr[i] = i;
    }
    arr.sort((a, b) => Math.random() - 0.5);
    let len = arr.length;
    // console.log(arr);
    function run() {
      if (count > len - 1) {
        return;
      }
      wrapper.innerHTML += `<div class="on"></div>`;
      let div = wrapper.getElementsByTagName("div");
        // div.style.width="40px"
        // div.style = "width:40px;height:40px"
        // console.log(getComputedStyle(div[count]).width)
      let Top =
        Math.floor(arr[count] / 10) * 40
      let Left =
        Math.floor(arr[count] % 10) * 40
      div[
          count
      ].style = `width:40px;height:40px;position:absolute;background: url("../../../static/images/fly/x.jpg") no-repeat  -${Left}px -${Top}px/400px 400px;`;
        // console.log(div[count])
      animation(
        div[count],
        {
          top: Top,
          left: Left
        },
        50,
        () => {
          count++;
          requestAnimationFrame(run);
        }
      );
    }
    run();
  }
};
</script>
<style lang="less" scoped>
#fly {
  width: 100%;
  height: 100%;
  background-color: skyblue;
  overflow: hidden;
  #wrapper {
    position: relative;
    margin: 100px auto;
    width: 400px;
    height: 400px;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid;
    background-color: rgba(0,0,0,0.4);
    div.on {
      position: absolute;
      width: 40px;
      height: 40px;
    }
  }
}
</style>