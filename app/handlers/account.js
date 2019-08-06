const loginKMA = require("tin-chi-kma")({});
module.exports = class Account {
    constructor(Account) {
        this.Account = Account;
    }

    async add({ chatfuel_user_id, studentCode, password }) {
        const created = await this.Account.upsert({
            userId: chatfuel_user_id,
            studentCode,
            password
        }, {
            fields: ['studentCode', 'password']
        })
        return [created];
    }

    async getByUID(chatfuel_user_id) {
        const account = await this.Account.findOne({
            where: {
                userId: chatfuel_user_id
            }
        })
        return account && account.get({ plain: true })
    }
    
    async getByStudentCode(studentCode) {
        const account = await this.Account.findOne({
            where: {
                studentCode
            }
        })
        return account && account.get({ plain: true })
    }

    check(studentCode = "", password = "") {
        return new Promise(function(resolve, reject) {
            loginKMA({ user: studentCode, pass: password }, async function(error, api) {
                if (error) resolve(false);
                else resolve(true)
            })
        })
    }

    remove(chatfuel_user_id) {
        const account = this.get(chatfuel_user_id);
        if (!account) return Promise.resolve(false);
        return account.destroy()
            .then(() => Promise.resolve(false))
            .catch(() => Promise.resolve(true))
    }


}
