var express = require("express");
var router = express.Router();
let login = require("../controllers/login");
router.post("/userlogin", login.user_login);
router.post("/userSignup", login.user_signup);
router.post("/checkUserExist", login.check_user_exist);
module.exports = router;