import { useState, useEffect } from "react";

import { fetchBorrows, updateBorrow, deleteBorrow } from "../services/api.js";

import PageHeader from "../components/layout/PageHeader.jsx";
import { Card } from "../components/ui/Card.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import { AlertError } from "../components/ui/AlertError.jsx";

const getId = (record) => record._id ?? record.id;

const BorrowsPage = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [newReturnDate, setNewReturnDate] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchBorrows();
      const list = Array.isArray(data) ? data : [];

      // نعرض المستعيرين الحاليين بس
      setBorrows(list.filter((record) => !record.returnedAt));
    } catch (err) {
      setError(err.message || "Failed to load borrowing records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Return a book: السيرفر بيرجّع الكتاب Available، وبعدين منحذف السجل
  const handleReturnBook = async (record) => {
    const id = getId(record);

    try {
      setError("");

      await updateBorrow(id, {}); // إرجاع الكتاب
      await deleteBorrow(id); // حذف السجل

      // تحديث الـ state بعد نجاح الطلبين
      setBorrows((prev) => prev.filter((item) => getId(item) !== id));
    } catch (err) {
      setError(err.message || "Failed to return the book.");
      await loadData(); // مزامنة مع الداتابيس
    }
  };

  // Edit expected return date
  const startEditDate = (record) => {
    setError("");
    setEditingId(getId(record));
    setNewReturnDate(record.expectedReturnDate?.slice(0, 10) ?? "");
  };

  const handleSaveReturnDate = async (record) => {
    const borrowDate = record.borrowDate?.slice(0, 10);

    if (!newReturnDate) {
      setError("Please choose a return date.");
      return;
    }

    if (borrowDate && newReturnDate < borrowDate) {
      setError("The return date cannot be before the borrow date.");
      return;
    }

    try {
      setError("");

      await updateBorrow(getId(record), { expectedReturnDate: newReturnDate });

      setBorrows((prev) =>
        prev.map((item) =>
          getId(item) === getId(record)
            ? { ...item, expectedReturnDate: newReturnDate }
            : item
        )
      );
      setEditingId(null);
    } catch (err) {
      setError(err.message || "Failed to update the return date.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Current Borrowers"
        description="Books that are currently borrowed."
      />

      {error && <AlertError message={error} onClose={() => setError("")} />}

      {loading ? (
        <p className="py-12 text-center text-gray-500">Loading records...</p>
      ) : borrows.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-500">
          No current borrowers.
        </div>
      ) : (
        <div className="space-y-3">
          {borrows.map((record) => {
            const book =
              record.bookId && typeof record.bookId === "object"
                ? record.bookId
                : null;

            const id = getId(record);
            const isEditing = editingId === id;

            return (
              <Card key={id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-bold text-gray-800">
                      {book?.title ?? "Book information unavailable"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Author: {book?.author ?? "Unknown"}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Borrower:</span>{" "}
                      {record.borrowerName}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Borrow date:{" "}
                      {record.borrowDate ? record.borrowDate.slice(0, 10) : "—"}
                    </p>

                    {isEditing ? (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="date"
                          value={newReturnDate}
                          min={record.borrowDate?.slice(0, 10)}
                          onChange={(e) => setNewReturnDate(e.target.value)}
                          className="rounded-lg border border-gray-300 px-2 py-1 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveReturnDate(record)}
                          className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">
                        Expected return:{" "}
                        {record.expectedReturnDate
                          ? record.expectedReturnDate.slice(0, 10)
                          : "—"}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <StatusBadge status="Borrowed" />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditDate(record)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        Edit Date
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReturnBook(record)}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BorrowsPage;