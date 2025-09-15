import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-purple-800"></div>
    </div>
  );
}