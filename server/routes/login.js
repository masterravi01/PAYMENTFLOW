var express = require("express");
var router = express.Router();
let login = require("../controllers/login");
router.post("/userlogin", login.user_login);
router.post("/userSignup", login.user_signup);
router.post("/checkUserExist", login.check_user_exist);
router.post("/forgot_password", login.forgot_password);
router.post("/check_reset_token", login.check_reset_token);
router.post("/reset_password", login.reset_password);
module.exports = router;