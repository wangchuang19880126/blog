const {
    Schema
} = require("./config")
const ObjectId = Schema.Types.ObjectId
const TreadSchema = new Schema({
    author: ObjectId,
    article: ObjectId,

}, {
    versionKey: false, //去除版本号
    //设置创建的时间
    timestamps: {
        createdAt: "created",
    }
})
module.exports = TreadSchema