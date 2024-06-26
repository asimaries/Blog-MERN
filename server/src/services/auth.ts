import JWT, { Secret, SignOptions } from "jsonwebtoken"
import { User } from "../controllers/blog";

function createPayload(user: User): any {

  const payload = {
    id: user.id,
    account: user.account,
    name: user.name,
    avatar: user.avatar,
  }
  return payload;
}

function createToken(user: User): any {
  user = createPayload(user)
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)
  return { accessToken, refreshToken };
}

async function validateAccessToken(token: string) {
  return JWT.verify(token, process.env.ACCESS_TOKEN as Secret, async (error, user) => {

    if (user) return user;

    if (error?.message === 'jwt expired')
      return { success: false, message: 'Access token expired' }

    console.log(error)

    return { error, message: 'User not Authenticated' }
  });
}

function validateRefreshToken(token: string) {
  return JWT.verify(token, process.env.REFRESH_TOKEN as Secret);
}

function generateAccessToken(user: User): any {
  const payload = createPayload(user)
  return JWT.sign(payload, `${process.env.ACCESS_TOKEN}`, { expiresIn: '1h' })
}

function generateRefreshToken(user: User): any {
  const payload = createPayload(user)
  return JWT.sign(payload, `${process.env.REFRESH_TOKEN}`, { expiresIn: '1d' })
}

async function getGoogleOAuthToken({ code }: { code: string }) {
  const url = 'https://oauth2.googleapis.com/token'

  const values = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL as string,
    grant_type: 'authorization_code'
  })

  try {
    const res = await fetch(url, {
      method: "POST",
      body: values,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    })
    const data = await res.json();
    return data.data;
  } catch (error: any) {
    console.log(error)
  }
}


export {
  createToken,
  validateAccessToken,
  validateRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  getGoogleOAuthToken
};