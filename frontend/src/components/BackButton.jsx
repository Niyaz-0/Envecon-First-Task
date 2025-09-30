import { useNavigate } from "react-router-dom";

export function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
    >
      ← Back
    </button>
  );
}