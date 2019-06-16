const validated = require("@helpers/handleValidate");
const Chatfuel = require("chatfuel-helper");
const AccountHandler = require("@handlers/account");
module.exports = function({ models: { Account } }) {
    const accountHandler = new AccountHandler(Account);
    return function(req, res, next) {
        if (!validated(req, res)) return;
        let { chatfuel_user_id } = req.query;
        accountHandler
            .remove(chatfuel_user_id)
            .then((success) => {
                if (success) res.send((new Chatfuel()).sendText("Ngắt kết nối thành công").render());
                else res.send((new Chatfuel()).sendText("Bạn chưa kết nối tài khoản").render());
            })
    }
}
