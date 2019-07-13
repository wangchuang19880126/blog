<template>
  <div id="flowerblash">
    <canvas ref="cvsx"></canvas>
  </div>
</template>
<script>
export default {
  mounted() {
    let that = this;
    const res = {
      init() {
        this.ele = document.querySelector("#flowerblash canvas")
        this.ctx = this.ele.getContext("2d");
        this.resize();
        this.maxNum = 500;
        this.arr = [];
        this.hue = 200;
        this.flower = null;
        window.addEventListener("resize", this.resize.bind(this));
        this.ele.addEventListener("click", () => {
          this.hue += 20;
          this.resize();
        });
        this.each();
        this.animation();
      },
      resize() {
        this.arr = [];
        this.max_w = this.ele.width = this.ele.offsetWidth
        this.max_h = this.ele.height = this.ele.offsetHeight;
        this.each();
      },
      animation() {
        this.arr.forEach(item => {
          item.step();
          item.draw(this.ctx);
        });
        requestAnimationFrame(this.animation.bind(this));
      },
      each() {
        for (let i = 0; i < this.maxNum; i++) {
          this.tool();
          this.arr.push(this.flower);
        }
      },
      tool() {
        class Flower {
          constructor(opt) {
            let dis = 15;
            this.x = opt.x + this.random(-dis, dis);
            this.y = opt.y + this.random(-dis, dis);
            this.hue = opt.hue === undefined ? 200 : opt.hue;
            this.speed =
              opt.speed === undefined ? this.random(-4, 4) : opt.speed;
            this.angle =
              opt.angle === undefined ? this.random(0, Math.PI) : opt.angle;
            this.ctx = opt.ctx;
            this.spread = 0;
            this.life = 1; //移动花卉衰减系数
            this.deacy = 0.005; //衰减系数
            this.dead = false; //是否静止
            this.point = [
              {
                x: this.x,
                y: this.y
              }
            ];
          }
          step() {
            this.life -= this.deacy;
            if (this.life <= 0) {
              this.dead = true;
            }
            if (!this.dead) {
              let len = this.point.length;
              this.point.push({
                x: this.point[len - 1].x + Math.cos(this.angle) * this.speed,
                y: this.point[len - 1].y + Math.sin(this.angle) * this.speed
              });
              this.speed *= 0.99;
              this.spread = this.speed * 0.04;
              this.angle -= this.random(-this.spread, this.spread);
              this.spread = this.speed * 0.04;
              this.hue += 0.3;
            } else {
              this.point.splice(0);
            }
          }
          draw() {
            if (this.dead || !this.point.length) return;
            let len = this.point.length;
            let point = this.point[len - 1];
            let lastPoint = this.point[len - Math.floor(this.random(5, 500))];
            if (lastPoint) {
              let alpha = this.life * 0.75;
              let mychar = 2 + this.life * 6;
              this.ctx.beginPath();
              this.ctx.strokeStyle = `hsla(${this.hue +
                this.random(-10, 10)}, 70%, 40%, ${alpha})`;
              this.ctx.moveTo(lastPoint.x, lastPoint.y);
              this.ctx.lineTo(
                point.x + this.random(-mychar, mychar),
                point.y + this.random(-mychar, mychar)
              );
              this.ctx.stroke();
            }
          }
          random(min, max) {
            return Math.random() * (max - min) + min;
          }
        }
        this.flower = new Flower({
          x: this.max_w / 2,
          y: this.max_h / 2,
          hue: this.hue,
          ctx: this.ctx
        });
      }
    };
    res.init();
  }
};
</script>
<style lang="less" scope>
#flowerblash {
  width: 100%;
  height: 100%;
  background-color: #000;
  canvas {
    width: 100%;
    height: 100%;
  }
}
</style>