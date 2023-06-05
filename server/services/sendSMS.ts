import { Twilio } from "twilio";
import { config } from "dotenv";
config()
const client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)

function sendSMS(to: string, link: string) {
  try {
    const textContent = {
      body: ` Please verify your email: \n${process.env.BASE_URL}/verify/${link}`,
      from: process.env.TWILIO_PHONENO,
      to: to
    }
    client.messages.create(textContent)
      .then((message) => console.log(message.to))

  } catch (error: any) {
    if (error.code === 21211)
      throw new Error("Not valid Phone No.")
    console.log(error)
  }
}


export { sendSMS }