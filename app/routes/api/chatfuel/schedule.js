const router = require("express").Router();
const { chatfuelValidator } = require("@helpers/validator");

module.exports = function({ models }) {
    const { download, saveSchedule, search, broadcast } = require("@controllers/chatfuel/schedule")({ models });
    router.get("/download/", chatfuelValidator, download);
    router.get("/save", chatfuelValidator, saveSchedule);
    router.get("/search/", chatfuelValidator, search);
    router.get("/broadcast/", chatfuelValidator, broadcast);
    return router;
}
