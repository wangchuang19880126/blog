<template>
  <canvas id="bg" width="1920" height="1080" ref="canvas"></canvas>
</template>

<script>
/* 背景组件 */
export default {
  mounted() {
    class Bg {
      constructor(opt) {
        this.canvas = document.querySelector(opt.ele);
        this.ctx = this.canvas.getContext("2d");
        this.resize();
        this.dots = [];
        this.ctxCount = 200;
        this.sizeMax = 10;
        this.lineWidth = 100;
        window.addEventListener("resize", () => this.resize());
        // 生成球体
        for (var i = 0; i < this.ctxCount; i++) {
          this.dots.push({
            x: rand() * this.canvas.width - 20,
            y: rand() * this.canvas.height,
            // 移动角度
            xa: (rand() * 2 - 1) / 1.5,
            ya: (rand() * 2 - 1) / 1.5,
            // 颜色
            color: this.getRandColor(),
            // 设备像素修复
            size: 3 + rand() * this.sizeMax + (1 % window.devicePixelRatio),
            big: rand() > 0.5 ? rand() * 4 : false,
            kernel: rand() > 0.5
          });
        }
        setInterval(() => {
          this.draw();
        }, 150);
        // 随机数
        function rand() {
          return Math.random();
        }
      }
      resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
      }
      // 绘制函数
      draw() {
        this.resize();
        for (var i = 0; i < this.ctxCount; i++) {
          let dot = this.dots[i];
          dot.x += dot.xa;
          dot.y += dot.ya; // 边缘碰撞检并变色
          if (dot.x > this.canvas.width || dot.x < dot.size / 2) {
            dot.xa *= -1;
            dot.color = this.getRandColor();
          }
          if (dot.y > this.canvas.height || dot.y < dot.size / 2) {
            dot.ya *= -1;
            dot.color = this.getRandColor();
          }
          let color = `${dot.color.r},${dot.color.g},${dot.color.b}`;
          // 连线检测
          for (var j = 0; j < this.ctxCount; j++) {
            let otherDot = this.dots[j];
            let dx = Math.pow(
              Math.pow(dot.x - otherDot.x, 2) + Math.pow(dot.y - otherDot.y, 2),
              0.5
            );
            // 连线
            if (dx <= dot.size + otherDot.size + this.lineWidth) {
              dot.kernel &&
                this.command({
                  beginPath: 1,
                  move: [otherDot.x, otherDot.y],
                  line: [dot.x, dot.y],
                  strokeStyle: [`rgba(${color},0.1)`],
                  stroke: 1
                });
            }
          }
          // 基础圆形
          this.ctx.beginPath();
          this.ctx.fillStyle = `rgba(${color},0.15)`;
          if (this.ctx.fillStyle === "#000000") {
            this.ctx.fillStyle = `rgba(255,255,255,0)`;
          }
          this.ctx.arc(
            dot.x - 0.5,
            dot.y - 0.5,
            dot.size,
            0,
            2 * Math.PI,
            false
          );
          this.ctx.fill();
          // 内部核心
          dot.kernel &&
            this.command({
              beginPath: 1,
              fillStyle: [`rgba(${color},0.25)`],
              arc: [dot.x - 0.5, dot.y - 0.5, dot.size / 2],
              fill: 1
            });
          //大圈
          dot.big &&
            this.command({
              stroke: 1,
              beginPath: 1,
              strokeStyle: [`rgba(${color},0.20)`],
              arc: [dot.x - 0.5, dot.y - 0.5, dot.size * dot.big]
            });
        }
        // requestAnimationFrame(this.draw.bind(this))
      }
      // 随机色
      getRandColor() {
        return {
          r: 25 + Math.random() * 250,
          g: 25 + Math.random() * 250,
          b: 25 + Math.random() * 250
        };
      }
      // 命令绘制模式
      command(commands) {
        let that = this;
        let cmdList = {
          beginPath: () => this.ctx.beginPath(),
          strokeStyle: color => {
            this.ctx.strokeStyle = color;
            if (this.ctx.strokeStyle === "#000000") {
              this.ctx.strokeStyle = `rgba(255,255,255,0)`;
            }
          },
          arc: (x, y, size) => this.ctx.arc(x, y, size, 0, Math.PI * 2, false),
          line: (x, y) => this.ctx.lineTo(x, y),
          move: (x, y) => this.ctx.moveTo(x, y),
          fillStyle: color => {
            this.ctx.fillStyle = color;
            if (this.ctx.fillStyle === "#000000") {
              this.ctx.fillStyle = `rgba(255,255,255,0)`;
            }
          },
          stroke: () => this.ctx.stroke(),
          fill: () => this.ctx.fill()
        };
        for (let cmd in commands) {
          if (cmd in cmdList) {
            if (commands[cmd] !== 1) {
              cmdList[cmd](...commands[cmd]);
            } else {
              cmdList[cmd]();
            }
          }
        }
      }
    }
    let bg = new Bg({
      ele: "#bg"
    });
  }
};
</script>
<style scoped>
#bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -100;
  background-color: #fff;
}
</style>