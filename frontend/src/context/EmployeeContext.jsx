import { useContext, createContext, useState } from "react";
import { api } from "../utils/api";
import toast from "react-hot-toast";

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [total, setTotal] = useState(0);

    const fetchEmployees = async (limit = 10, offset = 0, filters = {}) => {
        try {
            const params = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString()
            });
            
            // Add filters to query params
            if (filters.department) params.append('department', filters.department);
            if (filters.profile) params.append('profile', filters.profile);
            
            // Handle search based on searchField
            if (filters.search) {
                if (filters.searchField === "name") {
                    params.append('search', filters.search);
                } else if (filters.searchField === "id") {
                    params.append('employee_id', filters.search);
                }
            }
            
            const response = await api.get(`/employees?${params.toString()}`);
            setEmployees(response.data.employees);
            setTotal(response.data.total);
        } catch (error) {
            console.log("Error while fetching Employees: ", error);
            toast.error("Error while fetching Employees");
        }
    }

    return (
        <EmployeeContext.Provider value={{ employees, setEmployees, fetchEmployees, total }}>
            {children}
        </EmployeeContext.Provider>
    )
}

export const useEmployees = () => useContext(EmployeeContext);