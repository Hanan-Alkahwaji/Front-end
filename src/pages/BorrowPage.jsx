import { useState, useEffect } from "react";

import {
  fetchBorrows,
  fetchBooks,
  updateBorrow,
  deleteBorrow,
  patchBook,
} from "../services/api.js";

import PageHeader from "../components/layout/PageHeader.jsx";
import { Card } from "../components/ui/Card.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import { AlertError } from "../components/ui/AlertError.jsx";

const BorrowsPage = () => {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [newReturnDate, setNewReturnDate] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [borrowData, booksData] = await Promise.all([
        fetchBorrows(),
        fetchBooks(),
      ]);

      setBorrows(
        Array.isArray(borrowData) ? borrowData : borrowData?.borrower ?? []
      );
      setBooks(Array.isArray(booksData) ? booksData : booksData?.book ?? []);
    } catch (err) {
      setError(err.message || "Failed to load borrowing records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getBook = (bookId) =>
    books.find((book) => String(book.id) === String(bookId));

  // Return a book: mark it Available, then delete the record
  const handleReturnBook = async (record) => {
    const book = getBook(record.bookId);

    if (!book) {
      setError("The associated book could not be found.");
      return;
    }

    try {
      setError("");

      await patchBook(book.id, { status: "Available" });
      await deleteBorrow(record.id);

      // Update state only after both requests succeed
      setBorrows((prev) =>
        prev.filter((item) => String(item.id) !== String(record.id))
      );
      setBooks((prev) =>
        prev.map((item) =>
          String(item.id) === String(book.id)
            ? { ...item, status: "Available" }
            : item
        )
      );
    } catch (err) {
      setError(err.message || "Failed to return the book.");
      await loadData(); // resync with the database
    }
  };

  // Edit expected return date
  const startEditDate = (record) => {
    setError("");
    setEditingId(record.id);
    setNewReturnDate(record.returnDate);
  };

  const handleSaveReturnDate = async (record) => {
    if (!newReturnDate) {
      setError("Please choose a return date.");
      return;
    }

    if (newReturnDate < record.borrowerDate) {
      setError("The return date cannot be before the borrow date.");
      return;
    }

    try {
      setError("");

      await updateBorrow(record.id, { returnDate: newReturnDate });

      setBorrows((prev) =>
        prev.map((item) =>
          item.id === record.id ? { ...item, returnDate: newReturnDate } : item
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
        <div className="py-12 text-center text-gray-500">
          Loading records...
        </div>
      ) : borrows.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-12 text-center text-gray-500">
          No current borrowers.
        </div>
      ) : (
        <div className="space-y-3">
          {borrows.map((record) => {
            const book = getBook(record.bookId);
            const isEditing = editingId === record.id;

            return (
              <Card key={record.id}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-bold text-gray-800">
                      {book?.title ?? `Book #${record.bookId}`}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Author: {book?.author ?? "Unknown"}
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Borrower:</span>{" "}
                      {record.borrowerName}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Borrow date: {record.borrowerDate}
                    </p>

                    {isEditing ? (
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="date"
                          value={newReturnDate}
                          min={record.borrowerDate}
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
                        Expected return: {record.returnDate}
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