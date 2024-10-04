// functions/index.js

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass,
  },
});

// Cloud Function to send email
exports.sendEmail = functions.https.onRequest((req, res) => {
  // Ensure it's a POST request
  if (req.method !== "POST") {
    return res.status(405).send({error: "Method Not Allowed"});
  }

  const {name, email, message} = req.body;

  // Create the email options
  const mailOptions = {
    from: email, // Sender address (the email of the guest user)
    to: functions.config().email.receiver, // Your email to receive messages
    subject: `New message from ${name}`, // Subject line
    text: message, // Message body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({error: "Error sending email"});
    }
    res.status(200).send({message: "Email sent successfully!"});
  });
});
