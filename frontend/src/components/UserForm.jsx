import React, { useEffect, useState } from "react";
import { validateName, validatePhone, validatePin } from "../utils/validate";
import { Link, useNavigate } from "react-router-dom";
import UserTable from "./UserTable";
import { useUsers } from "../context/UserContext";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { api } from "../utils/api";
import { PanelBottomOpen, PanelTopOpen } from "lucide-react";

export default function UserForm() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    pin: "",
    district: "",
    state: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formCollapsed, setFormCollapsed] = useState(false);

  const [page, setPage] = useState(1); //Page.No
  const [pageSize, setPageSize] = useState(5); //Limit | Count
  const { users, setUsers, fetchUsers, total } = useUsers();

  const districts = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"];
  const states = ["Maharashtra", "Gujarat", "Rajasthan", "Goa", "Karnataka"];

  // Add filter state
  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    district: "",
  });

  /*   const navigate = useNavigate(); */

  useEffect(() => {
    fetchUsers(pageSize, (page - 1) * pageSize, filters);
  }, [page, filters, pageSize]);

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.firstname.trim())
      validationErrors.firstname = "Firstname is required!";
    else if (!validateName(formData.firstname))
      validationErrors.firstname =
        "Firstname should not contain numbers/special characters!";

    if (!formData.lastname.trim())
      validationErrors.lastname = "Lastname is required!";
    else if (!validateName(formData.lastname))
      validationErrors.lastname =
        "Lastname should not contain numbers/special characters!";

    if (!formData.gender) validationErrors.gender = "Gender is required!";
    if (!formData.phone.trim()) {
      validationErrors.phone = "Phone Number is required!";
    } else if (!validatePhone(formData.phone)) {
      validationErrors.phone = "Phone Number is invalid!";
    }

    if (!formData.address_line1.trim())
      validationErrors.address_line1 = "Address Line 1 is required!";
    if (!formData.pin.trim()) {
      validationErrors.pin = "Pin Code is required!";
    } else if (!validatePin(formData.pin)) {
      validationErrors.pin = "Pin Code is invalid!";
    }
    if (!formData.district.trim())
      validationErrors.district = "District is required!";
    if (!formData.state.trim()) validationErrors.state = "State is required!";

    return validationErrors;
  };

  const onEdit = (user_id) => {
    const user = users.find((user) => user.id === user_id);
    if (user) {
      setFormData({
        firstname: user.firstname,
        lastname: user.lastname,
        gender: user.gender,
        phone: user.phone,
        address_line1: user.address_line1,
        address_line2: user.address_line2,
        pin: user.pin,
        district: user.district,
        state: user.state,
      });
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
      setEditingId(user_id);
    }
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
          await api.put(`/users/${editingId}`, formData);
          toast.success("User updated successfully");
        } else {
          await api.post("/users", formData);
          toast.success("User created successfully!");
        }

        // Refetch users
        await fetchUsers();

        setFormData({
          firstname: "",
          lastname: "",
          gender: "",
          phone: "",
          address_line1: "",
          address_line2: "",
          pin: "",
          district: "",
          state: "",
        });
        setEditingId(null);
      } catch (error) {
        console.log("Error while saving user", error);
        toast.error("Error while saving user");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Reset to page 1 when filters change
    setPage(1);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1); // Reset to page 1 when changing page size
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <form
          className="p-8 space-y-6 bg-white shadow-xl rounded-2xl border border-gray-200"
          onSubmit={handleSubmit}
        >
          {/* Heading and Collapse Button */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-extrabold text-blue-700 flex-1">
              User Form
            </h1>
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
                  {/* First Name */}
                  <label className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
                    First Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    name="firstname"
                    placeholder="Eg: John"
                    type="text"
                    value={formData.firstname}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, firstname: value });
                      let error = "";
                      if (!value.trim()) error = "Firstname is required!";
                      else if (!validateName(value))
                        error = "Firstname should not contain numbers/special characters!";
                      setErrors((prev) => ({ ...prev, firstname: error }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {errors.firstname && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>
                  )}
                </div>

                <div>
                  {/* Last Name */}
                  <label className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
                    Last Name
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    name="lastname"
                    placeholder="Eg: Doe"
                    value={formData.lastname}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, lastname: value });
                      let error = "";
                      if (!value.trim()) error = "Lastname is required!";
                      else if (!validateName(value))
                        error = "Lastname should not contain numbers/special characters!";
                      setErrors((prev) => ({ ...prev, lastname: error }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {errors.lastname && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Gender */}
                <label className="text-lg font-semibold text-gray-700 flex items-center">
                  Gender
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center text-base font-medium text-gray-900">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      className="mr-2 accent-blue-600"
                      checked={formData.gender === "Male"}
                      onChange={(e) => {
                        setFormData({ ...formData, gender: e.target.value });
                        let error = "";
                        if (!e.target.value) error = "Gender is required!";
                        setErrors((prev) => ({ ...prev, gender: error }));
                      }}
                    />
                    Male
                  </label>
                  <label className="flex items-center text-base font-medium text-gray-900">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      className="mr-2 accent-pink-500"
                      checked={formData.gender === "Female"}
                      onChange={(e) => {
                        setFormData({ ...formData, gender: e.target.value });
                        let error = "";
                        if (!e.target.value) error = "Gender is required!";
                        setErrors((prev) => ({ ...prev, gender: error }));
                      }}
                    />
                    Female
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* Phone */}
                  <label className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
                    Phone
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    name="phone"
                    placeholder="Eg: 9876543210"
                    value={formData.phone}
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, phone: value });
                      let error = "";
                      if (!value.trim()) error = "Phone Number is required!";
                      else if (!validatePhone(value)) error = "Phone Number is invalid!";
                      setErrors((prev) => ({ ...prev, phone: error }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  {/* Pin Code */}
                  <label className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
                    Pin Code
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    name="pin"
                    placeholder="Eg: 400001"
                    value={formData.pin}
                    maxLength={6}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, pin: value });
                      let error = "";
                      if (!value.trim()) error = "Pin Code is required!";
                      else if (!validatePin(value)) error = "Pin Code is invalid!";
                      setErrors((prev) => ({ ...prev, pin: error }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {errors.pin && (
                    <p className="text-red-500 text-sm mt-1">{errors.pin}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* Address Line 1 */}
                  <label className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
                    Address Line 1
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    name="address_line1"
                    placeholder="Eg: 123, ABC Street"
                    value={formData.address_line1}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, address_line1: value });
                      let error = "";
                      if (!value.trim()) error = "Address Line 1 is required!";
                      setErrors((prev) => ({ ...prev, address_line1: error }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {errors.address_line1 && (
                    <p className="text-red-500 text-sm mt-1">{errors.address_line1}</p>
                  )}
                </div>

                <div>
                  {/* Address Line 2 (not required, no asterisk) */}
                  <label className="text-lg font-semibold mb-2 text-gray-700">
                    Address Line 2
                  </label>
                  <input
                    name="address_line2"
                    placeholder="Eg: Near XYZ Park"
                    value={formData.address_line2}
                    onChange={(e) =>
                      setFormData({ ...formData, address_line2: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {errors.line2 && (
                    <p className="text-red-500 text-sm mt-1">{errors.line2}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {/* District */}
                  <label className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
                    District
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, district: value });
                      let error = "";
                      if (!value.trim()) error = "District is required!";
                      setErrors((prev) => ({ ...prev, district: error }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {districts.map((district) => (
                      <option key={district}>{district}</option>
                    ))}
                  </select>
                  {errors.district && (
                    <p className="text-red-500 text-sm mt-1">{errors.district}</p>
                  )}
                </div>

                <div>
                  {/* State */}
                  <label className="text-lg font-semibold mb-2 text-gray-700 flex items-center">
                    State
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, state: value });
                      let error = "";
                      if (!value.trim()) error = "State is required!";
                      setErrors((prev) => ({ ...prev, state: error }));
                    }}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {states.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  {loading ? <LoadingSpinner /> : editingId ? "Update" : "Save"}
                </button>

                <Link
                  to="/employees"
                  className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center"
                  state={{
                    employee_name: formData.firstname + " " + formData.lastname,
                  }}
                >
                  Go to Employee Form
                </Link>
              </div>
            </>
          )}
        </form>
      </div>
      {/* User Table with filter support */}
      <div className="w-full max-w-4xl mx-auto mt-10 p-4 bg-white shadow-xl rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          User Data Table
        </h2>
        <UserTable
          users={users}
          setUsers={setUsers}
          onEdit={onEdit}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={handlePageSizeChange}
          total={total}
          onFilter={handleFilterChange}
        />
      </div>
    </div>
  );
}
