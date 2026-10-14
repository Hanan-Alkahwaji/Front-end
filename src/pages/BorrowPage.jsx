import { useState, useEffect, useCallback } from "react";

import {
  fetchBorrows,
  updateBorrow,
  updateExpectedReturnDate,
  deleteBorrow,
} from "../services/api.js";

import PageHeader from "../components/layout/PageHeader.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import { AlertError } from "../components/ui/AlertError.jsx";
import { Loader } from "../components/Loader.jsx";
import { Table } from "../components/ui/Table.jsx";

const BorrowsPage = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingBorrowId, setEditingBorrowId] = useState(null);
  const [newReturnDate, setNewReturnDate] = useState("");
  const [savingDate, setSavingDate] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchBorrows();
      setBorrows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load borrowing records.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Return the book, then remove its borrowing record.
  const handleReturnBook = async (record) => {
    const borrowId = record._id ?? record.id;

    if (record.returnedAt) {
      await handleDeleteRecord(borrowId);
      return;
    }

    try {
      setError("");

      // Backend marks the book as returned and makes it available.
      await updateBorrow(borrowId, {});

      // Remove the borrowing record as required by the assignment.
      await deleteBorrow(borrowId);

      await loadData();
    } catch (err) {
      setError(err.message || "Failed to return the book.");
      await loadData();
    }
  };

  // Allow retrying deletion if returning succeeded but deletion failed.
  const handleDeleteRecord = async (borrowId) => {
    try {
      setError("");
      await deleteBorrow(borrowId);
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete the borrowing record.");
      await loadData();
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString();
  };

  const columns = [
    {
      header: "Book",
      render: (record) => {
        const book =
          record.bookId && typeof record.bookId === "object"
            ? record.bookId
            : null;

        return (
          <div>
            <p className="font-semibold text-navy">
              {book?.title ?? "Book information unavailable"}
            </p>
            <p className="mt-1 text-xs text-navy/70">
              Author: {book?.author ?? "Unknown"}
            </p>
          </div>
        );
      },
    },

    {
      header: "Edit Return Date",
      render: (record) => {
        const recordId = record._id ?? record.id;
        const isEditing = String(editingBorrowId) === String(recordId);
        const isReturned = Boolean(record.returnedAt);

        if (isReturned) {
          return <span className="text-gray-400">Completed</span>;
        }

        if (isEditing) {
          return (
            <div className="flex min-w-48 flex-col gap-2">
              <input
                type="date"
                value={newReturnDate}
                min={record.borrowDate?.slice(0, 10)}
                onChange={(e) => setNewReturnDate(e.target.value)}
                className="rounded-lg border border-french/40 bg-white px-2 py-2 text-sm"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={savingDate}
                  onClick={() => handleSaveReturnDate(record)}
                  className="rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                  {savingDate ? "Saving..." : "Save"}
                </button>

                <button
                  type="button"
                  disabled={savingDate}
                  onClick={() => {
                    setEditingBorrowId(null);
                    setNewReturnDate("");
                  }}
                  className="rounded-lg border border-french/40 px-3 py-2 text-xs text-navy disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        }

        return (
          <button
            type="button"
            onClick={() => handleEditReturnDate(record)}
            className="whitespace-nowrap rounded-lg border border-french/40 px-3 py-2 text-sm font-semibold text-navy transition hover:bg-french/15"
          >
            Edit Date
          </button>
        );
      },
    },

    {
      header: "Borrower",
      key: "borrowerName",
    },
    {
      header: "Borrow Date",
      render: (record) => formatDate(record.borrowDate),
    },
    {
      header: "Expected Return",
      render: (record) => formatDate(record.expectedReturnDate),
    },
    {
      header: "Actual Return",
      render: (record) => formatDate(record.returnedAt),
    },
    {
      header: "Status",
      render: (record) => (
        <StatusBadge status={record.returnedAt ? "Returned" : "Borrowed"} />
      ),
    },
    {
      header: "Action",
      render: (record) => (
        <button
          type="button"
          onClick={() => handleReturnBook(record)}
          className="whitespace-nowrap rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white transition hover:bg-navy/85"
        >
          {record.returnedAt ? "Delete Record" : "Return Book"}
        </button>
      ),
    },
  ];

  const handleEditReturnDate = (record) => {
    setEditingBorrowId(record._id ?? record.id);

    setNewReturnDate(
      record.expectedReturnDate ? record.expectedReturnDate.slice(0, 10) : ""
    );

    setError("");
  };

  const handleSaveReturnDate = async (record) => {
    if (!newReturnDate) {
      setError("Please select an expected return date.");
      return;
    }

    if (record.borrowDate && newReturnDate < record.borrowDate.slice(0, 10)) {
      setError("The expected return date cannot be before the borrow date.");
      return;
    }

    try {
      setSavingDate(true);
      setError("");

      await updateExpectedReturnDate(record._id ?? record.id, newReturnDate);

      setEditingBorrowId(null);
      setNewReturnDate("");

      await loadData();
    } catch (err) {
      setError(err.message || "Failed to update expected return date.");
    } finally {
      setSavingDate(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Current Borrowers"
        description="Manage current borrowings and return books."
      />

      {error && <AlertError message={error} onClose={() => setError("")} />}

      {loading ? (
        <Loader label="Loading borrowing records..." />
      ) : (
        <Table
          columns={columns}
          data={borrows}
          emptyMessage="No current borrowers found."
        />
      )}
    </div>
  );
};

export default BorrowsPage;
