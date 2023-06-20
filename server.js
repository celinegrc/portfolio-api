const express = require("express");
const cors = require("cors");
const app = express();
const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config();
const mg = require('nodemailer-mailgun-transport');

const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: 'https://portfolio-frontend-celinegrc.vercel.app/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configuration du transport Mailgun
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const transporter = nodemailer.createTransport(mg(auth));

app.get("/", (req, res) => {
  res.send("Hello server");
});

app.post("/post", cors(corsOptions), async (req, res) => {
  try {
    const mailOptions = {
      from: process.env.MAIL,
      to: process.env.MAIL,
      subject: "Formulaire de contact",
      text: `From: ${req.body.email}\nSubject: ${req.body.object}\n\n${req.body.message}`,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent");
    res.json({ status: 200 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;

