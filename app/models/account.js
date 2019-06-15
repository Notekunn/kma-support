const Sequelize = require("sequelize");
module.exports = function({sequelize}) {
  return sequelize.define('account', {
    studentCode: {
      type: Sequelize.STRING,
      primaryKey: true,
      autoIncrement: false
    },
    password: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    className: {
      type: Sequelize.STRING
    },
    userId:{
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: false
    }
  });
}