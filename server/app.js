require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.APP_PORT || 8888;
const Razorpay = require("razorpay");
const utility = require("./utility");
const mongo = require('./database/connect');
const nodemailer = require("nodemailer");
const axios = require('axios');

app.use(express.json()); // For parsing JSON request bodies
// Enable CORS for all routes

app.use(
    cors({
        origin: true,

        credentials: true,
    })
);

app.post("/rsp/sendmail", async (req, res) => {

    let body = req.body;
    let data = {};
    try {
        const options = {
            method: 'POST',
            url: 'https://api.brevo.com/v3/smtp/email',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'api-key': process.env.Brevo_api_key
            },
            data: {
                sender: { name: 'Don King', email: 'raviparmar2288@gmail.com' },
                to: [{ email: 'ravidreamparmar@gmail.com', name: 'John' }],
                htmlContent: '<!DOCTYPE html> <html lang="en"> <head>   <meta charset="UTF-8">   <meta name="viewport" content="width=device-width, initial-scale=1.0">   <title>Email Template</title>   <style>     /* Reset CSS */     body, html {       margin: 0;       padding: 0;       font-family: Arial, sans-serif;     }     /* Main container */     .container {       max-width: 600px;       margin: 0 auto;       padding: 20px;     }     /* Header */     .header {       text-align: center;       margin-bottom: 20px;     }     /* Body */     .body {       margin-bottom: 20px;     }     /* Footer */     .footer {       text-align: center;       font-size: 12px;     }   </style> </head> <body>   <div class="container">     <div class="header">       <h1>Your Email Subject</h1>     </div>     <div class="body">       <p>Hello,</p>       <p>This is the body of your email. You can write your message here.</p>       <p>Sincerely,</p>       <p>Your Name</p>     </div>     <div class="footer">       <p>This is the footer of the email.</p>     </div>   </div> </body> </html>',
                subject: 'HI there'
            }
        };
        console.log("b1")
        await axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.error(error);
            });

        console.log("b2")

        // Create a transporter using Brevo SMTP settings
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
            from: 'raviparmar2288@gmail.com',
            to: 'ravidreamparmar@gmail.com',
            subject: 'Test Email',
            html: '<!DOCTYPE html> <html lang="en"> <head>   <meta charset="UTF-8">   <meta name="viewport" content="width=device-width, initial-scale=1.0">   <title>Email Template</title>   <style>     /* Reset CSS */     body, html {       margin: 0;       padding: 0;       font-family: Arial, sans-serif;     }     /* Main container */     .container {       max-width: 600px;       margin: 0 auto;       padding: 20px;     }     /* Header */     .header {       text-align: center;       margin-bottom: 20px;     }     /* Body */     .body {       margin-bottom: 20px;     }     /* Footer */     .footer {       text-align: center;       font-size: 12px;     }   </style> </head> <body>   <div class="container">     <div class="header">       <h1>Your Email Subject</h1>     </div>     <div class="body">       <p>Hello,</p>       <p>This is the body of your email. You can write your message here.</p>       <p>Sincerely,</p>       <p>Your Name</p>     </div>     <div class="footer">       <p>This is the footer of the email.</p>     </div>   </div> </body> </html>',

        };

        // Send email
        console.log("b3")
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });
        console.log("b4")

        res.send({ data: data });
    } catch (error) {
        console.log(error)
        res.send(error);
    }
});

// base url
app.get("/rsp/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "server is up and running!",
    });
});

var cookieParser = require("cookie-parser");
app.use(cookieParser());

let indexRouter = require("./routes/index");
app.use("/rsp", indexRouter);

var instance = new Razorpay({
    key_id: process.env.Razor_key_id,
    key_secret: process.env.Razor_key_secret,
});

app.post("/rsp/api/login", (req, res) => {
    // Handle POST request here
    console.log("login", req.body); // Print the POST request body to console
    res.redirect('http://localhost:4201/dashboard/')
});

app.post("/rsp/api/createPaymentOrder", (req, res) => {
    // Handle POST request here
    var amount = utility.rupeesToPaise(req.body.payload.amount);
    var options = {
        amount: amount, // amount in the smallest currency unit here paise
        currency: "INR",
        receipt: "order_rcptid_11",
        notes: {
            key1: "value3",
            key2: "value2",
        },
    };
    instance.orders.create(options, function (err, order) {
        if (err) {
            res.status(500);
            let response = { status: 500, data: err };
            res.send(response);
        } else if (order) {
            res.status(200);
            let response = { status: 200, data: order };
            res.send(response);
        }
    });
});

app.post("/rsp/api/validatePayment", (req, res) => {
    const razorpay_signature = req.body.payload.razorpay_signature;
    const secret = instance.key_secret;
    const order_id = req.body.payload.original_order_id;
    const razorpay_payment_id = req.body.payload.razorpay_payment_id;
    var {
        validatePaymentVerification,
    } = require("./node_modules/razorpay/dist/utils/razorpay-utils");

    const isPaymentVerfied = validatePaymentVerification(
        { order_id: order_id, payment_id: razorpay_payment_id },
        razorpay_signature,
        secret
    );
    isPaymentVerfied ? res.status(200) : res.status(500);
    res.send({ data: { isPaymentVerfied: isPaymentVerfied } });
});

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server listening at http://localhost:${port}/rsp/`);
        });
    } catch (error) {
        console.log(error);
    }
}
start();
