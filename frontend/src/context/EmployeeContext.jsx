import { useContext, createContext, useState } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [total, setTotal] = useState(0);

    const fetchEmployees = async (limit = 10, offset = 0) => {
        try {
            const response = await api.get(`/employees?limit=${limit}&offset=${offset}`);
            setEmployees(response.data.employees);
            setTotal(response.data.total);
        } catch (error) {
            console.log("Error while fetching Employees: ", error)
            toast.error("Error while fetching Employees")
        }
    }

    return (
        <EmployeeContext.Provider value={{ employees, setEmployees, fetchEmployees, total }}>
            {children}
        </EmployeeContext.Provider>
    )
}

export const useEmployees = () => useContext(EmployeeContext);