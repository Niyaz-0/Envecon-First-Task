import React, { useEffect, useState } from "react";
import { validatePhone, validatePin } from "../utils/validate";
import { Link, useLocation } from "react-router-dom";
import UserTable from "./UserTable";
import { useUsers } from "../context/UserContext";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { api } from "../utils/api";

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
  const { users, setUsers, fetchUsers } = useUsers();

  const districts = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"];
  const states = ["Maharashtra", "Gujarat", "Rajasthan", "Goa", "Karnataka"];

  useEffect(() => {
    fetchUsers()
  }, [])

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.firstname.trim())
      validationErrors.firstname = "Firstname is required!";
    if (!formData.lastname.trim())
      validationErrors.lastname = "Lastname is required!";
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
    if (!formData.state.trim())
      validationErrors.state = "State is required!";

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
        const response = await api.post("/users", formData);
        
        toast.success("User created successfully!");
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

      } catch (error) {
        console.log("Error while creating user", error);
        toast.error("Error while creating user")
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4 flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl mx-auto p-8 space-y-6 bg-white shadow-xl rounded-2xl border border-gray-200"
      >
        <h1 className="text-4xl text-center font-extrabold pb-6 text-blue-700">User Form</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">First Name</label>
            <input
              name="firstname"
              placeholder="Eg: John"
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">Last Name</label>
            <input
              name="lastname"
              placeholder="Eg: Doe"
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <label className="block text-lg font-semibold text-gray-700">Gender</label>
          <div className="flex gap-6">
            <label className="flex items-center text-base font-medium text-gray-900">
              <input
                type="radio"
                name="gender"
                value="Male"
                className="mr-2 accent-blue-600"
                checked={formData.gender === "Male"}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              />
              Female
            </label>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">Phone</label>
            <input
              name="phone"
              placeholder="Eg: 9876543210"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">Pin Code</label>
            <input
              name="address.pin"
              placeholder="Eg: 400001"
              value={formData.pin}
              onChange={(e) =>
                setFormData({...formData, pin: e.target.value})
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.pin && <p className="text-red-500 text-sm mt-1">{errors.pin}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">Address Line 1</label>
            <input
              name="line1"
              placeholder="Eg: 123, ABC Street"
              value={formData.address_line1}
              onChange={(e) =>
                setFormData({ ...formData, address_line1: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.line1 && (
              <p className="text-red-500 text-sm mt-1">{errors.line1}</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700">Address Line 2</label>
            <input
              name="address.line2"
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
            <label className="block text-lg font-semibold mb-2 text-gray-700">District</label>
            <select
              name="address.district"
              value={formData.district}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  district: e.target.value,
                })
              }
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
            <label className="block text-lg font-semibold mb-2 text-gray-700">State</label>
            <select
              name="address.state"
              value={formData.state}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  state: e.target.value,
                })
              }
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
          <button type="submit" disabled={loading} className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
            {loading ? <LoadingSpinner /> : "Save"}
          </button>

          <Link
            to="/employees"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center"
            state={{
              employeeName: formData.firstname + " " + formData.lastname,
            }}
          >
            Go to Employee Form
          </Link>
        </div>
      </form>

      <div className="w-full max-w-4xl mx-auto mt-10 p-4 bg-white shadow-xl rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          User Data Table
        </h2>
        <UserTable users={users} setUsers={setUsers} />
      </div>
    </div>
  );
}
