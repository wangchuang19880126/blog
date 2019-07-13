import Vue from 'vue'
import App from './App'
import router from './router'
import qs from "qs"
// 引入jsonp插件
import vueJsonp from "vue-jsonp"
import store from './store/index'
// axios拦截器
import axios from './tools/axios.js'
Vue.prototype.$ajax = axios
Vue.prototype.$qs = qs
// 解构全局组件
import {
  hdNv,
  ftNv,
  ctNv,
  atNv,
  snakeNv,
  bg,
  rightNv
} from './tools/components.js'

Vue.component("hdNv", hdNv)
Vue.component("ftNv", ftNv)
Vue.component("atNv", atNv)
Vue.component("ctNv", ctNv)
Vue.component("snakeNv", snakeNv)
Vue.component("bg", bg)
Vue.component("rightNv",rightNv)
Vue.use(vueJsonp)
Vue.use(VueLazyload)

Vue.config.productionTip = false

// Vue.prototype.$store = store
new Vue({
  el: '#app',
  router,
  data: {

  },
  store,
  vueJsonp,
  components: {
    App
  },
  template: '<App/>'
})
