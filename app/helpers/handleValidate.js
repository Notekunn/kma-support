const { validationResult } = require('express-validator/check');
const Chatfuel = require("chatfuel-helper");

chatfuelHandler = function(req, res) {
    const error = validationResult(req);
    if (error.isEmpty()) return true;
    const chatfuel = new Chatfuel();
    error.array().forEach(function({ msg }) {
        chatfuel.sendText(msg);
    });
    res.status(200).send(chatfuel.render());
    return false;
}
module.exports = chatfuelHandler
