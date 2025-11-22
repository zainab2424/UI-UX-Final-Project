// Modal.jsx (You must update this file manually)

// ... imports

function Modal({ isOpen, onClose, title, message, type, theme }) {
  if (!isOpen) return null;

  // Use theme defaults if not provided, or handle type-based logic if preferred
  const bgColor = theme?.bg || 'bg-white';
  const titleColor = theme?.titleColor || 'text-black';
  const messageColor = theme?.messageColor || 'text-gray-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {/* Apply theme colors here */}
      <div className={`p-8 rounded-lg shadow-2xl w-full max-w-md ${bgColor} border-4 border-[#7940C8] font-jomhuria`}>
        {/* Title Styling */}
        <h2 className={`text-[60px] leading-[60px] mb-4 ${titleColor}`}>
          {title}
        </h2>
        {/* Message Styling */}
        <p className={`text-[40px] leading-[40px] mb-6 ${messageColor}`}>
          {message}
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#FF8AD8] border-2 border-[#7940C8] rounded-[10px] px-6 py-2 text-[40px] font-jomhuria text-white hover:opacity-80 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;

