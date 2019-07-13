<template>
  <div id="test">
    <div id="box" ondragstart="return false">
      <img src="../../../static/images/test/1.png" id="img1">
      <img src="../../../static/images/test/1.png" id="img2">
      <div id="clip" class="clip">
        <!-- 中划线（连词符）   烤串命名法 -->
        <div class="LeftTop"></div>
        <div class="RightTop"></div>
        <div class="RightBottom"></div>
        <div class="LeftBottom"></div>
        <div class="top"></div>
        <div class="right"></div>
        <div class="bottom"></div>
        <div class="left"></div>
      </div>
    </div>
    <div id="box2">
      <img src="../../../static/images/test/1.png" alt id="img3">
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    const { max, min } = Math;
    const clip = document.getElementById("clip")
    const box = document.getElementById("box")
    const img2 = document.getElementById("img2")
    const img3 = document.getElementById("img3")
    document.onmousedown = function(e) {
      // down时 mouse 的坐标
      let down_x = e.clientX;
      let down_y = e.clientY;

      // 代理事件 一定需要的就是 事件源
      const that = e.target;
      // 宽高
      let down_clip_width = clip.offsetWidth;
      let down_clip_height = clip.offsetHeight;
      // 定位
      let down_clip_top = clip.offsetTop;
      let down_clip_left = clip.offsetLeft;
      // 父盒子的宽高（因为不能移动超出父级边界）
      let down_box_width = box.offsetWidth;
      let down_box_height = box.offsetHeight;
      // 接下来开始移动
      document.onmousemove = function(e) {
        // 移动时 鼠标坐标距离起始时的差值（变化量）
        let x_ = e.clientX - down_x;
        let y_ = e.clientY - down_y;

        switch (that.className) {
          case "clip":
            // 拖动？   鼠标坐标变化量 + 初始被拖动物体top、left
            let top = y_ + down_clip_top;
            let left = x_ + down_clip_left;
            // 限制边界
            top = max(0, top);
            top = min(down_box_height - down_clip_height, top);

            left = max(0, left);
            left = min(down_box_width - down_clip_width, left);

            that.style.left = left + "px";
            that.style.top = top + "px";
            break;

          case "top":
            // console.log("当前down下的对象是top")
            y_ = max(y_, -down_clip_top);
            y_ = min(y_, down_clip_height - 100);

            clip.style.height = down_clip_height - y_ + "px";
            clip.style.top = down_clip_top + y_ + "px";

            break;

          case "right":
            // console.log("当前down下的对象是right")
            x_ = max(x_, 100 - down_clip_width);
            x_ = min(x_, down_box_width - down_clip_width - down_clip_left);

            clip.style.width = down_clip_width + x_ + "px";
            break;

          case "bottom":
            // console.log("当前down下的对象是bot")
            y_ = max(y_, 100 - down_clip_height);
            y_ = min(y_, down_box_height - down_clip_height - down_clip_top);

            clip.style.height = down_clip_height + y_ + "px";
            break;

          case "left":
            // console.log("当前down下的对象是left")
            x_ = max(x_, -down_clip_left);
            x_ = min(x_, down_clip_width - 100);

            clip.style.width = down_clip_width - x_ + "px";
            clip.style.left = down_clip_left + x_ + "px";

            break;

          case "LeftTop":
            // console.log("当前down下的对象是LeftTop")
            x_ = max(x_, -down_clip_left);
            x_ = min(x_, down_clip_width - 100);

            clip.style.width = down_clip_width - x_ + "px";
            clip.style.left = down_clip_left + x_ + "px";

            y_ = max(y_, -down_clip_top);
            y_ = min(y_, down_clip_height - 100);

            clip.style.height = down_clip_height - y_ + "px";
            clip.style.top = down_clip_top + y_ + "px";

            break;

          case "RightTop":
            // console.log("当前down下的对象是r-t")
            y_ = max(y_, -down_clip_top);
            y_ = min(y_, down_clip_height - 100);

            clip.style.height = down_clip_height - y_ + "px";
            clip.style.top = down_clip_top + y_ + "px";

            x_ = max(x_, 100 - down_clip_width);
            x_ = min(x_, down_box_width - down_clip_width - down_clip_left);

            clip.style.width = down_clip_width + x_ + "px";
            break;

          case "RightBottom":
            // console.log("当前down下的对象是r-b")
            x_ = max(x_, 100 - down_clip_width);
            x_ = min(x_, down_box_width - down_clip_width - down_clip_left);

            clip.style.width = down_clip_width + x_ + "px";

            y_ = max(y_, 100 - down_clip_height);
            y_ = min(y_, down_box_height - down_clip_height - down_clip_top);

            clip.style.height = down_clip_height + y_ + "px";
            break;

          case "LeftBottom":
            // console.log("当前down下的对象是l-b")
            y_ = max(y_, 100 - down_clip_height);
            y_ = min(y_, down_box_height - down_clip_height - down_clip_top);

            clip.style.height = down_clip_height + y_ + "px";

            x_ = max(x_, -down_clip_left);
            x_ = min(x_, down_clip_width - 100);

            clip.style.width = down_clip_width - x_ + "px";
            clip.style.left = down_clip_left + x_ + "px";

            break;
          // 没有default
        }
        // 在这里赋值 第二个图片的
        const clipTop = clip.offsetTop;
        const clipLeft = clip.offsetLeft;
        const clipWidth = clip.offsetWidth;
        const clipHeight = clip.offsetHeight;

        img2.style.clip = `rect(${clipTop}px, ${clipLeft +
          clipWidth}px, ${clipHeight + clipTop}px, ${clipLeft}px)`;

        img3.style.clip = `rect(${clipTop}px, ${clipLeft +
          clipWidth}px, ${clipHeight + clipTop}px, ${clipLeft}px)`;

        img3.style.top = -clipTop + "px";
        img3.style.left = -clipLeft + "px";
      };
    };

    document.onmouseup = function() {
      this.onmousemove = null;
    };
  }
};
</script>
<style  lang="less" scoped>
#test {
  width: 100%;
  background: #333;
  user-select: none;
  height: 100%;
  .clearfix::after {
    content: "";
    display: block;
    clear: both;
  }
  [id*="box"] {
    position: relative;
    width: 450px;
    height: 450px;
    margin: 10px 1px;
    float: left;
  }
  [id*="img"] {
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
  }
  #img1 {
    opacity: 0.2;

    filter: alpha(opacity=20);
  }
  #img2 {
    clip: rect(0px, 100px, 100px, 0px);
  }
  #img3 {
    top: 0;
    left: 0;
    clip: rect(0px, 100px, 100px, 0px);
  }
  #clip {
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 100px;
    border: 1px solid white;
    box-sizing: border-box;
    cursor: move;
    z-index: 3;
    background: url("../../../static/images/test/2.png");
  }
  #clip > div {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: white;
  }
  #clip > .LeftTop {
    top: -5px;
    left: -5px;
    cursor: nw-resize;
  }
  #clip > .RightTop {
    top: -5px;
    right: -5px;
    cursor: ne-resize;
  }
  #clip > .RightBottom {
    bottom: -5px;
    right: -5px;
    cursor: se-resize;
  }
  #clip > .LeftBottom {
    bottom: -5px;
    left: -5px;
    cursor: sw-resize;
  }
  #clip > .top {
    top: -5px;
    left: 50%;
    cursor: n-resize;
    margin-left: -5px;
  }
  #clip > .right {
    right: -5px;
    top: 50%;
    cursor: e-resize;
    margin-top: -5px;
  }
  #clip > .bottom {
    bottom: -5px;
    left: 50%;
    cursor: s-resize;
    margin-left: -5px;
  }
  #clip > .left {
    left: -5px;
    top: 50%;
    cursor: w-resize;
    margin-top: -5px;
  }
}
</style>