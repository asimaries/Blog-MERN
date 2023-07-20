import { createHmac, randomBytes } from "crypto"
import jwt from "jsonwebtoken"

function generateVerificationToken(account: string): string {
  const token = createHmac('sha256', randomBytes(16).toString())
    .update(account).digest('hex').toString()
  return token;
}

export { generateVerificationToken }