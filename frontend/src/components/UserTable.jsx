import React, { useState } from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { api } from "../utils/api";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

export default function UserTable({ users, setUsers, onEdit, page, setPage, pageSize, total }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const handleDeleteClick = (user_id) => {
    setDeleteId(user_id);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/users/${deleteId}`);
      toast.success("User deleted successfully");
      setUsers(users.filter((user) => user.id !== deleteId));
    } catch (error) {
      console.log("Error while deleting user", error);
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
    <div className="mt-6">
      <ConfirmModal
        open={modalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this user?"
      />
      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No users added yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed bg-white border border-gray-200 shadow-md rounded">
              <thead className="bg-gray-300">
                <tr>
                  <th className="py-2 px-4 border-b text-left w-1/6">Name</th>
                  <th className="py-2 px-4 border-b text-left w-1/6">Gender</th>
                  <th className="py-2 px-4 border-b text-left w-1/6">Phone</th>
                  <th className="py-2 px-4 border-b text-left w-1/6">Pin</th>
                  <th className="py-2 px-4 border-b text-left w-1/6">District</th>
                  <th className="py-2 px-4 border-b text-left w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-left">
                      {user.firstname} {user.lastname}
                    </td>
                    <td className="py-2 px-4 border-b text-left">{user.gender}</td>
                    <td className="py-2 px-4 border-b text-left">{user.phone}</td>
                    <td className="py-2 px-4 border-b text-left">{user.pin}</td>
                    <td className="py-2 px-4 border-b text-left">{user.district}</td>
                    <td className="py-2 px-4 border-b text-left space-x-2">
                      <button
                        onClick={() => onEdit(user.id)}
                        className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        title="Edit"
                      >
                        <SquarePen />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user.id)}
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
        </>
      )}
    </div>
  );
}
