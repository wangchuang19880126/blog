<template>
  <div id="ctnv" ref="ctnv" style="background-color: rgba(154, 19, 203, 0.18);">
    <div class="player none">
      <div class="top">
        <div class="title">
          <div class="avatar">
            <el-progress
              width="83"
              stroke-width="2"
              type="circle"
              :percentage="scale * 100"
              color="#67C23A"
              status="success"
            ></el-progress>
            <img
              :src="!dataList[idx]? '' :dataList[idx].al.picUrl"
              :class="isTrue ? 'animate':''"
              alt
            >
            <div class="play">
              <span
                class="iconfont"
                @mouseup.stop="transmit()"
                :class="{'icon-zantingtingzhi': !isTrue,'icon-bofang' : isTrue}"
                :title="isTrue ? '点击播放' : '点击暂停'"
              ></span>
            </div>
          </div>
          <span
            class="author"
            :class="isTrue ? 'animation':''"
          >{{!dataList[idx]? "" : dataList[idx].ar[0].name + "--"}}{{!dataList[idx]? "" : dataList[idx].name}}</span>
        </div>
        <span class="startTime">{{start}}</span>
        <span class="time">{{total}}</span>
        <p class="slider">
          <span class="block" :title="start"></span>
          <span class="square"></span>
        </p>
        <div class="button">
          <span
            class="iconfont"
            :class="isIcon ? 'icon-suiji':'icon-liebiaoxunhuan'"
            @click="changeIcon"
            :title="isIcon ? '随机播放' : '列表循环'"
          ></span>
          <span class="iconfont icon-shangyishou" @click="previous()" title="上一首"></span>
          <span class="iconfont icon-xiayishou" @click="next()" title="下一首"></span>
          <span
            class="iconfont "
            :class="{'icon-icon-test':isBool,'icon-jingyin':!isBool}"
            @click="voice"
            :title=" isBool ? '点击静音':'音量'"
          ></span>
        </div>
      </div>
      <ul class="list" ref="list">
        <li
          v-for="(item, index) in dataList"
          :key="index"
          @click="play(item.id,index)"
          :class="{active:index ===  idx}"
          :title="item.name"
        >
          <img v-lazy="item.al.picUrl" alt width="30" height="30">
          <span class="ellipsis">{{item.name}}</span>
          <span>{{item.ar[0].name}}</span>
        </li>
      </ul>
    </div>
    <div class="drag width">
      <audio
        src
        autoplay
        ref="audio"
        class="audio"
        crossorigin="anonymous"
        @timeupdate="update"
        @ended="end"
        @durationchange="duration"
      ></audio>
      <canvas ref="cvs"></canvas>
      <div class="song" behavior="slide">
        <ul :style="`margin-top:-${20*num}px`">
          <li
            v-for="(item,index) in lyric"
            :key="index"
            :class="{info:index===num - 1,color:index===num}"
          >{{item.text}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import vm from "./vm.js";
import DrawAudio from "../../tools/drawCanvas.js";
export default {
  data() {
    return {
      bool: true,
      dataList: [],
      idx: 0,
      flag: 0,
      isTrue: true,
      currentTime: 0,
      totalTime: 0,
      isBool: true,
      res: null,
      lyric: [],
      text: "",
      isIcon: true,
      bg: "",
      num: -1,
      start: 0,
      total: 0,
      scale: 0,
      isScale: true,
    };
  },
  watch: {
    flag() {
      this.scrolling();
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    let that = this;
    this.res = {
      init(opt) {
        this.slider = document.querySelector(opt.slider);
        this.block = document.querySelector(opt.block);
        this.square = document.querySelector(opt.square);
        this.bool = false;
        this.block.addEventListener("mousedown", e => this.down(e));
        document.addEventListener("mousemove", e => this.movex(e));
        document.addEventListener("mouseup", e => this.up(e));
        this.slider.addEventListener("mousedown", e => this.change(e));
        this.slider.addEventListener("mouseup", e => this.table(e));
      },
      down(e) {
        this.bool = true;
        this.dis_x = e.pageX;
        this.down_x = this.block.offsetLeft;
        that.isTrue = true;
        that.$refs.audio.pause();
      },
      movex(e) {
        if (!this.bool) return;
        let x_ = e.pageX - this.dis_x + this.down_x;
        x_ = Math.max(x_, 0);
        x_ = Math.min(x_, this.slider.offsetWidth - this.block.offsetWidth + 1);
        this.square.style.width = x_ + "px";
        this.block.style.left = x_ + "px";
        let scale = x_ / (this.slider.offsetWidth - this.block.offsetWidth);
        that.$refs.audio.currentTime = scale * that.$refs.audio.duration - 5;
      },
      up(e) {
        if (this.bool) {
          this.bool = false;
          that.$refs.audio.play();
          that.isTrue = false;
          that.speed();
        }
      },
      change(e) {
        e.stopPropagation();
        let down_x = e.pageX;
        let left = this.getFather(this.slider).left;
        let x_ = down_x - this.block.offsetWidth / 2 - left;
        if (x_ < 0) x_ = -x_;
        x_ = Math.max(x_, 0);
        x_ = Math.min(x_, this.slider.offsetWidth - this.block.offsetWidth + 1);
        this.square.style.width = x_ + "px";
        this.block.style.left = x_ + "px";
        let scale = x_ / (this.slider.offsetWidth - this.block.offsetWidth);
        that.$refs.audio.currentTime = scale * that.totalTime;
        that.speed();
        // that.$refs.audio.pause()
      },
      table(e) {
        // that.$refs.audio.play()
      },
      getFather(ele) {
        let obj = {
          left: 0,
          top: 0
        };
        while (ele !== document.body) {
          obj.left += ele.offsetLeft;
          obj.top += ele.offsetTop;
          ele = ele.offsetParent;
        }
        return obj;
      }
    };
    this.res.init({
      slider: "#ctnv .slider",
      block: "#ctnv .block",
      square: "#ctnv .square"
    });
    this.drawAudio = new DrawAudio({
      ele: "#ctnv canvas",
      audio: "#ctnv .audio",
      color: {
        g: "#E6A23C",
        b: "blue",
        r: "#67C23A"
      }
    });
  },
  methods: {
    scrolling() {
      setTimeout(() => {
        this.$refs.list.scrollTop = this.flag * 50;
      }, 500);
    },
    getData() {
      let url = "http://47.110.139.9:3000/top/list?idx=1";
      this.$ajax.get(url).then(res => {
        this.dataList = res.data.playlist.tracks.splice(0, 40);
        this.flag = Math.floor(Math.random() * this.dataList.length);
        this.play(this.dataList[this.flag].id, this.flag);
      });
    },
    random() {
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      let a = Math.random() * 0.3 + 0.1;
      let rgba = `rgba(${r},${g},${b},${a})`;
      return rgba;
    },
    changeIcon() {
      this.isIcon = !this.isIcon;
    },
    //监听播放结束
    end() {
      if (this.isIcon) {
        this.flag = Math.floor(Math.random() * this.dataList.length);
      } else {
        this.flag++;
      }
      this.play(this.dataList[this.flag].id, this.flag);
      this.bg = this.random();
    },
    // 监听视频加载完成，获取视频总时间
    duration() {
      this.totalTime = this.$refs.audio.duration;
    },
    // 监听音乐播放
    update() {
      this.currentTime = this.$refs.audio.currentTime;
      if (this.currentTime === 0) this.num = -1;
      if (
        this.currentTime >=
        (this.lyric[this.num + 1] && this.lyric[this.num + 1].ms)
      ) {
        this.num++;
      }
      //换算时间
      let min = Math.floor(this.currentTime / 60);
      min = this.addZero(min);
      let sec = Math.round(this.currentTime % 60);
      sec = this.addZero(sec === 60 ? 0 : sec);
      // 总时间
      let zmin = Math.floor(this.totalTime / 60);
      zmin = this.addZero(zmin);
      let zsec = Math.round(this.totalTime % 60);
      zsec = this.addZero(zsec);
      this.start = `${min}:${sec}`;
      this.total = `${zmin}:${zsec}`;

      this.scale = this.currentTime / this.totalTime;

      this.res.block.style.left = this.scale * 100 + "%";
      this.res.square.style.width = this.scale * 100 + "%";
    },
    // 加0
    addZero(num) {
      let str = "0";
      return num < 10 ? str + num : num;
    },
    // 静音
    voice() {
      this.$refs.audio.muted = this.isBool ? true : false;
      this.isBool = !this.isBool;
    },
    // 点击播放
    play(i, index) {
      this.idx = index;
      this.flag = index;
      this.isTrue = false;
      this.num = 0;
      this.bg = this.random();
      this.text = "";
      // 请求音乐src
      let url = `http://47.110.139.9:3000/song/url?id=${i}`;
      // 请求歌词
      let url_song = `http://47.110.139.9:3000/lyric?id=${i}`;
      this.$ajax.get(url).then(res => {
        if (!res.data.data[0].url) {
          this.$message.error(`无法获取播放资源，已经为你切换到下一首`);
          this.dataList.splice(index, 1);
          this.next()
          return
        }
        this.$refs.audio.src = res.data.data[0].url;
      });
      this.$ajax.get(url_song).then(res => {
        let songArr = res.data.lrc.lyric.split("[");
        let html = [];
        // 对歌词进行处理
        for (let i = 0, len = songArr.length; i < len; i++) {
          let arr = songArr[i].split("]");
          let time = arr[0].split(".");
          let timer = time[0].split(":");
          let ms = timer[0] * 60 + timer[1] * 1;
          let text = arr[1];
          // console.log(arr)
          if (text && text !== "\n") {
            html.push({
              ms,
              text
            });
          }
        }
        this.lyric = html;
        // this.$refs.audio.play();
      });
    },
    //上一首
    previous() {
      this.num = -1;
      this.flag--;
      this.speed();
      if (this.flag < 0) this.flag = this.dataList.length - 1;
      this.play(this.dataList[this.flag].id, this.flag);
    },
    // 播放
    transmit() {
      if (this.isTrue) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
      this.isTrue = !this.isTrue;
    },
    // 下一首
    next() {
      this.flag++;
      this.num = -1;
      this.flag %= this.dataList.length;
      this.play(this.dataList[this.flag].id, this.flag);
      this.speed();
    },
    speed() {
      this.num = -1;
      const speeder = () => {
        if (
          this.$refs.audio.currentTime >=
          (this.lyric[this.num + 1] && this.lyric[this.num + 1].ms)
        ) {
          this.num++;
          speeder();
        }
      };
      speeder();
    }
  }
};
</script>
<style lang="less" scoped>
#ctnv {
  width: 100%;
  height: 635px;
  user-select: none;
  color: #ddd;
  font-size: 20px;
  .player {
    float: left;
    width: 30%;
    min-width: 210px;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    padding: 15px 0;
    .top {
      position: relative;
      width: 100%;
      height: 10%;
      margin-top: 30px;
      .time {
        position: absolute;
        right: 3.5%;
        top: 200%;
        color: #333;
        font-size: 12px;
      }
      .startTime {
        position: absolute;
        left: 3.5%;
        top: 200%;
        color: #333;
        font-size: 12px;
      }
      .title {
        text-align: center;
        font-size: 16px;
        margin: 15px 0;
        font-family: "仿宋";
        font-weight: 300;
        .avatar {
          margin: 10px 0;
          .progress {
            width: 80px;
            height: 80px;
          }
          &:hover .play {
            opacity: 1;
          }
          .play {
            position: absolute;
            left: 0;
            right: 0;
            top: 25px;
            margin: 0 auto;
            width: 30px;
            height: 30px;
            z-index: 1000;
            opacity: 0.5;
            transition: 2s;
            cursor: pointer;
            span {
              display: block;
              width: 30px;
              height: 30px;
              line-height: 28px;
              background-color: #444;
              border-radius: 50%;
              border: 2px solid #E6A23C;
              font-size: 20px;
              color: "#fff";
              &:hover {
                color: #67c23a;
              }
            }
          }
          img {
            position: absolute;
            left: 0;
            right: 0;
            margin: 0 auto;
            top: 3px;
            width: 77px;
            height: 77px;
            border-radius: 50%;
            cursor: pointer;
            animation: img 5s linear infinite;
          }
          img.animate {
            animation-play-state: paused;
          }
          @keyframes img {
            from {
              transform: rotateZ(0deg);
            }
            to {
              transform: rotateZ(360deg);
            }
          }
        }
        span.author {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          display: block;
          color: #555;
          font-size: 16px;
          font-family: "宋体";
          animation: span 5s linear infinite;
        }
        span.animation {
          animation-play-state: paused;
        }
        @keyframes span {
          from {
            text-indent: -100%;
          }
          to {
            text-indent: 100%;
          }
        }
      }
      .slider {
        position: relative;
        margin: 0 auto;
        width: 55%;
        height: 5%;
        background-color: #fff;
        cursor: pointer;
        border-radius: 5px;
        .block {
          position: absolute;
          top: -3px;
          left: -3px;
          width: 10px;
          height: 10px;
          background-color: rgba(0, 0, 255, 0.8);
          border-radius: 50%;
          z-index: 10;
          &:hover {
            border: 2px solid rgba(0, 0, 255, 0.6);
            background-color: #fff;
          }
        }
        .square {
          position: absolute;
          left: 0;
          top: 0;
          width: 0;
          height: 100%;
          background-color: #909399;
          z-index: 1;
        }
      }
      .button {
        display: flex;
        justify-content: space-around;
        width: 65%;
        height: 80%;
        margin: 10px auto;
        span {
          width: 35px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          border-radius: 50%;
          font-size: 20px;
          cursor: pointer;
          color: #fff;
          &:hover {
            color: #409EFF;
          }
        }
      }
    }
    .list {
      width: 115%;
      height: 70%;
      margin: 130px 0;
      padding: 10px 15px 10px 5px;
      overflow: auto;
      li {
        padding: 5px;
        margin: 10px 0;
        cursor: pointer;
        img {
          border-radius: 50%;
        }
        span:nth-of-type(1) {
          display: inline-block;
          max-width: 45%;
          font-size: 12px;
          color: #333;
        }
        span:nth-of-type(2) {
          float: right;
          font-size: 12px;
          color: #333;
          margin-top: 5px;
          margin-right: 5.5%;
        }
        &:hover {
          background-color: #fff !important;
        }
      }
      li.active {
        margin-left: 0;
        background-color: rgba(0, 0, 255, 0.2);
      }
    }
  }
  .drag {
    text-align: center;
    position: relative;
    float: left;
    width: 70%;
    height: 100%;
    span {
      position: absolute;
      top: 15px;
      width: 100%;
      font-size: 16px;
    }

    i {
      position: absolute;
      bottom: 15px;
      width: 100%;
      font-size: 12px;
      a {
        text-decoration: none;
        color: rgba(0, 0, 255, 0.2);
      }

      a:hover {
        color: rgba(0, 0, 255, 1);
      }
    }

    canvas {
      width: 100%;
      height: 100%;
    }
    button {
      position: absolute;
      left: 10px;
      top: 10px;
      font-size: 16px;
    }

    audio,
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 30%;
      height: 50%;
      border: 1px solid blue;
    }
    .song {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 30px;
      height: 20px;
      width: 90%;
      margin: 10px auto;
      text-align: center;
      cursor: pointer;
      color: blue;
      overflow: hidden;
      ul {
        transition: 1s;
        margin-top: 20px;
        li {
          font-size: 18px;
          height: 20px;
          line-height: 20px;
        }
        li.color {
          color: #f60;
        }
        li.info {
          color: #909399;
          text-decoration: line-through;
        }
      }
    }
  }
}
</style>