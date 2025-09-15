import React from 'react'
import UserForm from './components/UserForm'
import { Route, Routes } from 'react-router-dom'
import EmployeeForm from './components/EmployeeForm'
import { Toaster } from "react-hot-toast"
import UserEditForm from './components/UserEditForm'
import EmployeeEditForm from './components/EmployeeEditForm'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UserForm />} />
        <Route path="/employees" element={<EmployeeForm />} />

        <Route path='/users/:user_id' element={<UserEditForm />} />
        <Route path='/employees/:emp_id' element={<EmployeeEditForm />} />

        <Route path="*" element={<h1 className='text-center mt-10 text-3xl font-bold'>404: Page Not Found</h1>} />
      </Routes>
      <Toaster />
    </div>
  )
}
