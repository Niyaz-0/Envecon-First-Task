import { useContext, createContext, useState } from "react";
import { api } from "../utils/api"
import toast from "react-hot-toast"

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchUsers = async (limit = 5, offset = 0, filters = {}) => {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString()
      });
      
      // Add filters to query params
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.district) params.append('district', filters.district);
      
      // Handle search based on searchField
      if (filters.search) {
        if (filters.searchField === "name") {
          params.append('search', filters.search);
        } else if (filters.searchField === "phone") {
          params.append('phone', filters.search);
        } else if (filters.searchField === "pin") {
          params.append('pin', filters.search);
        }
      }
      
      const response = await api.get(`/users?${params.toString()}`);
      setUsers(response.data.users);
      setTotal(response.data.total);
    } catch (error) {
      console.log("Error in fetching users: ", error);
      toast.error("Error in fetching users");
    }
  };
     
  return (
    <UserContext.Provider value={{ users, setUsers, fetchUsers, total }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext)
