const { db } = require("../Schema/config")
const ChatSchema = require("../Schema/chat")
const Chat = db.model("chats", ChatSchema)
module.exports = Chat