const router = require("express").Router();
const {chatfuelValidator} = require("@helpers/validator");
const controller = require("@controllers/chatfuel/disconnect");
module.exports = function({models}) {
    router.get("/", chatfuelValidator, controller({models}));
    return router;
}
