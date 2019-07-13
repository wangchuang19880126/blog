const Article = require("../models/article")
const Comment = require("../models/comment")
const User = require("../models/user")
// let pushMessage = ""

exports.getList = async ctx => {
    let id = ctx.params.id
    let _id = ctx.query.id
    let role = ctx.query.role
    let res = {
        state: 1,
        msg: "返回数据成功"
    }
    if (!_id) return ctx.body = res = {
        state: 0,
        msg: "检测到你没有登录！"
    }
    let article, comment, user
    if (role * 1) {
        switch (id) {
            case "article":
                article = await Article.find({
                    author: _id,
                })
                    .sort("-created")
                    .populate({
                        path: "author",
                        select: "username"
                    })
                    .then(data => data)
                    .catch(err => console.log(err))
                res.data = article
                break;
            case "comment":
                comment = await Comment.find({
                    author: _id
                }).populate({
                    path: "author",
                    select: "username"
                }).populate({
                    path: "article",
                    select: "title"
                })
                    .sort("-created")
                    .then(data => data)
                    .catch(err => console.log(err))
                res.data = comment
                break;
        }
    } else {
        switch (id) {
            case "article":
                article = await Article.find()
                    .sort("-created")
                    .populate({
                        path: "author",
                        select: "username"
                    })
                    .then(data => data)
                    .catch(err => console.log(err))
                res.data = article
                break;
            case "comment":
                comment = await Comment.find().populate({
                    path: "author",
                    select: "username"
                }).populate({
                    path: "article",
                    select: "title"
                })
                    .sort("-created")
                    .then(data => data)
                    .catch(err => console.log(err))
                res.data = comment
                break;
            case "user":
                user = await User.find()
                    .sort("-created")
                    .then(data => data)
                    .catch(err => console.log(err))
                res.data = user
                break;
        }
    }
    ctx.body = res
}
exports.load = async ctx => {
    const _id = ctx.params.id
    const filename = ctx.req.file.filename
    if (_id !== "0") {
        await User.updateOne({
            _id
        }, {
                $set: {
                    avatar: "/avatar/" + filename
                }
            })
    }
    ctx.body = {
        state: 1,
        msg: "上传成功",
        filenameurl: "http://47.110.139.9:3001/avatar/" + filename
    }
}
exports.push = async ctx => {
    // let data = ctx.query
    // pushMessage=data.message
    global.pushMessage= ctx.query.message
    ctx.body = {
        state:1,
        msg:"推送成功！"
    }
}