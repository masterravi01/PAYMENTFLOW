var express = require("express");
var router = express.Router();
let user = require("../controllers/user");

router.post("/readusers", user.read_users);
router.post("/updateuser", user.update_user);
router.post("/deleteuser", user.delete_user);
router.post("/addusers", user.add_users);
module.exports = router;