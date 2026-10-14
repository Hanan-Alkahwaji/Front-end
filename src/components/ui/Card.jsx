export const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between ${className}`}
  >
    {children}
  </div>
);
