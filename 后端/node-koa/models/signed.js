const { db } = require("../Schema/config")
const SignedSchema = require("../Schema/signed")
const Signed = db.model("signeds", SignedSchema)
module.exports = Signed