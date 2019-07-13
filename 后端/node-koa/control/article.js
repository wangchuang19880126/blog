const Article = require("../models/article")
const Support = require("../models/support")
const Tread = require("../models/tread")
const fs = require('fs')

exports.submit = async ctx => {
    let data = ctx.request.body
    let res = {
        state: 1,
        msg: "文章发表成功"
    }
    let obj = {
        title: data.title,
        type: data.type,
        content: data.content,
        commentNum: 0,
        num_x: 0,
        num_y: 0,
        imageUrl:data.imageUrl,
    }
    // console.log(/^游客/.test(data.username))
    if (/^游客/.test(data.username)) {
        obj.visitor = data.username
    } else {
        obj.author = data.username
    }
    await new Article(obj).save().then(data => data)
        .catch(err => res = {
            state: 0,
            msg: "保存失败，请检查你的网络是否正常"
        })
    ctx.body = res
}
exports.ip = async ctx => {
    let ipArr = fs.readFileSync("./ip.txt", "utf8").split(",")
    for (let len = ipArr.length, i = len - 1; i >= 0; i--) {
        if (ipArr[i] === "118.205.44.40" || ipArr[i] === "183.195.15.202" || ipArr[i] === "101.245.244.20" || ipArr[i] === "211.161.245.38") {
            ipArr.splice(i, 1)
        }
    }
    ipArr.reverse()
    ctx.body = ipArr
}
exports.list = async ctx => {
    // 批量更新数据库
    // let arr = JSON.parse(fs.readFileSync("./public/interface/pic.txt", "utf8"))
    // let num = await Article.find().then(data => data)
    // num.forEach( async (v, index) => await Article.updateOne({_id:v._id},{
    //     $set:{
    //         imageUrl:`http://47.110.139.9:3001${arr[index]}`
    //     }
    // }).then(data => console.log(data)))
    let data = await Article.find()
        .populate({
            path: "author",
            select: "username _id avatar"
        })
        .sort("-created")
        .then(data => data)
        .catch(err => console.log(err))
    data.forEach(item => {
        item.content = ""
    });
    ctx.body = data
}
//点赞
exports.support = async ctx => {
    let bool = false
    let _id = ctx.request.body.id
    // let num_x = ctx.request.body.num_x
    let author = ctx.request.body.uid
    let supportData = await Support.find({
            article: _id,
        }).then(data => data)
        .catch(err => console.log(err))
    supportData.forEach(item => {
        if (item.author == author) {
            bool = true
            return
        }
    })
    if (bool) {
        ctx.body = {
            state: 0,
        }
    } else {
        await new Support({
                author,
                article: _id,
            }).save().then(data => data)
            .catch(err => console.log(err))
        await Article.updateOne({
            _id,
        }, {
            $inc: {
                num_x: +1,
            }
            // $set:{
            //     num_x,
            // }
        }).then(data => data).catch(err => console.log(err))
        ctx.body = {
            state: 1,
        }
    }
}
//点踩
exports.tread = async ctx => {
    let bool = false
    let _id = ctx.request.body.id
    // let num_y = ctx.request.body.num_y
    let author = ctx.request.body.uid
    let treadData = await Tread.find({
            article: _id,
        }).then(data => data)
        .catch(err => console.log(err))
    treadData.forEach(item => {
        if (item.author == author) {
            bool = true
            return
        }
    })
    if (bool) {
        ctx.body = {
            state: 0,
        }
    } else {
        await new Tread({
                author,
                article: _id,
            }).save().then(data => data)
            .catch(err => console.log(err))
        await Article.updateOne({
            _id,
        }, {
            $inc: {
                num_y: +1,
            }
        }).then(data => data).catch(err => console.log(err))
        ctx.body = {
            state: 1,
        }
    }
}
//详情
exports.detail = async ctx => {
    // console.log(ctx.query)
    let _id = ctx.params.id
    console.log(ctx.url)
    let data = await Article.find({
            _id
        })
        .sort("-created")
        .populate({
            path: "author",
            select: "username _id avatar"
        })
        .then(data => data).catch(err => console.log(err))
    ctx.body = data
}
//删除文章
exports.remove = async ctx => {
    let _id = ctx.params.id
    let res = {
        state: 1,
        msg: "删除成功"
    }
    await Article.findById(_id).then(data => data.remove()).catch(err => res = {
        state: 0,
        msg: "删除失败，请检查id是否正确"
    })
    ctx.body = res
}
//文章排行
exports.rank = async ctx => {
    let data = await Article.find()
        .then(data => data)
        .catch(err => console.log(err))
    data.forEach(item => {
        item.content = ""
    });
    ctx.body = data
}