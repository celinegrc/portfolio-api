const express = require("express")
const cors = require("cors")
const helmet = require('helmet')
const app = express()
const nodemailer = require("nodemailer")
const dotenv = require('dotenv').config()
const mg = require('nodemailer-mailgun-transport')
const { body, validationResult } = require('express-validator')

const PORT = process.env.PORT || 8000
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Configuration du transport Mailgun
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const transporter = nodemailer.createTransport(mg(auth))


app.get("/", (req, res) => {
  res.send("Hello server");
});


app.post("/post",  [
  body('email').isEmail().normalizeEmail(),
  body('object').notEmpty(),
  body('message').isLength({ min: 10 }),
],
async (req, res) => {
  // Vérifier les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (req.get('Origin') !== 'https://portfolio-frontend-phi-topaz.vercel.app') {
    return res.status(403).json({ error: "Access Forbidden" });
  }

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

