import { useContext, createContext, useState, useEffect } from "react";
import { api } from "../utils/api"
import toast from "react-hot-toast"

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

   const fetchUsers = async () => {
          try {

            const response = await api.get("/users");
            setUsers(response.data);


          } catch (error) {
            console.log("Error in fetching users: ", error)
            toast.error("Error in fetching users")
          }
        };


  useEffect(() => {
        fetchUsers();
      }, []);

     
  return (
    <UserContext.Provider value={{ users, setUsers, fetchUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext)
