const router = require("express").Router();
const { chatfuelValidator } = require("@helpers/validator");

module.exports = function({ models }) {
    const { getDownload, postDownload, search, broadcast } = require("@controllers/chatfuel/schedule")({ models });
    router.get("/download", chatfuelValidator, getDownload);
    router.post("/download", chatfuelValidator, postDownload);
    router.get("/search", chatfuelValidator, search);
    router.get("/broadcast", chatfuelValidator, broadcast);
    return router;
}
