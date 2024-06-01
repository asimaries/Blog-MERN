import { createContext, useState, ReactNode, Dispatch, SetStateAction, useContext, useEffect } from "react"
import { useAsync } from "../hooks/useAsync";

import Cookies from 'js-cookie';
import jwtDecode from "jwt-decode";
import useRefreshToken from "../hooks/useRefreshToken";
import { api } from "../api";

export interface User {
  id: string,
  account: string,
  name: string,
  avatar: string,
  accessToken: string
}

export interface UserContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const defaultState = {
  user: {
    id: '',
    account: '',
    name: '',
    avatar: '',
    accessToken: ''
  },
  setUser: (user: User) => { }
} as UserContextType;

const UserContext = createContext<UserContextType>(defaultState)

interface UserProviderProps {
  children: ReactNode
}

export function useUser() {
  return useContext<UserContextType>(UserContext)
}

export default function UserContextProvider(props: UserProviderProps) {
  const [user, setUser] = useState<User>({
    id: '',
    account: '',
    name: '',
    avatar: '',
    accessToken: ''
  })



  // console.log(value)
  // setUser({ ...value.data.user, accessToken: value.data.accessToken })
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  )
}
