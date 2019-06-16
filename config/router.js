module.exports = function({app, models}) {

  app.use('/', require('@routes/index'));
  app.use('/users', require('@routes/users'));
  
  //Chatfuel
  app.use('/api/chatfuel/', require("@routes/api/chatfuel/index")({models}));
  app.use('/api/chatfuel/connect', require("@routes/api/chatfuel/connect")({models}));
  app.use('/api/chatfuel/disconnect', require("@routes/api/chatfuel/disconnect")({models}));  
  app.use('/api/chatfuel/schedule/', require("@routes/api/chatfuel/schedule")({models}));

}