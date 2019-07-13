const { Schema } = require("./config")
const ObjectId = Schema.Types.ObjectId
const SignedSchema = new Schema({
    author: ObjectId,
    signedMore: {
        type:Number,
        default:0,
    },
    signedList:{
        tpye:Array,
        default:[],
    }
}, {
        versionKey: false,//去除版本号
        // 设置创建的时间
        timestamps: {
            createdAt: "created",
        }
    })
module.exports = SignedSchema