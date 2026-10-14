const StatusFilter = ({
  value,
  onChange,
  options,
}) => {
  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="status-filter"
        className="text-sm font-medium text-gray-700"
      >
        Filter by status
      </label>

      <select
        id="status-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-emerald-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {value !== "all" && (
        <button
          type="button"
          onClick={() => onChange("all")}
          className="text-xs font-medium text-red-600 hover:text-red-800"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default StatusFilter;