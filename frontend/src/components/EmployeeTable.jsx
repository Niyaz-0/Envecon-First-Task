import React, { useState } from 'react';
import { SquarePen, Trash2 } from "lucide-react";
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';

export default function EmployeeTable({ employees, setEmployees, onEdit, page, setPage, pageSize, total }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
                    <button
                      className="px-2 py-1 mr-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center items-center gap-2 mt-4">
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
          disabled={page * pageSize >= total}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
