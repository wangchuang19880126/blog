<template>
  <div class="uni-load-more">
    <div class="uni-load-more__img" v-show="status === 'loading' && showIcon">
      <div class="load1">
        <div :style="{background:color}"></div>
        <div :style="{background:color}"></div>
        <div :style="{background:color}"></div>
        <div :style="{background:color}"></div>
      </div>
      <div class="load2">
        <div :style="{background:color}"></div>
        <div :style="{background:color}"></div>
        <div :style="{background:color}"></div>
        <div :style="{background:color}"></div>
      </div>
      <div class="load3">
        <div :style="{background:color}"></div>
        <div :style="{background:color}"></div>
        <div :style="{background:color}"></div>
        <div :style="{background:color}"></div>
      </div>
    </div>
    <span
      class="uni-load-more__text"
      :style="{color:color}"
      @click="loading"
    >{{status === 'more' ? contentText.contentdown : (status === 'loading' ? contentText.contentrefresh : contentText.contentnomore)}}</span>
  </div>
</template>

<script>
export default {
  name: "load-more",
  props: {
    status: {
      //上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
      type: String,
      default: "more"
    },
    showIcon: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: "#909399"
    },
    contentText: {
      type: Object,
      default() {
        return {
          contentdown: "查看更多图片",
          contentrefresh: "正在加载...",
          contentnomore: "没有更多图片"
        };
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    loading() {
      // console.log(55555555555)
      this.$emit("more",this.status)
    }
  }
};
</script>

<style>
@charset "UTF-8";

.uni-load-more {
  display: flex;
  flex-direction: row;
  height: 40px;
  align-items: center;
  justify-content: center;
}

.uni-load-more__text {
  font-size: 14px;
  color: #999;
  cursor: pointer;
}

.uni-load-more__img {
  height: 24px;
  width: 24px;
  margin-right: 10px;
}

.uni-load-more__img > div {
  position: absolute;
}

.uni-load-more__img > div div {
  width: 6px;
  height: 2px;
  border-top-left-radius: 1px;
  border-bottom-left-radius: 1px;
  background: #999;
  position: absolute;
  opacity: 0.2;
  transform-origin: 50%;
  animation: load 1.56s ease infinite;
}

.uni-load-more__img > div div:nth-child(1) {
  transform: rotate(90deg);
  top: 2px;
  left: 9px;
}

.uni-load-more__img > div div:nth-child(2) {
  transform: rotate(180deg);
  top: 11px;
  right: 0;
}

.uni-load-more__img > div div:nth-child(3) {
  transform: rotate(270deg);
  bottom: 2px;
  left: 9px;
}

.uni-load-more__img > div div:nth-child(4) {
  top: 11px;
  left: 0;
}

.load1,
.load2,
.load3 {
  height: 24px;
  width: 24px;
}

.load2 {
  transform: rotate(30deg);
}

.load3 {
  transform: rotate(60deg);
}

.load1 div:nth-child(1) {
  animation-delay: 0s;
}

.load2 div:nth-child(1) {
  animation-delay: 0.13s;
}

.load3 div:nth-child(1) {
  animation-delay: 0.26s;
}

.load1 div:nth-child(2) {
  animation-delay: 0.39s;
}

.load2 div:nth-child(2) {
  animation-delay: 0.52s;
}

.load3 div:nth-child(2) {
  animation-delay: 0.65s;
}

.load1 div:nth-child(3) {
  animation-delay: 0.78s;
}

.load2 div:nth-child(3) {
  animation-delay: 0.91s;
}

.load3 div:nth-child(3) {
  animation-delay: 1.04s;
}

.load1 div:nth-child(4) {
  animation-delay: 1.17s;
}

.load2 div:nth-child(4) {
  animation-delay: 1.3s;
}

.load3 div:nth-child(4) {
  animation-delay: 1.43s;
}

@keyframes load {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.2;
  }
}
</style>