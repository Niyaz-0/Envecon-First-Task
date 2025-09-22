import { useContext, createContext, useState, useEffect } from "react";
import { api } from "../utils/api"
import toast from "react-hot-toast"

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);

   const fetchUsers = async (limit = 5, offset = 0) => {
          try {

            const response = await api.get(`/users?limit=${limit}&offset=${offset}`);
            setUsers(response.data.users);
            setTotal(response.data.total)

          } catch (error) {
            console.log("Error in fetching users: ", error)
            toast.error("Error in fetching users")
          }
        };
     
  return (
    <UserContext.Provider value={{ users, setUsers, fetchUsers, total }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext)
