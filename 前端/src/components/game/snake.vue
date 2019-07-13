<template>
  <div id="snake"></div>
</template>
<script>
export default {
  mounted() {
    function Snake(opt) {
      this.map = document.querySelector(opt.ele);
      this.wrap = document.createElement("div");
      this.wrap.className = "wrap";
      this.map.appendChild(this.wrap);
      this.max_x = this.wrap.offsetWidth;
      this.max_y = this.wrap.offsetHeight;
      this.width = 20;
      this.height = 20;
      this.direction = "right";
      this.foodBox = null;
      //设置坐标
      this.arr = [
        [2, 0, null, "head"],
        [1, 0, null, "body"],
        [0, 0, null, "body"]
      ];
      this;
    }
    Snake.prototype = {
      constuctor: Snake,
      init() {
        this.direction = "right";
        this.foodBox = null;
        //设置坐标
        this.arr = [
          [2, 0, null, "head"],
          [1, 0, null, "body"],
          [0, 0, null, "body"]
        ];
        this.time = null;
        this.createSnakeBody();
        this.createFood();
        this.interval();
        document.addEventListener("keydown", e => this.change(e));
      },
      change(e) {
        e.preventDefault();
        if (e.keyCode === 37 && this.direction !== "right")
          this.direction = "left";
        if (e.keyCode === 38 && this.direction !== "down")
          this.direction = "up";
        if (e.keyCode === 39 && this.direction !== "left")
          this.direction = "right";
        if (e.keyCode === 40 && this.direction !== "up")
          this.direction = "down";
      },
      createSnakeBody() {
        this.arr.forEach((item, index) => {
          if (item[2] === null) {
            item[2] = document.createElement("div");
            item[2].className = item[3];
            this.wrap.appendChild(item[2]);
          }
          item[2].style.cssText = `left:${item[0] * this.width}px;
                                        top:${item[1] * this.height}px
                                                `;
        });
      },
      createFood() {
        this.food = this.range();
        if (this.foodBox === null) this.foodBox = document.createElement("div");
        this.foodBox.style.cssText = `
                            left:${this.food.x * this.width}px;
                            top:${this.food.y * this.height}px;
                            `;
        this.wrap.appendChild(this.foodBox);
      },
      interval() {
        clearInterval(this.time);
        this.time = setInterval(() => {
          this.move();
        }, 300);
      },
      move() {
        for (let len = this.arr.length, i = len - 1; i > 0; i--) {
          this.arr[i][0] = this.arr[i - 1][0];
          this.arr[i][1] = this.arr[i - 1][1];
        }
        // 判断方向
        switch (this.direction) {
          case "right":
            this.arr[0][0]++;
            break;
          case "left":
            this.arr[0][0]--;
            break;
          case "down":
            this.arr[0][1]++;
            break;
          case "up":
            this.arr[0][1]--;
            break;
        }
        this.createSnakeBody();
        //判断吃食物
        if (this.food.x === this.arr[0][0] && this.food.y === this.arr[0][1]) {
          this.arr.push([
            this.arr[this.arr.length - 1][0],
            this.arr[this.arr.length - 1][1],
            null,
            "body"
          ]);
          this.createFood();
        }
        //判断是不吃到自己
        let count = 0;
        let newArr = this.arr[0];
        this.arr.forEach((item, index) => {
          if (newArr[0] === item[0] && newArr[1] === item[1]) {
            count++;
            if (count >= 2) {
              this.arr = [];
              alert("你咬到自己了！Game Over");
              clearInterval(this.time);
            }
          }
        });
        // 判断撞墙
        if (
          newArr[0] >= this.max_x / this.width ||
          newArr[0] < 0 ||
          newArr[1] >= this.max_y / this.height ||
          newArr[1] < 0
        ) {
          clearInterval(this.time);
          alert("撞到墙了！Game Over");
          snake.init;
        }
      },
      range() {
        let obj = {
          x: Math.floor((Math.random() * this.max_x) / this.width),
          y: Math.floor((Math.random() * this.max_y) / this.height)
        };
        this.arr.forEach((item, index) => {
          if (item[0] === obj.x && item[1] === obj.y) {
            this.range();
            console.log("重新生成food");
          }
        });
        return obj;
      }
    };
    this.snake = new Snake({
      ele: "#snake"
    });
    this.snake.init();
  },
  beforeDestroy() { 
    clearInterval(this.snake.time)
  }
};
</script>
<style lang="less">
#snake {
  width: 100%;
  height: 100%;
  // background-color: #fff;
  .wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 800px;
    height: 500px;
    background-color: skyblue;
    overflow: hidden;
    div {
      position: absolute;
      width: 20px;
      height: 20px;
      background-color: green;
    }
    div.head {
      background-color: red;
    }
    div.body {
      background-color: blue;
    }
  }
}
</style>