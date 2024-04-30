const router = require("express").Router();
const userControllers = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.get("/", auth, userControllers.getUsers);

module.exports = router;
