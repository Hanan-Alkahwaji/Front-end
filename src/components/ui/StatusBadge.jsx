export const StatusBadge = ({ status }) => {
  const styles = {
    Available: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Borrowed: "border-amber-200 bg-amber-50 text-amber-700",
    Returned: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? "border-gray-200 bg-gray-50 text-gray-600"
      }`}
    >
      <span aria-hidden="true">●</span>
      {status}
    </span>
  );
};