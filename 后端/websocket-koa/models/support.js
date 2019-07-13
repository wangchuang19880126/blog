const { db } = require("../Schema/config")
const SupportSchema = require("../Schema/support")
const Support = db.model("supports", SupportSchema)
module.exports = Support