import nodemailer from "nodemailer";
import { config } from "dotenv"
config()
const mail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
})


const details = {
  from: process.env.MAIL_USERNAME,
  to: [""],
  subject: "Verification Mail",
  html: ``
}

function sendMail(to: string[], link: string) {
  details.to = to;
  details.html = `Please verify your email: <a href="${process.env.BASE_URL}/verify/${link}"><button>CLick here to verify</button></a>`
  mail.sendMail(details, (err) => {
    if (err) {
      console.log("it error ", err)
    } else {
      console.log("sent")
    }
  })

}

export { sendMail };