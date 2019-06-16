const validated = require("@helpers/handleValidate");
const Chatfuel = require("chatfuel-helper");
const AccountHandler = require("@handlers/account");
module.exports  = function({ models: { Account } }) {
    const accountHandler = new AccountHandler(Account);
    return async function(req, res, next) {
        if (!validated(req, res)) return;
        let { chatfuel_user_id, gender, first_name, last_name, profile_pic_url, studentCode, password } = req.query;
        const correctPass = await accountHandler.check(studentCode, password);
        if (!correctPass) return res.send((new Chatfuel).sendText('Tài khoản hoặc mật khẩu không đúng').sendText('Vui lòng thử lại').render());
        accountHandler
            .add({ chatfuel_user_id, studentCode, password })
            .then(([created]) => {
                if(created) res.send((new Chatfuel()).sendText("Kết nối tài khoản sinh viên thành công").render());
                else res.send((new Chatfuel()).sendText("Kết nối lại tài khoản sinh viên thành công").render());
            })
            .catch((e) => {
                res.send((new Chatfuel()).sendText("Kết nối tài khoản sinh viên thất bại:\n"+e).render());
            })
    }
}


