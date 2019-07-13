const { Schema } = require("./config")
const ObjectId = Schema.Types.ObjectId


const CommentSchema = new Schema({
    // 头像   用户名  
    // 文章
    // 内容
    content: String,
    // 关联用户表
    author: {
        type: ObjectId,
        ref: "users"
    },
    // 关联到 article 表 --》 集合 
    article: {
        type: ObjectId,
        ref: "articles"
    },
    visitor:String,
    avatar:String,
}, {
        versionKey: false,
        timestamps: {
            createdAt: "created"
        }
    })
//保存评论的钩子
CommentSchema.post("save", doc => {
    const User = require("../models/user")
    const Article = require("../models/article")
    const { article,author } = doc
    console.log(article)
    Article.updateOne({
        _id: article
    }, {
            $inc: {
                commentNum: 1
            }
        }, err => {
            if (err) return console.log(err)
            console.log("文章评论计数更新成功")
        })
    User.updateOne({
        _id: author
    }, {
            $inc: {
                commentNum: 1
            }
        }, err => {
            if (err) return console.log(err)
            console.log("用户评论计数更新成功")
        })
})
//设置删除钩子
CommentSchema.post("remove", doc => {
    const User = require("../models/user")
    const Article = require("../models/article")
    const { article, author } = doc
    User.updateOne({
        _id: author
    }, {
            $inc: {
                commentNum: -1
            }
        }).then(data => console.log("用户评论数量减一"))
        .catch(err => console.log("用户评论数量没有变化"))
    Article.updateOne({
        _id: article
    }, {
            $inc: {
                commentNum: -1
            }
        }).then(data => console.log("文章评论数量减一"))
        .catch(err => console.log("文章评论数量没有变化"))
})
module.exports = CommentSchema