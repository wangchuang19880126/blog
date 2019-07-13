const Comment = require("../models/comment")
let url = "http://47.110.139.9:3001"
exports.add = async ctx => {
    let data = ctx.request.body
    let res = {
        state: 1,
        msg: "评论成功"
    }
    let obj = {
        article: data.article,
        content: data.content,
        avatar: data.avatar
    }
    if (/游客/.test(data.author)) {
        obj.visitor = data.author
    } else {
        obj.author = data.author
    }

    await new Comment(obj).save().then(data => data)
        .catch(err => console.log(err))
    let dataList = await Comment.find({
        article: data.article,
    }).sort("-created")
        .populate({
            path: "author",
            select: "username avatar"
        })
        .then(data => data).catch(err => err)
    res.data = dataList
    ctx.body = res
}
exports.getList = async ctx => {
    const id = ctx.params.id
    let data = await Comment.find({
        article: id,
    }).sort("-created")
        .populate({
            path: "author",
            select: "username avatar"
        })
        .then(data => data).catch(err => err)
    ctx.body = data
}
exports.remove = async ctx => {
    let _id = ctx.params.id
    let res = {
        state: 1,
        msg: "删除成功"
    }
    await Comment.findById(_id).then(data => data.remove()).catch(err => res = {
        state: 0,
        msg: "删除失败，请检查id是否正确"
    })
    ctx.body = res
}