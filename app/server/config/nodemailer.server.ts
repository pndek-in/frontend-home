import nodemailer from "nodemailer"

const transporterConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
}

export const transporter = nodemailer.createTransport(transporterConfig)

transporter.verify((error) => {
  if (error) {
    console.log(error, " | error from nodemailer")
  } else {
    console.log("Server is ready to take our messages")
  }
})
