import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react"

export interface User {
  _id: String,
  account: String,
  name: String,
  role: String,
  avatar: String,
  accessToken: string
}

export interface UserContextType {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const defaultState = {
  user: {
    _id: '',
    account: '',
    name: '',
    role: '',
    avatar: '',
    accessToken: ''
  },
  setUser: (user: User) => { }
} as UserContextType;

export const UserContext = createContext<UserContextType>(defaultState)

interface UserProviderProps {
  children: ReactNode
}

export default function UserContextProvider(props: UserProviderProps) {
  const [user, setUser] = useState<User>({
    _id: '',
    account: '',
    name: '',
    role: '',
    avatar: '',
    accessToken: ''
  })
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  )
}
