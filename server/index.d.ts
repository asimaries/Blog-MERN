
import { Secret } from "jsonwebtoken";
import { User } from "./src/controllers/blog";

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MAIL_USERNAME: string;
      MAIL_PASSWORD: string;
      TWILIO_SID: string;
      TWILIO_TOKEN: string;
      ACCESS_TOKEN: Secret;
      REFRESH_TOKEN: Secret;
      BASE_URL: string;
    }
  }
}
export { }