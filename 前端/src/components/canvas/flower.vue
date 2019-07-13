<template>
  <div id="flower">
    <canvas ref="cvs"></canvas>
  </div>
</template>
<script>

export default {
  mounted() {
    // let that = this;
    class Flower {
      constructor() {
        this.x = 0;
        this.y = 0;
        this.direction = 0;
        this.radius = 0;
        this.dDir = 0;
        this.rightOrLeft = false;
        this.shooted = false;
        this.color = 0;
      }
      //发芽
      shoot(x, y, direction) {
        this.shooted = true;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.dDir = Math.random();
        this.radius = Math.random() * 20 + 5;
        this.rightOrLeft = Math.random() < 0.5;
      }
      //动画
      animation(ctx) {
        //第一次进入
        if (!this.shooted) {
          res.flower = this;
          return;
        }
        this.x += this.radius * Math.cos(this.direction);
        this.y += this.radius * Math.sin(this.direction);
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        this.radius -= 0.4;
        this.direction -= this.rightOrLeft ? this.dDir : -this.dDir;
        if (this.radius <= 0) this.shooted = false;
      }
    }

    const res = {
      init() {
        this.canvas = document.querySelector("#flower canvas")
        this.ctx = this.canvas.getContext("2d");
        this.resize();
        window.addEventListener("resize", this.resize.bind(this));
        this.canvas.addEventListener("mousemove", this.move.bind(this));
        this.play();
        this.start();
      },
      resize() {
        this.max_w = this.canvas.width = this.canvas.offsetWidth;
        this.max_h = this.canvas.height = this.canvas.offsetHeight;
        console.log(this.canvas.offsetHeight)
      },
      x: 0,
      y: 0,
      xb: 0,
      yb: 0,
      flower: null,
      count: 0,
      arr: [],
      move(e) {
        this.x = e.clientX;
        this.y = e.clientY;
        this.shoot(this.x, this.y);
      },
      shoot(x, y) {
        //第一次进入自动生成花卉
        // if (!this.flower) {
        this.flower = new Flower();
        // this.flower.color = this.randomColor()
        this.flower.color = `hsl(${Math.floor(Math.random() * 90) -
          (Math.random() > 0.33 ? 30 : 160)},80%,60%)`;
        this.arr.push(this.flower);
        // }
        // 移动鼠标生成花卉，移动3次覆盖一个层
        this.count++;
        if (!(this.count % 3)) {
          this.cover();
        }

        //鼠标移动是改变坐标
        // Math.atan(y/x)角度，y/x是斜率
        // Math.atan2(y,x) ==弧度返回x轴到（x，y）之间的角度
        this.flower.shoot(x, y, Math.atan2(y - this.yb, x - this.xb));
        // this.flower = null
        this.xb = x;
        this.yb = y;
      },
      cover() {
        this.ctx.fillStyle = "rgba(0,0,0,0.1)";
        this.ctx.fillRect(0, 0, this.max_w, this.max_h);
      },
      play() {
        if (this.arr.length > 500) this.arr.shift();
        this.arr.forEach(item => {
          item.animation(this.ctx);
        });
        requestAnimationFrame(this.play.bind(this));
      },
      start() {
        for (let i = 0; i < 2 * Math.PI; i += 0.1) {
          this.shoot(
            this.max_w / 2 + Math.cos(i) * this.max_w * 0.25,
            this.max_h / 2 + Math.sin(i) * this.max_h * 0.25
          );
        }
      },
      randomColor() {
        let str = "#";
        for (let i = 0; i < 6; i++) {
          str += Math.floor(Math.random() * 16).toString(16);
        }
        return str;
      }
    };
    res.init();
  }
};
</script>
<style lang="less" scope>
#flower {
  width: 100%;
  height: 100%;
  canvas {
    width: 100%;
    height: 100%;
    cursor:crosshair;
  }
}
</style>