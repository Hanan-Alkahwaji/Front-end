export const Card = ({ children, className = "" }) => (
  <div
    className={`bg-ivory rounded-2xl border border-french/40 p-5 shadow-md shadow-navy/10 hover:shadow-lg hover:shadow-navy/15 transition flex flex-col justify-between ${className}`}
  >
    {children}
  </div>
);
