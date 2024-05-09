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
        UserType: { type: String, enum: ['customer', 'admin'], default: 'customer' },
        MaxAttempt: { type: Number, default: 0 },
        Active: {
            type: Boolean,
            default: true,
        },
        VerificationOTP: {
            OTP: Number,
            Expires: Date,
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
    company: String,
    images: Array,
}, { timestamps: true });

const Product = mongoose.model("Product", Product_Schema); //pass singular in db created prular


const Order_Schema = new Schema({
    UserId: [
        {
            type: "ObjectId",
            ref: "User",
            required: true
        },
    ],
    items: [{
        product: { type: "ObjectId", ref: 'Product', required: true },
        quantity: { type: Number, default: 1 },
        price: Number
    }],
    totalPrice: Number,
    status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },

}, { timestamps: true });

const Order = mongoose.model('Order', Order_Schema);

const Address_Schema = new Schema({
    UserId: [
        {
            type: "ObjectId",
            ref: "User",
            required: true
        },
    ],
    AddressType: {
        type: String,
        enum: ["Personal", "Work"],
        default: "Work",
    },
    Phone: String,
    ZipCode: String,
    Country: String,
    State: String,
    City: String,
    District: String,
    Province: String,
    AddressLine1: String,
    AddressLine2: String,
    AddressLine3: String,

}, { timestamps: true });

const Address = mongoose.model('Address', Address_Schema);

module.exports = {
    User,
    Product,
    Order,
    Address
}

