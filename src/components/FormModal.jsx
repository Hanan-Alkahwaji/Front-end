const FormModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-ivory rounded-3xl max-w-md w-full p-6 shadow-xl border border-french/25 transform transition-all">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-french/25">
          <h3 className="text-lg font-bold text-navy">{title}</h3>
          <button
            onClick={onClose}
            className="text-navy/50 hover:text-navy text-xl font-bold leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormModal;
