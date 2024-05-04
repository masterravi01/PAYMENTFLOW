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
        data.User = await User.findOne({
            Email: body.Email
        });
        if (data.User && bcrypt.compareSync(req.body.Password, data.User.Password)) {
            let token = jwt.sign(
                { Email: data.User.Email, ActiveUserId: data.User._id },
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

let forgot_password = async function (req, res, next) {
    let body = req.body;
    let data = {};
    try {
        data.User = await User.findOne({
            Email: body.Email,
        });
        if (data.User) {
            let token = crypto.randomBytes(20).toString("hex");
            let update_obj = {
                ResetPassword: {
                    Token: token,
                    Expires: Date.now() + +900000, //15 minutes expiry time
                },
            }
            await User.findOneAndUpdate({ Email: body.Email }, { $set: update_obj });

            console.log(
                `http://localhost:4201/loginop/resetpassword/` + token
            );

            return res
                .status(200)
                .json({
                    statusMessage: "User exist successfully!",
                    data: data,
                });
        } else {
            return res
                .status(401)
                .json({
                    statusMessage: "User doesn't exist successfully!",
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

let check_reset_token = async function (req, res, next) {
    let body = req.body;
    let data = {};
    try {
        data.User = await User.findOne({
            'ResetPassword.Token': body.Token,
        });
        if (data.User) {
            if (data.User.ResetPassword?.Expires > Date.now()) {
                return res
                    .status(200)
                    .json({
                        statusMessage: "User exist successfully!",
                        data: data,
                    });
            } else {
                return res
                    .status(401)
                    .json({
                        statusMessage: "User Time is expires for reset password ",
                        data: data,
                    });
            }



        } else {
            return res
                .status(401)
                .json({
                    statusMessage: "User doesn't exist successfully!",
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

let reset_password = async function (req, res, next) {
    let body = req.body;
    let data = {};
    try {
        res.clearCookie("Token");
        if (body.User?.Password) body.User.Password = decrypt(body.User.Password);
        body.User.Password = bcrypt.hashSync(body.User.Password, Number(process.env.SALT_WORK_FACTOR));

        data.User = await User.findOneAndUpdate({
            Email: body.User.Email,
        }, {
            $set: {
                Password: body.User.Password,
                ResetPassword: {
                    Token: null,
                    Expires: null
                }
            }
        });
        return res
            .status(200)
            .json({
                statusMessage: "User Password Reset Successfully!",
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
    check_user_exist,
    forgot_password,
    check_reset_token,
    reset_password
};