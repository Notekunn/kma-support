const router = require("express").Router();
const { loginValidator } = require("@helpers/validator");
const controller = require("@controllers/login");
module.exports = function ({ models }) {
    router.post("/", loginValidator, controller({ models }));
    return router;
}
