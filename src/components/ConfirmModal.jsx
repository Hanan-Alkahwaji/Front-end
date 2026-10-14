const ConfirmModal = ({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}) => {
  // Don't render the modal when it is closed
  if (!isOpen) return null;

  const confirmStyles = {
    danger: "bg-red-600 hover:bg-red-700",
    primary: "bg-blue-600 hover:bg-blue-700",
    warning: "bg-amber-500 hover:bg-amber-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-xl">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-xl font-bold text-gray-600">
          !
        </div>

        <h3 className="mb-2 text-base font-bold text-gray-900">
          {title}
        </h3>

        <p className="mb-6 text-sm text-gray-500">
          {message}
        </p>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
              confirmStyles[variant] ?? confirmStyles.danger
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;