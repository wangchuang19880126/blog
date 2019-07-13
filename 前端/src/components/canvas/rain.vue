<template>
  <div id="rain">
    <canvas ref="cx1"></canvas>
    <canvas ref="cx2"></canvas>
    <canvas ref="cx3"></canvas>
    <audio src="../../../static/audio/10360.mp3" ref="audio"></audio>
  </div>
</template>
<script>
export default {
  mounted() {
    //   console.log(this.$refs.audio)
    window.addEventListener("blur", () => {
      this.$refs.audio.pause();
    });
    let that = this;
    const res = {
      init() {
        this.audio = that.$refs.audio;
        this.ctx_x = that.$refs.cx1.getContext("2d");
        this.ctx_y = that.$refs.cx2.getContext("2d");
        this.ctx_z = that.$refs.cx3.getContext("2d");
        this.bool = true;
        this.resize();
        this.arr_x = [];
        this.arr_y = [];
        this.arr_z = [];
        this.max_num = 500;
        window.addEventListener("resize", this.resize.bind(this));
        this.animation();
        this.fn();
        // document.addEventListener("click", (e) => {
        //   if (this.bool) {
        //     cancelAnimationFrame(this.time);
        //     clearInterval(this.timer);
        //   } else {
        //     cancelAnimationFrame(this.time);
        //     clearInterval(this.timer);
        //     this.animation();
        //     this.fn();
        //   }
        //   this.bool = !this.bool;
        // });
      },
      resize() {
        this.max_w = that.$refs.cx1.offsetWidth;
        this.max_h = that.$refs.cx1.offsetHeight;
        that.$refs.cx1.width = that.$refs.cx2.width = that.$refs.cx3.width = this.max_w;
        that.$refs.cx1.height = that.$refs.cx2.height = that.$refs.cx3.height = this.max_h;
      },
      animation() {
        this.clear();
        this.clearArr();
        this.addArr_x();
        this.addArr_y();
        this.time = requestAnimationFrame(this.animation.bind(this));
      },
      addArr_x() {
        this.arr_x.push({
          x: this.random(0, this.max_w),
          y: this.random(0, this.max_h),
          len: Math.floor(this.random(0, 800)),
          opacity: this.random(0, 1) * 0.08,
          xs: this.random(-2, 2),
          ys: this.random(10, 20),
          speed: 25
        });
        this.draw_x();
      },

      addArr_y() {
        this.arr_y.push({
          x: this.random(0, this.max_w),
          y: this.random(0, this.max_h),
          l: Math.random(),
          xs: Math.random() * 4 - 2,
          ys: Math.random() * 10 + 15,
          speed: 25
        });
        this.draw_y();
      },

      addArr_z() {
        let x = this.random(100, this.max_w - 100);
        let y = this.random(0, this.max_h / 4);
        for (let i = 0; i < this.random(2, 4); i++) {
          this.arr_z.push({
            x,
            y,
            xRange: this.random(5, 30),
            yRange: this.random(10, 45),
            path: [
              {
                x,
                y
              }
            ]
            // pathLimite: this.random(30, 40)
          });
        }
        this.draw_z();
      },

      draw_x() {
        this.arr_x.forEach(item => {
          if (item.y >= this.max_h) item.y = -item.y - item.len;
          this.ctx_x.beginPath();
          let bg = this.ctx_x.createLinearGradient(
            0,
            item.y,
            0,
            item.y + item.ys
          );
          bg.addColorStop(0, "rgba(255,255,255,0)");
          bg.addColorStop(1, `rgba(255,255,255,${item.opacity})`);
          this.ctx_x.fillStyle = bg;
          this.ctx_x.fillRect(item.x, item.y, 1, item.len);
          item.y += item.speed;
        });
      },

      draw_y() {
        this.arr_y.forEach(item => {
          if (item.y >= this.max_h) item.y = 0;
          this.ctx_y.beginPath();
          this.ctx_y.lineWidth = 1;
          this.ctx_y.strokeStyle = "rgba(174,194,224,0.5)";
          this.ctx_y.lineCap = "round";
          this.ctx_y.moveTo(item.x, item.y);
          this.ctx_y.lineTo(
            item.x + item.xs * item.l,
            item.y + item.ys * item.l
          );
          this.ctx_y.stroke();
          item.y += item.speed;
        });
      },

      draw_z() {
        this.arr_z.forEach(item => {
          for (let i = 0; i < this.random(20, 40); i++) {
            item.path.push({
              x:
                item.path[item.path.length - 1].x +
                this.random(0, item.xRange) -
                item.xRange / 2,
              y: item.path[item.path.length - 1].y + this.random(0, item.yRange)
            });
          }
          this.ctx_z.strokeStyle = "rgba(255,255,255,0.8)";
          this.ctx_z.lineWidth = this.random(1, 4);
          this.ctx_z.beginPath();
          this.ctx_z.moveTo(item.x, item.y);
          item.path.forEach(v => {
            this.ctx_z.lineTo(v.x, v.y);
          });
          this.ctx_z.stroke();
        });
      },

      clear() {
        this.ctx_x.clearRect(0, 0, this.max_w, this.max_h);
        this.ctx_y.clearRect(0, 0, this.max_w, this.max_h);
        this.ctx_z.fillStyle = "rgba(0,0,0,0.1)";
        this.ctx_z.fillRect(0, 0, this.max_w, this.max_h);
      },

      clearArr() {
        if (this.arr_x.length >= this.max_num) this.arr_x.shift();
        if (this.arr_y.length >= this.max_num) this.arr_y.shift();
        if (this.arr_z.length) this.arr_z.splice(0);
      },

      random(min, max) {
        return Math.random() * (max - min + 1) + min;
      },
      timer: null,
      time: null,
      fn() {
        this.timer = setInterval(() => {
          //   this.audio.play();
          this.addArr_z();
        }, this.random(3000, 3500));
      }
    };
    res.init();
  }
};
</script>
<style lang="less" scope>
#rain {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  canvas:nth-child(1) {
    z-index: 100;
  }

  canvas:nth-child(2) {
    z-index: 50;
  }

  canvas:nth-child(3) {
    z-index: 10;
  }
}
</style>