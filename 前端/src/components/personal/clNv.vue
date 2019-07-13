<template>
  <div id="clock">
    <div class="clock">
      <div class="cir">
        <div id="hour"></div>
        <div id="min"></div>
        <div id="ss"></div>
      </div>
      <ul id="time"></ul>
      <ol id="ol"></ol>
    </div>
  </div>
</template>
<script>
// !(function() {})();
export default {
  mounted() {
    const oTime = document.getElementById("time");
    const oL = document.getElementById("ol");
    const aLi = oL.querySelectorAll("li");
    const Hh = document.getElementById("hour");
    const Mm = document.getElementById("min");
    const Ss = document.getElementById("ss");
    // (oTime.style.width = "290px"), (oTime.style.height = "300px");
    let str = "";
    let num = "";

    const clock = () => {
      for (let i = 0; i < 60; i++) {
        let flag = i * 5;
        str += `<li class="${flag ? "" : "on"}" style="transform: rotate(${(flag
          ? 6
          : 30) * i}deg)"></li>`;
      }
      oTime.innerHTML = str;
      for (let i = 0; i < 12; i++) {
        num += `<li style="transform: rotate(${i * 30}deg)">${i ? i : 12}</li>`;
      }
      oL.innerHTML = num;
    };

    const time = () => {
      let d = new Date();
      let ss = d.getSeconds();
      let mm = d.getMinutes() + ss / 60;
      let hh = d.getHours() + mm / 60;

      Hh.style.transform = `rotate(${hh * 30}deg)`;
      Mm.style.transform = `rotate(${mm * 6}deg)`;
      Ss.style.transform = `rotate(${ss * 6}deg)`;
    };

    clock();
    time();
    setInterval(time, 1000);
  }
};
</script>
<style  scope lang="less">
#clock {
  float: left;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .clock {
    position: relative;
    width: 340px;
    height: 340px;
    margin: 50px auto;
    border: 20px solid skyblue;
    border-radius: 50%;
    box-shadow: inset 1px 1px 40px #000;
    background: #ccc;
  }
  .clock * {
    position: absolute;
  }
  .cir {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #000;
    #hour {
      left: calc(20px / 2 - 10px / 2);
      bottom: 0;
      transform-origin: center 70px;
      width: 10px;
      height: 80px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 10px;
    }
    #min {
      left: calc(20px / 2 - 7px / 2);
      bottom: 0;
      transform-origin: center 100px;
      width: 7px;
      height: 110px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 15%;
    }
    #ss {
      bottom: 0;
      left: calc(20px / 2 - 5px / 2);
      transform-origin: center 115px;
      width: 5px;
      height: 120px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 20px;
    }
  }
  #time {
    left: calc(300px / 2 - 290px / 2);
    top: calc(290px / 2 - 290px / 2);
    width: 290px;
    height: 300px;
    li {
      left: calc(290px / 2 - 5px / 2);
      top: 0;
      width: 5px;
      height: 10px;
      transform-origin: center 150px;
      background: skyblue;
    }
    li.on {
      left: calc(290px / 2 - 8px / 2);
      top: 0;
      width: 8px;
      height: 20px;
    }
  }
  #ol {
    left: calc(300px / 2 - 270px / 2);
    top: calc(310px / 2 - 270px / 2);
    width: 270px;
    height: 270px;
    li {
      top: 0;
      left: calc(270px / 2 - 15px / 2);
      transform-origin: center 130px;
      width: 15px;
      height: 15px;
      text-align: center;
      font-size: 14px;
      line-height: 15px;
    }
  }
}
</style>