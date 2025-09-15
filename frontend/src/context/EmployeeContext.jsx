import { useContext, createContext, useState, useEffect } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {

    const [employees, setEmployees] = useState([]);

    const fetchEmployees = async () => {
        try {
            
            const response = await api.get("/employees")
            setEmployees(response.data)
        } catch (error) {
            console.log("Error while fetching Employees: ", error)
            toast.error("Error while fetching Employees")
        }
    }

    useEffect(() => {
        fetchEmployees()
    }, [])

    return (
        <EmployeeContext.Provider value={{ employees, setEmployees, fetchEmployees }}>
            {children}
        </EmployeeContext.Provider>
    )
}

export const useEmployees = () => useContext(EmployeeContext);