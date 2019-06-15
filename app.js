const express = require('express');
const app = express();
const sequelize = require("@config/sequelize");

sequelize
  .authenticate()
  .then(() => console.log("Connect database success!"))
  .then(function() {
    const models = require("@config/model")({sequelize});
    require("@config/express")({ app });
    require("@config/router")({ app , models});
    require("@config/error")({ app});
  })
  // .catch(function(e) {
  //   console.log("Can't connect to database!");
  //   console.log("ERR: " + e);
  //   process.exit(1);
  // })


module.exports = app;
