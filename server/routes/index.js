var express = require("express");
var router = express.Router();
let middleware = require("../middleware/middleware");
let UserRouter = require("./user");
let LoginRouter = require("./login");
let Socket = require('../controllers/socket')
router.get("/", function (req, resp, next) {
    resp.render("index.html");
});


router.use("/login", LoginRouter);
router.get("/getMsgs", Socket.getMsgs);
router.use(middleware.user_authentication);

router.use("/user", UserRouter);

module.exports = router;