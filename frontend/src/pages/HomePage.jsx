import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center">
        <img
          src="/vite.svg"
          alt="Logo"
          className="w-20 h-20 mb-6 animate-bounce"
        />
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 drop-shadow-lg">
          Welcome to the{" "}
          <span className="text-green-600">Home Page</span>
        </h1>
        <p className="text-lg text-gray-500 mb-8 text-center">
          Explore users and employees with a beautiful UI powered by React and
          Tailwind CSS.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-6 w-full justify-center">
          <Link
            to="/users"
            className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-200 text-center"
          >
             To Users
          </Link>
          <Link
            to="/employees"
            className="flex-1 px-8 py-4 bg-green-700 text-white rounded-xl font-bold text-xl shadow-lg hover:bg-green-800 hover:scale-105 transition-all duration-200 text-center"
          >
             To Employees
          </Link>
        </div>
      </div>
      <footer className="mt-10 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} First Task &mdash; Crafted with{" "}
        <span className="text-red-400">♥</span>
      </footer>
    </div>
  );
}
