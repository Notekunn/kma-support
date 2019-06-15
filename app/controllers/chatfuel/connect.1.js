const validated = require("@helpers/handleValidate");
const Chatfuel = require("chatfuel-helper");
const AccountHandler = require("@handlers/account");
const connectRouterHandle = function({ models: { Account } }) {
    const accountHandler = new AccountHandler(Account);
    return async function(req, res, next) {
        if (!validated(req, res)) return;
        let { chatfuel_user_id, gender, first_name, last_name, profile_pic_url, studentCode, password } = req.query;
        
    }
}

module.exports = {
    connectRouterHandle
}
