require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.APP_PORT || 8888;
const Razorpay = require("razorpay");
const utility = require("./utility");
const mongo = require("./database/connect");
const nodemailer = require("nodemailer");
const axios = require("axios");
const http = require("http");
const socket = require("./controllers/socket");
// const emailtemplate = require('./controllers/emailtemplate')
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
    // let d = await emailtemplate.verify_otp(body);
    // console.log(d);
    const options = {
      method: "POST",
      url: "https://api.brevo.com/v3/smtp/email",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.Brevo_api_key,
      },
      data: {
        sender: { name: "Don King", email: "raviparmar2288@gmail.com" },
        to: [{ email: "ravidreamparmar@gmail.com", name: "John" }],
        htmlContent:
          '<!DOCTYPE html> <html lang="en"> <head>   <meta charset="UTF-8">   <meta name="viewport" content="width=device-width, initial-scale=1.0">   <title>Email Template</title>   <style>     /* Reset CSS */     body, html {       margin: 0;       padding: 0;       font-family: Arial, sans-serif;     }     /* Main container */     .container {       max-width: 600px;       margin: 0 auto;       padding: 20px;     }     /* Header */     .header {       text-align: center;       margin-bottom: 20px;     }     /* Body */     .body {       margin-bottom: 20px;     }     /* Footer */     .footer {       text-align: center;       font-size: 12px;     }   </style> </head> <body>   <div class="container">     <div class="header">       <h1>Your Email Subject</h1>     </div>     <div class="body">       <p>Hello,</p>       <p>This is the body of your email. You can write your message here.</p>       <p>Sincerely,</p>       <p>Your Name</p>     </div>     <div class="footer">       <p>This is the footer of the email.</p>     </div>   </div> </body> </html>',
        subject: "HI there",
      },
    };
    await axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });

    // Create a transporter using Brevo SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587, // Brevo SMTP port
      auth: {
        user: process.env.Brevo_User, // Your Brevo email address
        pass: process.env.Brevo_User_Password, // Your Brevo password
      },
    });

    // Email data
    const mailOptions = {
      from: "raviparmar2288@gmail.com",
      to: "ravidreamparmar@gmail.com",
      subject: "Test Email",
      html: '<!DOCTYPE html> <html lang="en"> <head>   <meta charset="UTF-8">   <meta name="viewport" content="width=device-width, initial-scale=1.0">   <title>Email Template</title>   <style>     /* Reset CSS */     body, html {       margin: 0;       padding: 0;       font-family: Arial, sans-serif;     }     /* Main container */     .container {       max-width: 600px;       margin: 0 auto;       padding: 20px;     }     /* Header */     .header {       text-align: center;       margin-bottom: 20px;     }     /* Body */     .body {       margin-bottom: 20px;     }     /* Footer */     .footer {       text-align: center;       font-size: 12px;     }   </style> </head> <body>   <div class="container">     <div class="header">       <h1>Your Email Subject</h1>     </div>     <div class="body">       <p>Hello,</p>       <p>This is the body of your email. You can write your message here.</p>       <p>Sincerely,</p>       <p>Your Name</p>     </div>     <div class="footer">       <p>This is the footer of the email.</p>     </div>   </div> </body> </html>',
    };

    // Send email
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error occurred:", error);
          reject(error);
        } else {
          console.log("Email sent:", info.response);
          resolve(info.response);
        }
      });
    });

    res.send({ data: data });
  } catch (error) {
    console.log(error);
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
  res.redirect(`${process.env.Frontend_Url}dashboard/`);
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

const server = http.createServer(app);

socket.connection(server);

//push notification code start

const webpush = require("web-push");
const schema = require("./database/schema");
const Subscription = schema.Subscription;

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  "mailto:example_email@example.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.post("/rsp/api/subscribe", async (req, res) => {
  try {
    const subscription = new Subscription(req.body);
    await subscription.save();
    res.status(201).json({});
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/rsp/api/sendNotification", async (req, res) => {
  try {
    const payload = JSON.stringify({
      notification: {
        title: req.body.title,
        body: req.body.body,
        icon: req.body.icon || "assets/icons/icon-384x384.png",
        actions: req.body.actions || [],
        data: req.body.data || {},
      },
    });

    const subscriptions = await Subscription.find();
    const notifications = subscriptions.map((subscription) =>
      webpush.sendNotification(subscription, payload)
    );

    await Promise.all(notifications);
    res.status(200).json({});
  } catch (err) {
    console.error("Notification error:", err);
    res.status(500).json({ error: "Notification error" });
  }
});

//push notification code end

const start = async () => {
  try {
    server.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}/rsp/`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
