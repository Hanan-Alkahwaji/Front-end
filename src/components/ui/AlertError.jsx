export const AlertError = ({ message, onClose, onRetry, className = "mb-4" }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className={`bg-red-50 border
         border-red-200
          text-red-700 px-4 py-3 
          rounded-xl text-sm flex items-center 
          justify-between gap-3 animate-fadeIn ${className}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-red-500 font-bold">⚠️</span>
        <span>{message}</span>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {onRetry && (
          <button onClick={onRetry} className="font-medium underline">
            Retry
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-600 font-bold text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};