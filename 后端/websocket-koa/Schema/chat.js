const {
    Schema
} = require("./config")
// const ObjectId = Schema.Types.ObjectId
const ChatSchema = new Schema({
    username: String,
    role: Number,
    avatar: String,
    ip:String,
    time: Number,
    isEnter: Boolean,
    content:String,
}, {
        versionKey: false, 
        timestamps: {
            createdAt: "created",
        }
    })
module.exports = ChatSchema