const {
    Schema
} = require("./config")
const UserSchema = new Schema({
    username: String,
    password: String,
    avatar: {
        type: String,
        default: "/avatar/default.jpg" //头像默认路径
    },
    role: {
        type: Number,
        default: 1,
    },
    articleNum: 0,
    commentNum: 0,
}, {
    versionKey: false, //去除版本号
    //设置创建的时间
    timestamps: {
        createdAt: "created",
    }
})

//设置删除用户的钩子
UserSchema.post("remove", doc => {
    const Article = require("../models/article")
    const Comment = require("../models/comment")
    const {
        _id: author
    } = doc
    console.log(author)
    Article.find({
            author
        })
        .then(data => {
            data.forEach(v => v.remove())
        })
        .catch(err => console.log(err))

    Comment.find({
            from: author
        })
        .then(data => {
            data.forEach(v => v.remove())
        })
        .catch(err => console.log(err))
})

module.exports = UserSchema