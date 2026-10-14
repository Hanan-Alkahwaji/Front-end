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
    primary: "bg-navy hover:bg-navy/85",
    warning: "bg-gold hover:bg-gold/80",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl border border-french/25 bg-ivory p-6 text-center shadow-xl">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-french/15 text-xl font-bold text-navy/80">
          !
        </div>

        <h3 className="mb-2 text-base font-bold text-navy">
          {title}
        </h3>

        <p className="mb-6 text-sm text-navy/70">
          {message}
        </p>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-french/40 bg-white px-4 py-2 text-sm font-medium text-navy transition hover:bg-french/15"
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