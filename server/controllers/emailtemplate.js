let schema = require("../database/schema");
var mongoose = require("mongoose");

let User = schema.User;
const nodemailer = require("nodemailer");

const send_otp = async (body) => {
    // Extract required data from body
    const { userid } = body;

    try {
        // Generate OTP

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 10);

        let VerificationOTP = {
            OTP: otp,
            Expires: expiryDate,
        }

        // Update user with OTP
        const updatedUser = await User.findOneAndUpdate(
            { _id: userid },
            { $set: { VerificationOTP: VerificationOTP } },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error('User not found');
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587, // Brevo SMTP port
            auth: {
                user: process.env.Brevo_User, // Your Brevo email address
                pass: process.env.Brevo_User_Password // Your Brevo password
            }
        });

        // Email data
        const mailOptions = {
            from: process.env.Brevo_User,
            to: updatedUser.Email,
            subject: `${otp} otp for Rsp Email Verification `,
            html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Email Verification</title><style>/* Reset CSS */body,html {margin: 0;padding: 0;font-family: Arial, sans-serif;}/* Main container */.container {max-width: 600px;margin: 0 auto;padding: 20px;}/* Header */.header {text-align: center;margin-bottom: 20px;}/* Body */.body {margin-bottom: 20px;}/* Footer */.footer {text-align: center;font-size: 12px;}</style></head><body><div class="container"><div class="header"><h1>Email Verification</h1></div><div class="body"><p>Hello ${updatedUser.UserName},</p><p>This is a 6-digit One-Time Password (OTP) for verifying your email: <strong>${otp}</strong>. It will expire in 2 minutes.</p><p>Sincerely,</p><p>RSP Technical Team</p></div><div class="footer"><p>We never send misleading emails to customers.</p></div></div></body></html>`,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info.response;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
}

const verify_otp = async (body) => {
    // Extract required data from body
    const { Email, otp } = body;

    try {
        // Find user by email
        const user = await User.findOne({ Email: Email });

        if (!user) {
            throw new Error('User not found');
        }

        // Check if OTP exists and is not expired
        if (!user.VerificationOTP || user.VerificationOTP.Expires < new Date()) {
            throw new Error('OTP expired or not generated');
        }

        // Check if OTP matches
        if (user.VerificationOTP.OTP !== Number(otp)) {
            throw new Error('Invalid OTP');
        }

        // If OTP is valid, perform any necessary actions (e.g., mark email as verified)

        return { message: 'OTP verified successfully' };
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
}


module.exports = {
    send_otp,
    verify_otp
};