import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { api } from "../utils/api";
import toast from "react-hot-toast";

export default function EmployeeEditForm() {
  const { emp_id } = useParams();
  const navigate = useNavigate();

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCurrentEmployee = async () => {
      try {
        const response = await api.get(`/employees/${emp_id}`);
        setEditingEmployee(response.data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };
    getCurrentEmployee();
  }, [emp_id]);

  const departments = ["HR", "Sales", "Finance", "Engineering", "Marketing"];
  const profiles = [
    "Manager",
    "Team Lead",
    "Senior Developer",
    "Intern",
    "Trainee",
  ];

  const validateForm = () => {
    const validationErrors = {};
    if (!editingEmployee.employee_name?.trim())
      validationErrors.employee_name = "Employee name is required!";
    if (!editingEmployee.employee_id?.trim())
      validationErrors.employee_id = "Employee ID is required!";
    if (!editingEmployee.department)
      validationErrors.department = "Department is required!";
    if (!editingEmployee.profile)
      validationErrors.profile = "Profile is required!";
    return validationErrors;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      setErrors({});
      await api.put(`/employees/${emp_id}`, editingEmployee);
      toast.success("Employee updated successfully!");
      setTimeout(() => {
        navigate("/employees");
      }, 750);
    } catch (error) {
      console.log("Error while updating employee: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {editingEmployee ? (
        <form
          onSubmit={handleUpdate}
          className="max-w-2xl mx-auto p-4 space-y-4 bg-white shadow-md rounded"
        >
          <h1 className="text-3xl text-center font-bold pb-4">Employee Form</h1>
          <div>
            <label className="label">Employee Name: </label>
            <input
              name="employee_name"
              placeholder="Eg: John Doe"
              value={editingEmployee.employee_name || ""}
              onChange={(e) =>
                setEditingEmployee({
                  ...editingEmployee,
                  employee_name: e.target.value,
                })
              }
              className="input"
            />
            {errors.employee_name && (
              <p className="text-red-500 text-sm">{errors.employee_name}</p>
            )}
          </div>

          <div>
            <label className="label">Employee Id: </label>
            <input
              name="employee_id"
              placeholder="Eg: EMP12345"
              value={editingEmployee.employee_id || ""}
              onChange={(e) =>
                setEditingEmployee({
                  ...editingEmployee,
                  employee_id: e.target.value,
                })
              }
              className="input"
            />
            {errors.employee_id && (
              <p className="text-red-500 text-sm">{errors.employee_id}</p>
            )}
          </div>

          <div>
            <label className="label">Department: </label>
            <select
              name="department"
              value={editingEmployee.department || ""}
              onChange={(e) =>
                setEditingEmployee({
                  ...editingEmployee,
                  department: e.target.value,
                })
              }
              className="input"
            >
              <option value="" disabled>
                Select
              </option>
              {departments.map((department) => (
                <option key={department}>{department}</option>
              ))}
            </select>
            {errors.department && (
              <p className="text-red-500 text-sm">{errors.department}</p>
            )}
          </div>

          <div>
            <label className="label">Profile: </label>
            <select
              name="profile"
              value={editingEmployee.profile || ""}
              onChange={(e) =>
                setEditingEmployee({
                  ...editingEmployee,
                  profile: e.target.value,
                })
              }
              className="input"
            >
              <option value="" disabled>
                Select
              </option>
              {profiles.map((profile) => (
                <option key={profile}>{profile}</option>
              ))}
            </select>
            {errors.profile && (
              <p className="text-red-500 text-sm">{errors.profile}</p>
            )}
          </div>

          <button type="submit" disabled={loading} className="form-button">
            {loading ? <LoadingSpinner /> : "Save"}
          </button>
        </form>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}
