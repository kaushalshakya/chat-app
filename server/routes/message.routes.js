const router = require("express").Router();
const messageController = require("../controllers/message.controller");

router.get("/", messageController.getMessage);

module.exports = router;
