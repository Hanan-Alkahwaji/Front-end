export const StatusBadge = ({ status }) => {
  const styles = {
    Available: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Borrowed: "border-gold bg-gold/25 text-navy",
    Returned: "border-french bg-french/20 text-navy",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? "border-french/40 bg-french/10 text-navy/80"
      }`}
    >
      <span aria-hidden="true">●</span>
      {status}
    </span>
  );
};