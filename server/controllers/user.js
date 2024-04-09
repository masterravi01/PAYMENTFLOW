let schema = require("../database/schema");
var mongoose = require("mongoose");

let User = schema.User;
let Product = schema.Product;

let read_users = async function (req, res, next) {
    let body = req.body;
    let data = {};
    try {
        // let user = new User();
        // user.Name.First = body.First;
        // user.Name.Last = body.Last;
        // user.UserName = body.First + "" + body.Last;
        // user.DOB = body.DOB;
        // user.Email = body.Email;
        // await user.save();
        // let p = new Product({
        //     name: "TV",
        //     price: 10,
        //     featured: true,
        //     company: "puma"
        // });
        // await p.save();

        data.Users = await User.find();

        return res
            .status(200)
            .json({
                statusMessage: "User get successfully!",
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

let add_users = async function (req, res, next) {
    let body = req.body;
    let data = {};
    try {


        data.Users = await User.insertMany(body.Users);

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
let update_user = async function (req, res, next) {
    let body = req.body;
    let data = {};
    try {


        data.Users = await User.findOneAndUpdate({ _id: body.User._id }, body.User);

        return res
            .status(200)
            .json({
                statusMessage: "User update successfully!",
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

let delete_user = async function (req, res, next) {
    let body = req.body;
    let data = {};
    try {


        data.Users = await User.findOneAndDelete({ _id: body.User._id });

        return res
            .status(200)
            .json({
                statusMessage: "User delete successfully!",
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
    read_users,
    add_users,
    delete_user,
    update_user
};