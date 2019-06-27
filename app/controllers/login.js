const jwt = require("jsonwebtoken");
const { SECRET_KEY_JWT } = require("@configFile");
const { validationResult } = require("express-validator/check");
const AccountHandler = require("@handlers/account");
module.exports = function ({ models: { Account } }) {
    const accountHandler = new AccountHandler(Account);
    return async function (req, res, next) {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.json({
                error: {
                    message: error.array()[0].msg
                }
            })
        }
        try {
            const logged = await accountHandler.check(req.body.user, req.body.pass);
            if (!logged) return res.json({
                error: {
                    message: "Tài khoản hoặc mật khẩu không đúng"
                }
            })
            const account = await accountHandler.getByStudentCode(req.body.user);
            if (!account) res.json({
                error: {
                    message: "Bạn chưa kết nối với tài khoản facebook.\nHãy nhắn tin với bot tại m.me/KMA.Support.Student"
                }
            })
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: JSON.stringify(account)
            }, SECRET_KEY_JWT);
            res.send(token)

        } catch (error) {
            res.json({
                error: {
                    message: error + ''
                }
            })
        }
    }
}


