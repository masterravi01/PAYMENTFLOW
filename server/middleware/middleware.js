let schema = require("../database/schema");
let jwt = require("jsonwebtoken");
let User = schema.User;


let user_authentication = async function (req, res, next) {
    if (!req.cookies.RSPToken) {
        return res.status(401).json({
            statusMessage: "Authentication token expired, please login again",

        });
    }

    jwt.verify(req.cookies.RSPToken, process.env.Jwt_secret, async (err, decode) => {
        if (!err) {

            req.body.ActiveUserId = decode.ActiveUserId;
            // if (req.originalUrl != "/ezyinn/admin/read_today_date") {

            // let token = jwt.sign(
            //     { Email: decode.Email, ActiveUserId: decode.ActiveUserId },
            //     process.env.Jwt_secret, { expiresIn: '7d' }
            // );
            // // set token in reponse cookie and send it to client
            // res.cookie("RSPToken", token, {
            //     httpOnly: true,
            //     sameSite: "none",
            //     secure: true,
            // });

            // User.updateOne(
            //     { _id: decode.ActiveUserId },
            //     {
            //         "AuthToken.UpdatedAt": Date.now(),
            //         "AuthToken.Token": token
            //     }
            // );
            // }
            next();
        } else {
            if (err.name == "JsonWebTokenError") {
                return res.status(400).json({
                    statusMessage: "Authentication token not valid",
                    data: { err },
                });
            } else {
                return res.status(401).json({
                    statusMessage: "Authentication token expired, please login again",
                    data: { err },
                });
            }
        }
    });
};


module.exports = {
    user_authentication: user_authentication,
};
