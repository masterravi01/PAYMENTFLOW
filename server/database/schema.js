var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const User_Schema = new Schema(
    {
        id: {
            type: "ObjectId",
            index: true,
        },
        UserName: String,
        Name: {
            First: {
                type: String,
                set: (v) => {
                    return v.replace(/\w\S*/g, function (txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                },
            },
            Last: {
                type: String,
                set: (v) => {
                    return v.replace(/\w\S*/g, function (txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                },
            },
        },
        Email: String,
        Password: String,
        GoogleSubId: String,
        DOB: Date,
        MaxAttempt: { type: Number, default: 0 },
        Active: {
            type: Boolean,
            default: true,
        },
        VerificationOTP: {
            OTP: Number,
            UpdatedAt: Date,
        },
        ProfilePic: String,
        ResetPassword: {
            Token: String,
            Expires: Date,
        },
        AuthToken: {
            Token: String,
            UpdatedAt: Date,
        },
    }, { timestamps: true }
);

const User = mongoose.model("User", User_Schema); //pass singular in db created prular


const Product_Schema = new Schema({
    name: {
        type: String,
        required: [true, "name must be provided"]
    },
    price: {
        type: Number,
        required: [true, "price must be provided"]
    },
    featured: {
        type: Boolean,
        default: false
    },
    company: {
        type: String,
        enum: [
            "adidas", "puma", "sony"
        ],
        default: "sony"
    }
}, { timestamps: true });

const Product = mongoose.model("Product", Product_Schema); //pass singular in db created prular

module.exports = {
    User,
    Product,
}

