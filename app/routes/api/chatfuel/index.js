const router = require("express").Router();
const {chatfuelValidator} = require("@helpers/validator");
const {indexRouterController} = require("@controllers/chatfuel/");
module.exports = function({models}) {
    router.get("/", chatfuelValidator, indexRouterController({models}));
    return router;
}
