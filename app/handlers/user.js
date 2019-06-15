module.exports = class User {
    constructor(User) {
        this.User = User;
    }

    async add({ chatfuel_user_id, gender, first_name, last_name, profile_pic_url }) {
        const [user, created] = await this.User.findOrCreate({
            where: {
                chatfuel_user_id
            },
            defaults: {
                last_name,
                first_name,
                gender,
                profile_pic_url
            }
        })
        return [user.get({ plain: true }), created];
    }

    async get(chatfuel_user_id) {
        const user = await this.User.findOne({
            where: {
                chatfuel_user_id
            }
        })
        return user && user.get({plain: true})
    }

}
