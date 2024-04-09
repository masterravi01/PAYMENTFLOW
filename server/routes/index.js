var express = require("express");
var router = express.Router();
let middleware = require("../middleware/middleware");
let UserRouter = require("./user");
let LoginRouter = require("./login");

router.get("/", function (req, resp, next) {
    resp.render("index.html");
});


router.use("/login", LoginRouter);

router.use(middleware.user_authentication);

router.use("/user", UserRouter);

module.exports = router;