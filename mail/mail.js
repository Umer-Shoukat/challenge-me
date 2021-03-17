const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: "haroonshahzad203",
    pass: "ALPHA@beta203",
  },
  secure: true,
});

module.exports = transporter;
