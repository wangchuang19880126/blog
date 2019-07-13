const multer = require("koa-multer")
const { join } = require("path")
const storage = multer.diskStorage({
    destination: join(__dirname, "../public/avatar"),
    filename(req, file, cb) {
        const filename = file.originalname.split(".")
        cb(null, `${Date.now()}.${filename[filename.length - 1]}`)
    }
})
module.exports = multer({
    storage,
})