const sequelize = require("@config/sequelize")
const Sequelize = require("sequelize");
const User = sequelize.define('user', {
    chatfuel_user_id: {
        type: Sequelize.BIGINT,
        unique: true,
    },
    first_name: {
        type: Sequelize.STRING
    },
    last_name: {
        type: Sequelize.STRING
    },
    profile_pic_url: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING
    },
    filterBadword: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    voiceChat: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});
