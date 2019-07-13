// 引入token和moment.js
const jwt = require('jwt-simple');
const User = require("../models/user")
const check = async (ctx, next) => {
    const token = (ctx.body && ctx.body.token) || (ctx.query && ctx.query.token) || ctx.headers['token'];
    if (token) {
        console.log(token)
        const decoded = jwt.decode(token, 'wc');
        // console.log('decoded:' + JSON.stringify(decoded))
        //判断token是否超时
        if (decoded.exp <= Date.now()) {
            await next()
            ctx.body = {
                code: 0,
                user: "登录过期！"
            }
        }else{
            let data = await User.findOne({
                _id: decoded.iss
            }).then(data => data)
            await next()
            data.avatar = "http://47.110.139.9:3001" + data.avatar
            ctx.body = {
                code: 1,
                user: data
            }
        }
    } else {
        await next()
    }
}
module.exports = check