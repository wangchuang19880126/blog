<template>
  <div id="threeD" @mousedown="rotate($event)">
    <div class="wrapper">
      <div class="box">
        <img src="../../../static/images/img/1.png" class="pic" alt>
        <img src="../../../static/images/img/2.png" class="pic" alt>
        <img src="../../../static/images/img/3.png" class="pic" alt>
        <img src="../../../static/images/img/4.png" class="pic" alt>
        <img src="../../../static/images/img/5.png" class="pic" alt>
        <img src="../../../static/images/img/6.png" class="pic" alt>
        <img src="../../../static/images/img/1.png" class="pic" alt>
        <img src="../../../static/images/img/3.png" class="pic" alt>
        <img src="../../../static/images/img/4.png" class="pic" alt>
        <img src="../../../static/images/img/5.png" class="pic" alt>
        <img src="../../../static/images/img/6.png" class="pic" alt>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      time: null,
      rox: -10,
      roy: 0
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    rotate(e) {
      this.last_x = e.clientX;
      this.last_y = e.clientY;
      clearInterval(this.time);
      const fn = e => {
        this.now_x = e.clientX;
        this.now_y = e.clientY;
        this.dis_x = this.now_x - this.last_x;
        this.dis_y = this.now_y - this.last_y;
        this.roy += this.dis_x * 0.2;
        this.rox -= this.dis_y * 0.2;
        this.oWrap.style = `transform:rotateX(${this.rox}deg)
        rotateY(${this.roy}deg);cursor:move`;
        this.last_x = this.now_x;
        this.last_y = this.now_y;
      };
      document.addEventListener("mousemove", fn);
      document.addEventListener("mouseup", e => {
        document.removeEventListener("mousemove", fn);
        clearInterval(this.time);
        this.time = setInterval(() => {
          this.dis_x *= 0.98;
          this.dis_y *= 0.98;
          this.roy += this.dis_x * 0.2;
          this.rox -= this.dis_y * 0.2;
          this.oWrap.style = `
            transform: rotateX(${this.rox}deg) rotateY(${this.roy}deg);
                    cursor: pointer;
            `;
          if (Math.abs(this.dis_x) < 0.1 && Math.abs(this.dis_y) < 0.1) {
            clearInterval(this.time);
          }
        }, 20);
      });
        e.preventDefault();
        
    },
    init() {
      this.threeD = document.getElementById("threeD");
      this.oWrap = document.getElementsByClassName("box")[0];
      this.oImg = [...document.getElementsByClassName("pic")];
      this.len = this.oImg.length;
      this.deg = 360 / this.len;
      this.oImg.forEach((item, index) => {
        item.style = `transform:rotateY(${index *
          this.deg}deg) translateZ(350px);
      transition: transform 1s ${(this.len - 1 - index) * 0.1}s`;
      });
    }
  },
};
</script>
<style lang="less" scoped>
#threeD {
  user-select: none;
  width: 100%;
  height: 100%;
  background: -webkit-radial-gradient(
    center center,
    600px 600px,
    rgba(244, 23, 234, 0.2),
    rgba(0, 0, 0, 0)
  );
  background-color: #000;
  overflow: hidden;
  .wrapper {
    perspective: 800px;
    .box {
      width: 100px;
      height: 160px;
      margin: 150px auto;
      position: relative;
      transform-style: preserve-3d;
      transform: rotateX(-10deg) rotateY(0deg);
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        transform: rotateY(0deg) translateZ(0px);
        // transition: 2s;
        -webkit-box-reflect: below 5px -webkit-linear-gradient(top, rgba(
                0,
                0,
                0,
                0
              )
              40%, rgba(0, 0, 0, 0.5) 100%);
      }
    }
  }
}
</style>