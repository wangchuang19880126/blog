const {
    Schema
} = require("./config")
const ObjectId = Schema.Types.ObjectId
const TreadSchema = new Schema({
    author: ObjectId,
    article: ObjectId,

}, {
    versionKey: false, //ȥ���汾��
    //���ô�����ʱ��
    timestamps: {
        createdAt: "created",
    }
})
module.exports = TreadSchema