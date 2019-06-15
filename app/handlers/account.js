const loginKMA = require("tin-chi-kma")({});
module.exports = class Account {
    constructor(Account) {
        this.Account = Account;
    }

    async add({ chatfuel_user_id, studentCode, password }) {
        const [account, created] = await this.Account.findOrCreate({
            where: {
                userId: chatfuel_user_id
            },
            defaults: {
                studentCode,
                password
            }
        })
        return [account.get({ plain: true }), created];
    }

    async get(chatfuel_user_id) {
        const account = await this.Account.findOne({
            where: {
                userId: chatfuel_user_id
            }
        })
        return account && account.get({ plain: true })
    }

    check(studentCode, password) {
        return new Promise(function(resolve, reject) {
            loginKMA({ user: studentCode, pass: password }, async function(error, api) {
                if (error) resolve(false);
                else resolve(true)
            })
        })
    }

}
