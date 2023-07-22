import { useContext } from "react";
import { useUser } from "../context/user";
import axios from "axios";

const useRefreshToken = () => {
  const { setUser } = useUser()

  const refresh = async () => {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    const data = response.data;
    // const response: Response | any = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   credentials: "include",
    // })
    // const data = await response.json()
    setUser(prev => { return { ...prev, accessToken: data.accessToken } })
    return data.accessToken;
  }
  return refresh;
}

export default useRefreshToken;