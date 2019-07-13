import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

let router = new Router({
  // mode: 'history', //去掉url中的#
  linkExactActiveClass: "isActive",
  routes: [{
    path: "/",
    redirect: {
      name: "index"
    }
  }, {
    path: '/index',
    component: resolve => require(['@/components/index'], resolve),
    name: "index",
  }, {
    path: "/login",
    component: resolve => require(['../components/login/login.vue'], resolve),
    name: "login",
  }, {
    path: "/regist",
    component: resolve => require(['../components/login/regist.vue'], resolve),
    name: "regist",
  },
  {
    path: "/article",
    component: resolve => require(["../components/article/article.vue"], resolve),
    name: "article"
  }, {
    path: "/admin",
    component: resolve => require(['../components/admin/admin.vue'], resolve),
    name: "admin"
  },
  {
    path: "/articleList/:id",
    component: resolve => require(['../components/article/articleDetail.vue'], resolve),
    name: "detail"
  },
  {
    path: '/canvas',
    component: resolve => require(['../components/canvas/canvas.vue'], resolve),
    name: "canvas"
  },
  {
    path: "/personal",
    component: resolve => require(['../components/personal/personal.vue'], resolve),
    name: "personal",
  }, {
    path: '/game',
    component: resolve => require(['../components/game/game.vue'], resolve),
    name: "game"
  }, {
    path: "/download",
    component: resolve => require(['../components/download/download.vue'], resolve),
    name: "download"
  },{
    path:"/chat",
    component: resolve => require(['../components/chat/chat.vue'], resolve),
    name:"chat",
  },{
    path: "/chatroom",
    component: resolve => require(['../components/chat/chatroom.vue'], resolve),
    name: "chatroom"
  }
  ],
})

//动态改变title
router.beforeEach((to, from, next) => {
  if (to.params.title) {
    document.title = to.params.title
  }
  next()
})
export default router