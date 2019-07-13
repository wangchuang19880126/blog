const crypto = require("crypto")
//对密码进行加密
module.exports = (password, key = "wc") =>
    //  {
    //     const hmac = crypto.createHash("sha256", key)
    //     hmac.update(password)
    //     const passwordHmac = hmac.digest()
    //     return passwordHmac;
    // }
    (crypto.createHash("sha256", key).update(password).digest("hex"))