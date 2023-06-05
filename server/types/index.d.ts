
import { User } from "../controllers/post";

declare global {
  namespace Express {
    interface Request {
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
      ACCESS_TOKEN: string;
      REFRESH_TOKEN: string;
      BASE_URL: string;
    }
  }
}
// export {}