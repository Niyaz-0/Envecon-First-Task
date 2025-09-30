import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import EmployeeTable from "./EmployeeTable";
import { useEmployees } from "../context/EmployeeContext";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { api } from "../utils/api";
import { PanelBottomOpen, PanelTopOpen } from "lucide-react"

export default function EmployeeForm() {
  const { state } = useLocation();
  const { employees } = useEmployees();

  const [lastUser, setLastUser] = useState(null);
  const [formCollapsed, setFormCollapsed] = useState(false);

  useEffect(() => {
    const fetchLastUser = async () => {
      try {
        const response = await api.get("/users/last");
        setLastUser(response.data);
      } catch (error) {
        console.log("Error fetching last user:", error);
        setLastUser(null);
      }
    };
    fetchLastUser();
  }, []);

  // Helper to check if a string is non-empty and not just whitespace
  const isNonEmptyString = str => typeof str === "string" && str.trim().length > 0;

  // Check if state.employee_name exists, is non-empty, and is NOT already in employees
  const stateEmpNameIsUnique =
    isNonEmptyString(state?.employee_name) &&
    !employees.some(emp => emp.employee_name === state.employee_name);

  const employee_name = stateEmpNameIsUnique
    ? state.employee_name
    : lastUser
      ? `${lastUser.firstname} ${lastUser.lastname}`
      : "";

  const [empFormData, setEmpFormData] = useState({
    employee_name: employee_name,
    employee_id: "",
    department: "",
    profile: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5; // or any number you want per page

  const { employees: empList, setEmployees, fetchEmployees, total } = useEmployees();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    if (!empFormData.employee_name.trim())
      validationErrors.employee_name = "Employee Name is required!";
    if (!empFormData.employee_id)
      validationErrors.employee_id = "Employee Id is required!";
    if (!empFormData.department)
      validationErrors.department = "Department is required!";
    if (!empFormData.profile) validationErrors.profile = "Profile is required!";

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        setErrors({});
        if (editingId) {
          await api.put(`/employees/${editingId}`, empFormData);
          toast.success("Employee updated successfully!");
        } else {
          await api.post("/employees", empFormData);
          toast.success("Employee added successfully!");
        }
        setEmpFormData({
          employee_name: employee_name,
          employee_id: "",
          department: "",
          profile: "",
        });
        setEditingId(null);
        await fetchEmployees();
      } catch (error) {
        console.error("Error saving employee:", error);
        toast.error("Failed to save employee.");
      } finally {
        setLoading(false);
      }
    }
  };

  const onEdit = (id) => {
    const employee = empList.find(emp => emp.id === id);
    if (employee) {
      setEmpFormData({
        employee_name: employee.employee_name,
        employee_id: employee.employee_id,
        department: employee.department,
        profile: employee.profile,
      });
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
      setEditingId(id);
    }
  };

  // Real-time validation for each field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpFormData((prev) => ({ ...prev, [name]: value }));

    let error = "";
    if (!value.trim()) error = `${name.replace("_", " ")} is required!`;

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    if (
      employee_name &&
      empList.some(emp => emp.employee_name === employee_name)
    ) {
      setEmpFormData(prev => ({
        ...prev,
        employee_name: ""
      }));
    }
  }, [employee_name, empList]);

  useEffect(() => {
    fetchEmployees(pageSize, (page - 1) * pageSize);
  }, [page]);

  useEffect(() => {
    // Helper to check if a string is non-empty and not just whitespace
    const isNonEmptyString = str => typeof str === "string" && str.trim().length > 0;

    // Compose last user's full name
    const lastUserName = lastUser
      ? `${lastUser.firstname} ${lastUser.lastname}`
      : "";
      
    if (
      !isNonEmptyString(state?.employee_name) &&
      lastUser &&
      !employees.some(emp => emp.employee_name === lastUserName) &&
      (!empFormData.employee_name || empFormData.employee_name.trim() === "")
    ) {
      setEmpFormData(prev => ({
        ...prev,
        employee_name: lastUserName
      }));
    }
  }, [lastUser, state?.employee_name, empFormData.employee_name, employees]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 py-8 px-4 flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto p-8 space-y-6 bg-white shadow-xl rounded-2xl border border-gray-200"
      >
        {/* Heading and Collapse Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-extrabold text-purple-700">Employee Form</h1>
          <button
            type="button"
            onClick={() => setFormCollapsed((prev) => !prev)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition flex items-center"
          >
            {formCollapsed ? <PanelTopOpen /> : <PanelBottomOpen />}
          </button>
        </div>

        {/* Collapsible Form Fields */}
        {!formCollapsed && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {/* Employee Name */}
                <label className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
                  Employee Name
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="employee_name"
                  placeholder="Eg: John Doe"
                  value={empFormData.employee_name}
                  onChange={e => {
                    const value = e.target.value;
                    setEmpFormData(prev => ({ ...prev, employee_name: value }));
                    setErrors(prev => ({
                      ...prev,
                      employee_name: !value.trim() ? "Employee Name is required!" : ""
                    }));
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {errors.employee_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.employee_name}</p>
                )}
              </div>

              <div>
                {/* Employee Id */}
                <label className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
                  Employee Id
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  name="employee_id"
                  placeholder="Eg: 2345"
                  value={empFormData.employee_id}
                  maxLength={4}
                  onChange={e => {
                    let value = e.target.value;
                    // Only allow digits, max 4
                    value = value.replace(/\D/g, "").slice(0, 4);
                    setEmpFormData(prev => ({ ...prev, employee_id: value }));

                    let error = "";
                    if (!value) {
                      error = "Employee Id is required!";
                    } else if (value.length > 4) {
                      error = "Employee Id cannot be more than 4 digits!";
                    } else if (value.length < 4) {
                      error = "Employee Id must be 4 digits!";
                    } else if (
                      empList.some(
                        emp =>
                          emp.employee_id === value &&
                          (editingId ? emp.id !== editingId : true)
                      )
                    ) {
                      error = "Employee Id must be unique!";
                    }
                    setErrors(prev => ({ ...prev, employee_id: error }));
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {errors.employee_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.employee_id}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {/* Department */}
                <label className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
                  Department
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="department"
                  value={empFormData.department}
                  onChange={e => {
                    const value = e.target.value;
                    setEmpFormData(prev => ({ ...prev, department: value }));
                    setErrors(prev => ({
                      ...prev,
                      department: !value ? "Department is required!" : ""
                    }));
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {departments.map((department) => (
                    <option key={department}>{department}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department}</p>
                )}
              </div>

              <div>
                {/* Profile */}
                <label className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
                  Profile
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name="profile"
                  value={empFormData.profile}
                  onChange={e => {
                    const value = e.target.value;
                    setEmpFormData(prev => ({ ...prev, profile: value }));
                    setErrors(prev => ({
                      ...prev,
                      profile: !value ? "Profile is required!" : ""
                    }));
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  {profiles.map((profile) => (
                    <option key={profile}>{profile}</option>
                  ))}
                </select>
                {errors.profile && (
                  <p className="text-red-500 text-sm mt-1">{errors.profile}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition"
              >
                {loading ? <LoadingSpinner /> : editingId ? "Update" : "Save"}
              </button>

              <Link
                to="/users"
                className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition flex items-center justify-center"
              >
                Go to User Form
              </Link>
            </div>
          </>
        )}
      </form>

      <div className="w-full max-w-4xl mx-auto mt-10 p-4 bg-white shadow-xl rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
          Employee Data Table
        </h2>
        <EmployeeTable
          employees={empList}
          setEmployees={setEmployees}
          onEdit={onEdit}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          total={total}
        />
      </div>
    </div>
  );
}
