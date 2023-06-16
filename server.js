const express = require("express")
const cors = require("cors")
const app = express()
const nodemailer = require("nodemailer")
const dotenv = require('dotenv').config()

const PORT = (process.env.PORT || 8000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello server");
});

app.post("/post", async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.OUTLOOK_USERNAME,
        pass: process.env.OUTLOOK_PASSWORD,
      },
      /*authMethod: 'PLAIN',
      authOptions: {
      user: process.env.VERCEL_SECRET_OUTLOOK_USERNAME,
      pass: process.env.VERCEL_SECRET_OUTLOOK_PASSWORD,
      },*/
    })

    const mailOptions = {
      from:  process.env.MAIL,
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



module.exports = app