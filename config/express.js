const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
module.exports = function({app}) {


  app.set('views', path.join(__dirname, '../app/views'));
  app.set('view engine', 'ejs');

  if(process.env.NODE_ENV == "development") app.use(logger('dev'));
  app.use(bodyParser.json());    
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  // app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));
}