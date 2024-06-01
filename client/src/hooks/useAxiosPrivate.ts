import { useContext, useEffect } from 'react';
// import axios from 'axios';

import { useUser } from "../context/user";
import jwtDecode from 'jwt-decode';
import useRefreshToken from './useRefreshToken';
import { api } from '../api';

const useAxiosPrivate = () => {

  const { user } = useUser()
  const refresh = useRefreshToken()


  useEffect(() => {

    const requestIntercept = api.interceptors.request.use(
      async (config: any) => {
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

    const responseIntercept = api.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const prevRequest = error.config
        if (error?.response?.status === 403 && !prevRequest.sent) {
          prevRequest.sent = true
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return api(prevRequest)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      api.interceptors.request.eject(requestIntercept)
      api.interceptors.response.eject(responseIntercept)
    }
  }, [user, refresh])


  return api
}


export default useAxiosPrivate