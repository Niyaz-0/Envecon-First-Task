export default function ConfirmModal({ open, onConfirm, onCancel, message }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-[2px]">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
        <p className="text-lg mb-6 text-center">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}