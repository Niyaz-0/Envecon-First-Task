import React from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import toast from "react-hot-toast";

export default function UserTable({ users, setUsers }) {
  const navigate = useNavigate();

  const onDelete = async (user_id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/users/${user_id}`);
      toast.success("User deleted successfully");
      setUsers(users.filter((user) => user.id !== user_id));
    } catch (error) {
      console.log("Error while deleting user", error);
    }
  };

  return (
    <div className="mt-6">
      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No users added yet.</p>
      ) : (
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
                      onClick={() => navigate(`/users/${user.id}`)}
                      className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      title="Edit"
                    >
                      <SquarePen />
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
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
    </div>
  );
}
