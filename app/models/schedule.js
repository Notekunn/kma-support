const Sequelize = require("sequelize");
module.exports = function({ sequelize }) {
    return sequelize.define('schedule', {
        studentCode: {
            type: Sequelize.STRING
        },
        day: {
            type: Sequelize.STRING
        },
        subjectCode: {
            type: Sequelize.STRING
        },
        subjectName: {
            type: Sequelize.STRING
        },
        className: {
            type: Sequelize.STRING
        },
        teacher: {
            type: Sequelize.STRING
        },
        lesson: {
            type: Sequelize.STRING
        },
        room: {
            type: Sequelize.STRING
        }
    });
}
