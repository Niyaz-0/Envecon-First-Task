import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import LoadingSpinner from "./LoadingSpinner";
import { validatePhone, validatePin } from "../utils/validate";
import toast from "react-hot-toast";

export default function UserEditForm() {
  const { user_id } = useParams();
  const [editingUser, setEditingUser] = useState(null);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const districts = ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane"];
    const states = ["Maharashtra", "Gujarat", "Rajasthan", "Goa", "Karnataka"];

    const navigate = useNavigate()
  
    const validateForm = () => {
      const validationErrors = {};

      if (!editingUser.firstname.trim())
        validationErrors.firstname = "Firstname is required!";
      if (!editingUser.lastname.trim())
        validationErrors.lastname = "Lastname is required!";
      if (!editingUser.gender) validationErrors.gender = "Gender is required!";
      if (!editingUser.phone.trim()) {
        validationErrors.phone = "Phone Number is required!";
      } else if (!validatePhone(editingUser.phone)) {
        validationErrors.phone = "Phone Number is invalid!";
      }
      if (!editingUser.address_line1.trim())
        validationErrors.address_line1 = "Address Line 1 is required!";
      if (!editingUser.pin.trim()) {
        validationErrors.pin = "Pin Code is required!";
      } else if (!validatePin(editingUser.pin)) {
        validationErrors.pin = "Pin Code is invalid!";
      }
      if (!editingUser.district.trim())
        validationErrors.district = "District is required!";
      if (!editingUser.state.trim())
        validationErrors.state = "State is required!";

      return validationErrors;
    };

  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await api.get(`/users/${user_id}`);
      setEditingUser(response.data);
    };

    getCurrentUser();
  }, [user_id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }   

    try {
        setLoading(true)
        setErrors({})

        const response = await api.put(`/users/${user_id}`, editingUser)
        toast.success("User updated successfully")
        
        setTimeout(() => {
            navigate("/users")
        }, 750)

    } catch (error) {
        console.log("Error while updating user: ", error)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div>
      {editingUser ? (
        <form
          onSubmit={handleUpdate}
          className="max-w-2xl mx-auto p-4 space-y-4 bg-white shadow-md rounded"
        >
          <h1 className="text-3xl text-center font-bold pb-4">Edit User Form</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name: </label>
              <input
                name="firstname"
                placeholder="Eg: John"
                value={editingUser.firstname}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, firstname: e.target.value })
                }
                className="input"
              />
              {errors.firstname && (
                <p className="text-red-500 text-sm">{errors.firstname}</p>
              )}
            </div>

            <div>
              <label className="label">Last Name: </label>
              <input
                name="lastname"
                placeholder="Eg: Doe"
                value={editingUser.lastname}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, lastname: e.target.value })
                }
                className="input"
              />
              {errors.lastname && (
                <p className="text-red-500 text-sm">{errors.lastname}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <label className="label">Gender: </label>
            <div className="space-x-4">
              <label className="text-base font-medium text-gray-900">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  className="radio"
                  checked={editingUser.gender === "Male"}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, gender: e.target.value })
                  }
                />{" "}
                Male
              </label>
              <label className="text-base font-medium text-gray-900">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  className="radio"
                  checked={editingUser.gender === "Female"}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, gender: e.target.value })
                  }
                />{" "}
                Female
              </label>
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender}</p>
              )}
            </div>
          </div>

          <div>
            <label className="label">Phone: </label>
            <input
              name="phone"
              placeholder="Eg: 9876543210"
              value={editingUser.phone}
              onChange={(e) =>
                setEditingUser({ ...editingUser, phone: e.target.value })
              }
              className="input"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="label">Address Line 1: </label>
            <input
              name="line1"
              placeholder="Eg: 123, ABC Street"
              value={editingUser.address_line1}
              onChange={(e) =>
                setEditingUser({ ...editingUser, address_line1: e.target.value })
              }
              className="input"
            />
            {errors.line1 && (
              <p className="text-red-500 text-sm">{errors.line1}</p>
            )}
          </div>

          <div>
            <label className="label">Address Line 2: </label>
            <input
              name="address.line2"
              placeholder="Eg: Near XYZ Park"
              value={editingUser.address_line2}
              onChange={(e) =>
                setEditingUser({ ...editingUser, address_line2: e.target.value })
              }
              className="input"
            />
            {errors.line2 && (
              <p className="text-red-500 text-sm">{errors.line2}</p>
            )}
          </div>

          <div>
            <label className="label">Pin Code: </label>
            <input
              name="address.pin"
              placeholder="Eg: 400001"
              value={editingUser.pin}
              onChange={(e) =>
                setEditingUser({ ...editingUser, pin: e.target.value })
              }
              className="input"
            />
            {errors.pin && <p className="text-red-500 text-sm">{errors.pin}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">District: </label>
              <select
                name="address.district"
                value={editingUser.district}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    district: e.target.value,
                  })
                }
                className="input"
              >
                <option value="" disabled>
                  Select
                </option>
                {districts.map((district) => (
                  <option key={district}>{district}</option>
                ))}
              </select>
              {errors.district && (
                <p className="text-red-500 text-sm">{errors.district}</p>
              )}
            </div>

            <div>
              <label className="label">State: </label>
              <select
                name="address.state"
                value={editingUser.state}
                onChange={(e) =>
                  setEditingUser({
                    ...editingUser,
                    state: e.target.value,
                  })
                }
                className="input"
              >
                <option value="" disabled>
                  Select
                </option>
                {states.map((state) => (
                  <option key={state}>{state}</option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state}</p>
              )}
            </div>
          </div>

            <button type="submit" disabled={loading} className="form-button">
              {loading ? <LoadingSpinner /> : "Update User"}
            </button>
            
        </form>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}
