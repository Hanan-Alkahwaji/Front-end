export const Table = ({
    columns,
    data,
    rowKey = (row) => row._id ?? row.id,
    emptyMessage = "No records found.",
    className = "",
  }) => {
    return (
      <div
        className={`overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
      >
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  className={`px-5 py-3.5 font-semibold ${col.headerClassName ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
  
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={rowKey(row)} className="transition hover:bg-gray-50">
                  {columns.map((col) => (
                    <td
                      key={col.header}
                      className={`px-5 py-3.5 text-gray-700 ${col.className ?? ""}`}
                    >
                      {col.render ? col.render(row) : row[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };