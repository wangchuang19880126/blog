<template>
  <div id="geyser">
    <canvas ref="ccc"></canvas>
  </div>
</template>
<script>
export default {
  mounted() {
    let that = this;
    const res = {
      init() {
        this.canvas = that.$refs.ccc;
        this.ctx = this.canvas.getContext("2d");
        this.letters = "△■★▶◀◁▷☆□◇○▽△※∷♫♬♪♩〼◎¤۞〓▬◪";
        this.arr = [];
        this.maxNum = 550;
        this.resize();
        window.addEventListener("resize", this.resize.bind(this));
        this.animate();
        // document.addEventListener("click", () => {
        //   if (this.bool) {
        //     cancelAnimationFrame(this.timer);
        //     this.timer = null;
        //   } else {
        //     this.animate();
        //   }
        //   this.bool = !this.bool;
        // });
      },
      timer: null,
      bool: true,
      resize() {
        this.max_w = this.canvas.width = this.canvas.offsetWidth;
        this.max_h = this.canvas.height = this.canvas.offsetHeight;
      },
      animate() {
        this.addArr();
        this.fade();
        this.clearArr();
        this.timer = requestAnimationFrame(this.animate.bind(this));
      },
      addArr() {
        this.arr.push({
          x: this.max_w / 2,
          y: this.max_h,
          speed_x: Math.random() * 10 - 5,
          speed_y: -Math.random() * 20,
          color: [150, 205, 67, 0.8],
          font: this.letters[Math.floor(Math.random() * this.letters.length)]
        });
        this.draw();
      },
      draw() {
        this.arr.forEach(item => {
          this.ctx.fillStyle = `hsla(${item.color[0]},${item.color[1]}%,${
            item.color[2]
          }%,${item.color[3]})`;
          this.ctx.fillText(item.font, item.x, item.y);
          item.speed_y *= 0.99;
          item.x += item.speed_x;
          item.y += item.speed_y;
          item.color[0] += 1;
          item.color[2] *= 0.99;
        });
        // console.log(this.arr);
      },
      fade() {
        this.ctx.fillStyle = "rgba(0,0,0,0.08)";
        this.ctx.fillRect(0, 0, this.max_w, this.max_h);
      },
      clearArr() {
        if (this.arr.length > this.maxNum) this.arr.shift();
      }
    };
    res.init();
  }
};
</script>
<style lang="less" scope>
#geyser {
  width: 100%;
  height: 100%;
  background-color: #000;
  canvas {
    width: 100%;
    height: 100%;
    background-color: #000;
  }
}
</style>