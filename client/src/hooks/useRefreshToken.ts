import { useContext } from "react";
import { UserContext, UserContextType } from "../context/user";

const useRefreshToken = () => {
  const { setUser } = useContext<UserContextType>(UserContext)

  const refresh = async () => {
    const response: Response | any = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
    })
    const data = await response.json()
    setUser(prev => { return { ...prev, accessToken: data.accessToken } })
    return data.accessToken;
  }
  return refresh;
}

export default useRefreshToken;