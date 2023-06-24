export default function getGoogleOAuthURL() {
  const rootURL = "https://accounts.google.com/o/oauth2/auth"

  const options = {
    redirect_uri: import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URL as string,
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ')
  }

  const qs = new URLSearchParams(options)
  const url = `${rootURL}?${qs.toString()}`
  // console.log({ options })

  return url
}


