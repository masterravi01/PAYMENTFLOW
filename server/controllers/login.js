let schema = require("../database/schema");
var mongoose = require("mongoose");
let User = schema.User;
let jwt = require("jsonwebtoken");
let decrypt = require("./decryption");
let crypto = require("crypto");
var bcrypt = require("bcryptjs");

let user_login = async function (req, res, next) {
    let body = req.body;
    let data = {};
    try {
        res.clearCookie("Token");
        if (body.Password) body.Password = decrypt(body.Password);
        data.Users = await User.find({
            Email: body.Email
        });
        if (data.Users.length > 0 && bcrypt.compareSync(req.body.Password, data.Users[0].Password)) {
            let token = jwt.sign(
                { Email: data.Users[0].Email, ActiveUserId: data.Users[0]._id },
                process.env.Jwt_secret, { expiresIn: '7d' }
            );
            // set token in reponse cookie and send it to client
            res.
                cookie("Token", token, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                });
            return res
                .status(200)
                .json({
                    statusMessage: "User get successfully!",
                    data: data,
                });
        } else {
            return res
                .status(401)
                .json({
                    statusMessage: "User Doesn't Exist !",
                    data: data,
                });
        }

    } catch (error) {
        return res
            .status(501)
            .json({
                statusMessage: "error",
                data: error,
            });
    }
};


let user_signup = async function (req, res, next) {
    let body = req.body;
    let data = {};
    try {
        body.User.Name = { First: body.User.FirstName, Last: body.User.LastName };
        body.User.UserName = body.User.FirstName + " " + body.User.LastName;
        if (body.User?.Password) body.User.Password = decrypt(body.User.Password);
        body.User.Password = bcrypt.hashSync(body.User.Password, Number(process.env.SALT_WORK_FACTOR));
        let newUser = new User(body.User);
        await newUser.save();
        data.User = newUser;

        return res
            .status(200)
            .json({
                statusMessage: "User add successfully!",
                data: data,
            });
    } catch (error) {
        return res
            .status(501)
            .json({
                statusMessage: "error",
                data: error,
            });
    }
};

let check_user_exist = async function (req, res, next) {
    let body = req.body;
    let data = {};
    try {
        data.Users = await User.find({
            Email: body.email,
            GoogleSubId: body.sub
        });
        return res
            .status(200)
            .json({
                statusMessage: "User exist successfully!",
                data: data,
            });

    } catch (error) {
        return res
            .status(501)
            .json({
                statusMessage: "error",
                data: error,
            });
    }
};

module.exports = {
    user_login,
    user_signup,
    check_user_exist
};