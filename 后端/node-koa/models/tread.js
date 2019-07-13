const { db } = require("../Schema/config")
const TreadSchema = require("../Schema/tread")
const Tread = db.model("treads", TreadSchema)
module.exports = Tread