const Sequelize = require("sequelize");
module.exports = function({sequelize}) {
  return sequelize.define('setting', {
    filterBadword: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    voiceChat: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    otherSetting:{
      type: Sequelize.STRING
    },
    createBy: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: false
    }
  });
}