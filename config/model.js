module.exports = function({sequelize}){
  const force = process.env.NODE_ENV == "development";
  const User = require("@models/user")({sequelize});
  User.sync({force});
  
}