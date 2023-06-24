import axios from 'axios';

import getGoogleOAuthURL from "./getGoogleOAuthURL";


export default axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`
});
const privateAPI = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

export { getGoogleOAuthURL, privateAPI }