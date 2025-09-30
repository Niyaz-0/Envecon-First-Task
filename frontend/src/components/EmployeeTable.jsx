import React, { useState } from 'react';
import { SquarePen, Trash2, Search } from "lucide-react";
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';

export default function EmployeeTable({ 
  employees, setEmployees, onEdit, page, setPage, 
  pageSize, setPageSize, total, onFilter 
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Filter states - add searchField to match UserTable
  const [filters, setFilters] = useState({
    search: "",
    department: "",
    profile: "",
    searchField: "name" // Default to filtering by name
  });
  
  // Filter options
  const departments = ["HR", "Sales", "Finance", "Engineering", "Marketing"];
  const profiles = ["Manager", "Team Lead", "Senior Developer", "Intern", "Trainee"];
  
  // Search field options
  const searchFields = [
    { value: "name", label: "Name" },
    { value: "id", label: "Employee ID" }
  ];
  
  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // If we're not on page 1, reset to page 1
    if (page !== 1) {
      setPage(1);
    }
    
    // Pass the filters to parent component
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const handleDeleteClick = (emp_id) => {
    setDeleteId(emp_id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/employees/${deleteId}`);
      toast.success("Employee Deleted Successfully");
      setEmployees(employees.filter(employee => employee.id !== deleteId));
    } catch (error) {
      console.log("Error in deleting employee", error);
    } finally {
      setModalOpen(false);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setModalOpen(false);
    setDeleteId(null);
  };

  return (
    <div className='mt-6'>
      <ConfirmModal
        open={modalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this employee?"
      />
      
      {/* Filters Section */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex flex-1 min-w-[200px] gap-2">
          <select
            value={filters.searchField}
            onChange={(e) => handleFilterChange("searchField", e.target.value)}
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {searchFields.map(field => (
              <option key={field.value} value={field.value}>{field.label}</option>
            ))}
          </select>
          
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={`Search by ${searchFields.find(f => f.value === filters.searchField)?.label}`}
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
          </div>
        </div>
        
        <select
          value={filters.department}
          onChange={(e) => handleFilterChange("department", e.target.value)}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">All Departments</option>
          {departments.map(department => (
            <option key={department} value={department}>{department}</option>
          ))}
        </select>

        <select
          value={filters.profile}
          onChange={(e) => handleFilterChange("profile", e.target.value)}
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">All Profiles</option>
          {profiles.map(profile => (
            <option key={profile} value={profile}>{profile}</option>
          ))}
        </select>
      </div>

      {employees.length === 0 ? (
        <p className='text-gray-500 text-center py-8'>No employees found.</p>
      ) : (
        <>
          <div className='overflow-x-auto'>
            <table className="min-w-full table-fixed bg-white border border-gray-200 shadow-md rounded">
              <thead className="bg-gray-300">
                <tr>
                  <th className="py-2 px-4 border-b text-left w-1/12">Sr.No</th>
                  <th className="py-2 px-4 border-b text-left w-1/5">Employee Name</th>
                  <th className="py-2 px-4 border-b text-left w-1/5">Employee Id</th>
                  <th className="py-2 px-4 border-b text-left w-1/5">Department</th>
                  <th className="py-2 px-4 border-b text-left w-1/5">Profile</th>
                  <th className="py-2 px-4 border-b text-left w-1/5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, idx) => (
                  <tr key={employee.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-left">
                      {(page - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-2 px-4 border-b text-left">{employee.employee_name}</td>
                    <td className="py-2 px-4 border-b text-left">{employee.employee_id}</td>
                    <td className="py-2 px-4 border-b text-left">{employee.department}</td>
                    <td className="py-2 px-4 border-b text-left">{employee.profile}</td>
                    <td className="py-2 px-4 border-b text-left">
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                          onClick={() => onEdit(employee.id)}
                          title="Edit"
                        >
                          <SquarePen />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(employee.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          title="Delete"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
            <div className="flex items-center gap-2">
              <label htmlFor="pageSize" className="text-gray-700">Rows per page:</label>
              <select
                id="pageSize"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {[5, 10, 20].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.max(1, Math.ceil(total / pageSize))}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
