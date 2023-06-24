import { useContext, useEffect } from 'react';
// import axios from 'axios';

import { UserContext, UserContextType } from "../context/user";
import jwtDecode from 'jwt-decode';
import useRefreshToken from './useRefreshToken';
import { privateAPI } from '../api';

const useAxiosPrivate = () => {

  const { user }: UserContextType = useContext<UserContextType>(UserContext)
  const refresh = useRefreshToken()


  useEffect(() => {

    const requestIntercept = privateAPI.interceptors.request.use(
      async (config) => {
        {
          if (!config.headers.Authorization)
            config.headers.Authorization = `Bearer ${user.accessToken}`
          const decodedToken: any = jwtDecode(user.accessToken)
          if (decodedToken.exp * 1000 < new Date().getTime()) {
            const newAccessToken = await refresh()
            config.headers.Authorization = `Bearer ${newAccessToken}`
          } else
            config.headers.Authorization = `Bearer ${user.accessToken}`
          return config
        }
      },
      (error: any) => Promise.reject(error)
    )

    const responseIntercept = privateAPI.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error.config
        if (error?.response.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return privateAPI(prevRequest)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      privateAPI.interceptors.request.eject(requestIntercept)
      privateAPI.interceptors.response.eject(responseIntercept)
    }
  }, [user, refresh])


  return privateAPI
}


export default useAxiosPrivate