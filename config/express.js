const express = require('express');
const path = require('path');
const logger = require('morgan');
// const cookieParser = require('cookie-parser');
module.exports = function({app}) {


  app.set('views', path.join(__dirname, '../app/views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({
    extended: false
  }));
  // app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));
}