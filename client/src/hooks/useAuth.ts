import { useContext, useDebugValue } from "react";
import  { UserContext } from "../context/user";

const useAuth = () => {
    const { user } = useContext(UserContext);
    useDebugValue(user, user => user ? "Logged In" : "Logged Out")
    return useContext(UserContext);
}

export default useAuth;