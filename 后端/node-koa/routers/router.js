const Router = require("koa-router")
const router = new Router
const user = require("../control/user")
const article = require("../control/article")
const comment = require("../control/comment")
const admin = require("../control/admin")
const load = require("../util/upload")
const fs = require("fs")
let url = "http://47.110.139.9:3001"
const {
    join
} = require("path")

router.get("/banner1", async ctx => {
    ctx.body = await new Promise((res, rej) => {
        fs.readFile(join(__dirname, "../public/interface/banner.txt"), "utf-8", (err, data) => {
            if (err) console.log(err)
            let info = JSON.parse(data)
            info.forEach((item, index, self) => {
                self[index] = url + item
            })
            res(info)
        })
    }).then(data => data)

})

router.get("/images", async ctx => {
    ctx.body = await new Promise((res, rej) => {
        fs.readFile(join(__dirname, "../public/interface/pic.txt"), "utf-8", (err, data) => {
            if (err) console.log(err)
            let info = JSON.parse(data)
            // console.log(info)
            info.forEach((item, index, self) => {
                self[index] = url + item
            })
            // console.log(info)
            res(info)
        })
    }).then(data => data)
})

router.get("/trans", async ctx => {
    const data = JSON.stringify(ctx.query)
    // if(data.length)
    // console.log(data)
    // console.log(data)
    fs.writeFile(join(__dirname, "../public/interface/pic.txt"), data, "utf8", (err, data) => {
        // console.log(data)
    })
})
//跟路由请求
router.get("/", user.keepLogin, user.root)
//注册账户
router.post("/user", user.register)
//登录账户
router.get("/login", user.login)
//退出登录
router.get("/loginOut", user.loginOut)
//文章发表
router.post("/article", article.submit)
//文章列表
router.get("/articleList", article.list)
//文章排行列表
router.get("/rank", article.rank)
//点赞
router.post("/support", article.support)
// 点踩
router.post("/tread", article.tread)
//文章详情
router.get("/articleList/:id", article.detail)
//评论
router.post("/comment", comment.add)
//评论
router.get("/comment/:id", comment.getList)
//后台管理
router.get("/admin/:id", admin.getList)
//删除文章
router.del("/article/:id", article.remove)
// 删除评论
router.del("/comment/:id", comment.remove)
// 删除用户
router.del("/user/:id", user.remove)
//图片上传
router.post('/load/:id', load.single("file"), admin.load)
//下载app
router.get("/downLoad", user.downLoad)
router.get("/ip", article.ip)
//推送
router.get("/push",admin.push)
// 签到查询
router.post("/signed",user.signed)
// 保存签到数据
router.post("/signedlist",user.saveSigned)
// router.get("*", async (ctx, next) => {
//     // const { status, body } = await readFile(serverFile + '/index.html');

//     // ctx.state = status;
//     ctx.type = 'text/html';
//     ctx.body = fs.readFileSync('./index.html')
//     console.log(11111111111111)
//     await next();
// });
module.exports = router

