import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="text-center mt-12">
      <h1 className="text-3xl font-bold mb-8">Welcome to the Home Page</h1>
      <div className="mt-8 flex justify-center gap-6">
        <Link
          to="/users"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
        >
          To Users
        </Link>
        <Link
          to="/employees"
          className="inline-block px-6 py-3 bg-green-700 text-white rounded-lg font-bold hover:bg-green-800 transition"
        >
          To Employees
        </Link>
      </div>
    </div>
  );
}
