const User = require("../models/user")
const Signed = require("../models/signed")
const encry = require("../util/encrypt")
const fs = require("fs")
const send = require("koa-send")
const { join } = require("path")
const ws = require("./push")
// 引入token和moment.js
const jwt = require('jwt-simple');
const moment = require('moment')
exports.root = async ctx => {
    // 获取访客ip
    getClientIP = () => {
        return ctx.req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
            ctx.req.connection.remoteAddress || // 判断 connection 的远程 IP
            ctx.req.socket.remoteAddress || // 判断后端的 socket 的 IP
            ctx.req.connection.socket.remoteAddress;
    }
    let ip = getClientIP()
    fs.readFile("./ip.txt", "utf8", (err, data) => {
        let arr = data.split(",")
        arr.push(ip)
        fs.writeFile("./ip.txt", arr, err => {
            console.log(err)
        })
    })
    // let ipArr = fs.readFileSync("./ip.txt", "utf8").split(",")
    // for (let len = ipArr.length, i = len - 1; i >= 0; i--) {
    //     if (ipArr[i] === "118.205.44.40" || ipArr[i] === "183.195.15.202" || ipArr[i] === "101.245.244.20") {
    //         ipArr.splice(i, 1)
    //     }
    // }
    // ipArr.reverse()
    // ctx.session.ip = ipArr
    ctx.body= ctx.session
}
exports.register = async ctx => {
    let res = {
        state: 1,
        msg: "注册成功,请登录！"
    }
    const username = ctx.request.body.username
    const password = ctx.request.body.password
    const email = ctx.request.body.password
    let data = await User.find({
        username,
    })
        .then(data => data)
    if (!data.length) {
        //账号不存在保存数据到数据库
        await new User({
            username,
            email,
            password: encry(password),
            commentNum: 0,
            articleNum: 0,
        }).save().then(data => data)
            .catch(err => res = {
                state: 0,
                msg: "注册失败"
            })
    } else {
        res = {
            state: 0,
            msg: "账户已经存在，请更换账户"
        }
    }
    ctx.body = res
}
exports.login = async ctx => {
    let res = {
        state: 1,
        msg: "登录成功"
    }
    const username = ctx.query.username
    const password = ctx.query.password
    let data = await User.find({
        username
    }).then(data => data)
        .catch(err => res)
    if (!data.length) {
        res = {
            state: 0,
            msg: "用户不存在，请注册账户"
        }
        ctx.body = res
        return
    }
    if (data[0].password !== encry(password)) {
        res = {
            state: 0,
            msg: "密码不正确，请重新输入"
        }
    } else {
        //登录成功
        // const expires = moment().add(2, 'hours').valueOf();
        // const token = jwt.encode({ iss: data[0]._id, exp: expires }, 'wc');
        // res.token = token
        // console.log(data[0])
        res.dataList = data[0]
        res.dataList.avatar = "http://47.110.139.9:3001" + res.dataList.avatar
        ctx.cookies.set("username", username, {
            domain: "47.110.139.9",
            path: "/",
            maxAge: 10 * 36e5,
            httpOnly: false,
            overwrite: false,
            signed: true,
        })

        ctx.cookies.set("uid", data[0]._id, {
            domain: "47.110.139.9",
            path: "/",
            maxAge: 10 * 36e5,
            httpOnly: false,
            overwrite: false,
            signed: true,
        })
        ctx.cookies.set("avatar", data[0].avatar, {
            domain: "47.110.139.9",
            path: "/",
            maxAge: 10 * 36e5,
            httpOnly: false,
            overwrite: false,
            signed: true,
        })
        ctx.cookies.set("role", data[0].role, {
            domain: "47.110.139.9",
            path: "/",
            maxAge: 10 * 36e5,
            httpOnly: false,
            overwrite: false,
            signed: true,
        })
        ctx.session = {
            username,
            uid: data[0]._id,
            avatar: data[0].avatar,
            role: data[0].role
        }
        // console.log(ctx.session)
    }
    ctx.body = res
}

exports.loginOut = async ctx => {
    ctx.session = null
    ctx.cookies.set("username", null, {
        maxAge: 0,
    })
    ctx.cookies.set("uid", null, {
        maxAge: 0,
    })
    ctx.cookies.set("role", null, {
        maxAge: 0,
    })
    ctx.cookies.set("avatar", null, {
        maxAge: 0,
    })
    ctx.body = {
        state: 1,
        msg: "已经退出登录"
    }
}
exports.remove = async ctx => {
    let _id = ctx.params.id
    let res = {
        state: 1,
        msg: "删除成功"
    }
    await User.findById(_id).then(data => data.remove()).catch(err => res = {
        state: 0,
        msg: "删除失败，请检查id是否正确"
    })
    ctx.body = res
}

//下载app
exports.downLoad = async ctx => {
    ctx.type = "application/vnd.android.package-archive"
    await send(ctx, "app.apk", {
        root: join(__dirname, "../public/app")
    })
}
//检验用户登录状态
// exports.keepLogin = async (ctx, next) => {
//     const token = (ctx.body && ctx.body.token) || (ctx.query && ctx.query.token) || ctx.headers['token'];
//     if (token) {
//         console.log(token)
//         const decoded = jwt.decode(token, 'wc');
//         // console.log('decoded:' + JSON.stringify(decoded))
//         //判断token是否超时
//         if (decoded.exp <= Date.now()) {
//             await next()
//             ctx.body = {
//                 code: 0,
//                 user: "登录过期！"
//             }
//         } else {
//             let data = await User.findOne({
//                 _id: decoded.iss
//             }).then(data => data)
//             await next()
//             data.avatar = "http://47.110.139.9:3001" + data.avatar
//             ctx.body = {
//                 code: 1,
//                 user: data
//             }
//         }
//     } else {
//         await next()
//     }
// }
exports.keepLogin = async (ctx, next) => {
    if (ctx.session && ctx.cookies.get("uid")) {
        ctx.session = {
            username: ctx.cookies.get("username"),
            uid: ctx.cookies.get("uid"),
            avatar: ctx.cookies.get("avatar"),
            role: ctx.cookies.get("role")
        }
    }
    // await next()
    await next()
}
exports.signed = async ctx => {
    let res = {
        state:1,
        msg:"查询数据成功"
    }
    const {_id} = ctx.request.body
   let data = await  User.find({
        _id
    }).then(data => data).catch(err => res = {
        state:0,
        msg:"查询数据异常"
    })
    res.data = data
    ctx.body = res
}
exports.saveSigned = async ctx => {
    const {_id,signedMore, signedlist} = ctx.request.body
    console.log(_id,signedMore, signedlist)
    let data = await User.updateOne({
       _id,
    }, {
            $set: {
                signedMore,
                signedList:signedlist
            }
        }).then(data => data).catch(err => ctx.body = {
            state:0,
            msg:"签到失败！"
        })
    if(data){
        ctx.body = {
            state:1,
            msg:"签到成功"
        }
    }
}