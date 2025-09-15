import React from 'react'
import { SquarePen, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import toast from 'react-hot-toast';

export default function EmployeeTable({ employees, setEmployees }) {

    const navigate = useNavigate()
    
    const onDelete = async (emp_id) => {
        if(!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            const res = await api.delete(`/employees/${emp_id}`)
            toast.success("Employee Deleted Successfully")
            setEmployees(employees.filter(employee => employee.id !== emp_id))
        } catch (error) {
            console.log("Error in deleting employee", error)
        }
    }

  return (
    <div className='mt-6'>
        {employees.length === 0 ? (
            <p className='text-gray-500'>No employees added yet.</p>
        ) : (
            <div className='overflow-x-auto'>
                <table className="min-w-full table-fixed bg-white border border-gray-200 shadow-md rounded">
                    <thead className="bg-gray-300">
                        <tr>
                            <th className="py-2 px-4 border-b text-left w-1/5">Employee Name</th>
                            <th className="py-2 px-4 border-b text-left w-1/5">Employee Id</th>
                            <th className="py-2 px-4 border-b text-left w-1/5">Department</th>
                            <th className="py-2 px-4 border-b text-left w-1/5">Profile</th>
                            <th className="py-2 px-4 border-b text-left w-1/5">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee.id} className="hover:bg-gray-100">
                                <td className="py-2 px-4 border-b text-left">{employee.employee_name}</td>
                                <td className="py-2 px-4 border-b text-left">{employee.employee_id}</td>
                                <td className="py-2 px-4 border-b text-left">{employee.department}</td>
                                <td className="py-2 px-4 border-b text-left">{employee.profile}</td>
                                <td className="py-2 px-4 border-b text-left">
                                    <button className="px-2 py-1 mr-1 bg-yellow-400 text-white rounded hover:bg-yellow-500" onClick={() => navigate(`/employees/${employee.id}`)}><SquarePen /></button>
                                    <button onClick={() => onDelete(employee.id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"><Trash2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  )
}
