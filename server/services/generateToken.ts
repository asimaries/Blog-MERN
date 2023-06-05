import { createHmac, randomBytes } from "crypto"
import jwt from "jsonwebtoken"

function generateVerificationToken(email: string) {
  const token = createHmac('sha256', randomBytes(16).toString())
    .update(email).digest('hex')
  return token;
}

export { generateVerificationToken }