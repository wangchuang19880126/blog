const Koa = require('koa')
const cors = require("@koa/cors")
const router = require("./routers/router")
const any = require("./other/else")
const body = require("koa-body")
const session = require("koa-session")
const static = require("koa-static")
global.pushMessage = ''

let time = null
const compress = require("koa-compress")
const options = { threshold: 2048 }

const websockify = require('koa-websocket')
const app = websockify(new Koa());
// app.ws.use(function (ctx, next) {
//   return next(ctx)
// })



// const send = require("koa-send")
// const app = new Koa()
// const check = require("./control/check")
// console.log(check)

//适配vue history的中间件
// const historyApiFallback = require('koa-connect-history-api-fallback');
// app.use(historyApiFallback());


//注册koa-body解析post请求
app.use(body())
//设置静态资源目录
// app.use(static(join(__dirname,"./static")))
//设置跨域请求
app.use(cors())
app.use(async (ctx, next) => {
  ctx.set({
    'Access-Control-Allow-Credentials': true,
  })
  await next()
})
//注册session
app.keys = ['wc'];
const CONFIG = {
  key: 'Sid',
  maxAge: 10 * 36e5, //1小时
  autoCommit: true,
  overwrite: true,
  httpOnly: false,
  signed: true,
  rolling: false,
  renew: false,
}

// 注册session
app.use(session(CONFIG, app))
// //验证token
// app.use(check)
//注册路由
app.use(router.routes())
  .use(router.allowedMethods())
app.use(any.else)
app.use(compress(options))
let ctxs = []
let num = 0
app.ws.use((ctx, next) => {
  getClientIP = (i) => {
    return ctxs[i].req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
      ctxs[i].req.connection.remoteAddress || // 判断 connection 的远程 IP
      ctxs[i].req.socket.remoteAddress || // 判断后端的 socket 的 IP
      ctxs[i].req.connection.socket.remoteAddress;
  }
  ctxs.push(ctx)
  // console.log(ctxs)
  ctx.websocket.on('message', message => {
    // console.log(message,ctxs)
    clearInterval(time)
    time = setInterval(() => {
      // console.log(++num)
      for (let i = 0; i < ctxs.length; i++) {
        let ip = getClientIP(i)
        let obj = {
          content: global.pushMessage,
          ip,
        }
        if (ctx == ctx[i]) continue
        ctxs[i].websocket.send(JSON.stringify(obj))
      }
    }, 5000);
  });
  ctx.websocket.on("error", error => {
    console.log(error)
  })
  ctx.websocket.on("close", message => {
    console.log(message)
    let index = ctxs.indexOf(ctx);
    ctxs.splice(index, 1);
  })
});
console.log(global.pushMessage)
app.listen(3001, '0.0.0.0', () => {
  console.log("Server is starting at porting 3001!")
})
//创建管理员用户，如果管理员存在就返回
{

  const User = require("./models/user")
  const crypto = require("./util/encrypt")
  // User.updateOne({
  //   username: "owner"
  // }, {
  //     $set: {
  //       role: 0,
  //       signedMore: 0,
  //       signedList: [],
  //     }
  //   }).exec()
  User.find({
    username: "owner"
  })
    .then(data => {
      if (data.length === 0) {
        //管理员不存在
        new User({
          username: "owner",
          password: crypto("1688943"),
          role: 0,
          commentNum: 0,
          articleNum: 0,
        }).save()
          .then(data => {
            console.log("创建管理员用户名：owner 密码： 1688943")
          })
          .catch(err => {
            console.log(err)
          })

      } else {
        data[0].role = 666,
          User.updateOne({
            username: "owner"
          }, {
              $set: {
                role: 0
              }
            }).exec()
        console.log("管理员用户名：owner 密码： 1688943")
      }
    })
}
