const router = require("express").Router();
const {chatfuelValidator} = require("@helpers/validator");
const {connectRouterController} = require("@controllers/chatfuel/connect");
module.exports = function({models}) {
    router.get("/", chatfuelValidator, connectRouterController({models}));
    return router;
}
