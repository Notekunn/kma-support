module.exports = function({ sequelize }) {
  const force = process.env.NODE_ENV == "development";
  const User = require("@models/user")({ sequelize });
  const Account = require("@models/account")({ sequelize });
  const Schedule = require("@models/schedule")({ sequelize });
  User.sync({ force });
  Account.sync({ force });
  Schedule.sync({ force: false });

  // User.hasOne(Account, { foreignKey: "userId" });
  // Account.belongsTo(User, { foreignKey: "chatfuel_user_id" });

  return {
    User,
    Account,
    Schedule
  }

}
