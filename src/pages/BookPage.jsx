import { useState, useEffect } from "react";

import {
  fetchBooks,
  addBook,
  updateBook,
  deleteBook,
  fetchBorrows,
  addBorrow,
} from "../services/api.js";

import PageHeader from "../components/layout/PageHeader.jsx";
import { Card } from "../components/ui/Card.jsx";
import { ActionButtons } from "../components/ui/ActionButtons.jsx";
import { StatusBadge } from "../components/ui/StatusBadge.jsx";
import { AlertError } from "../components/ui/AlertError.jsx";

import BookForm from "../components/BookForm.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import FormModal from "../components/FormModal.jsx";
import StatusFilter from "../components/StatusFilter.jsx";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [borrowers, setBorrowers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadError, setLoadError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookToDelete, setBookToDelete] = useState(null);

  const [borrowingBookId, setBorrowingBookId] = useState(null);
  const [borrowerName, setBorrowerName] = useState("");

  const [borrowerDate, setBorrowerDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [returnDate, setReturnDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().slice(0, 10);
  });

  // Load books and borrowing records
  const loadAll = async () => {
    try {
      setLoading(true);
      setLoadError("");

      const [booksData, borrowersData] = await Promise.all([
        fetchBooks(),
        fetchBorrows(),
      ]);

      setBooks(Array.isArray(booksData) ? booksData : booksData?.book ?? []);

      setBorrowers(
        Array.isArray(borrowersData)
          ? borrowersData
          : borrowersData?.borrower ?? []
      );
    } catch (err) {
      setLoadError(err.message || "Failed to load library data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Get book ID
  const getBookId = (book) => book._id ?? book.id;

  // Filter books by status
  const filteredBooks = books.filter((book) => {
    if (statusFilter === "all") return true;
    return book.status === statusFilter;
  });

  // Find the active borrowing record for a book
  const getBorrower = (bookId) => {
    return borrowers.find(
      (record) =>
        String(record.bookId?._id ?? record.bookId) === String(bookId) &&
        !record.returnedAt
    );
  };
  // Open add-book form
  const handleAddBook = () => {
    setError("");
    setEditingBook(null);
    setShowForm(true);
  };

  // Open edit-book form
  const handleEditBook = (book) => {
    setError("");
    setEditingBook(book);
    setShowForm(true);
  };

  // Add or update a book
  const handleSaveBook = async (formData) => {
    if (editingBook) {
      await updateBook(getBookId(editingBook), {
        ...editingBook,
        ...formData,
      });
    } else {
      await addBook({
        ...formData,
        status: "Available",
      });
    }

    setShowForm(false);
    setEditingBook(null);

    await loadAll();
  };

  // Delete a book
  const handleDeleteClick = (book) => {
    if (book.status === "Borrowed") {
      setError(
        "You can't delete a book that is currently borrowed. Return it first."
      );
      return;
    }
    setError("");
    setBookToDelete(book);
  };

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;

    if (bookToDelete.status === "Borrowed") {
      // حماية إضافية
      setError("You can't delete a borrowed book.");
      setBookToDelete(null);
      return;
    }

    try {
      setError("");

      await deleteBook(getBookId(bookToDelete));

      setBookToDelete(null);
      await loadAll();
    } catch (err) {
      setError(err.message || "Failed to delete the book.");
    }
  };

  // Open or close the borrowing form
  const handleBorrowClick = (book) => {
    const bookId = getBookId(book);

    setError("");

    if (String(borrowingBookId) === String(bookId)) {
      setBorrowingBookId(null);
      setBorrowerName("");
      return;
    }

    setBorrowingBookId(bookId);
    setBorrowerName("");
  };

  // Borrow an available book
  // Borrow an available book
  /*  const handleBorrowBook = async (book) => {
    const bookId = getBookId(book);

    if (!borrowerName.trim()) {
      setError("Please enter the borrower's name.");
      return;
    }

    if (returnDate < borrowerDate) {
      setError("The return date cannot be before the borrow date.");
      return;
    }

    if (book.status !== "Available") {
      setError("This book is already borrowed.");
      return;
    }

    // Extra protection: block if an active borrow record already exists
    if (getBorrower(bookId)) {
      setError("This book already has an active borrowing record.");
      return;
    }

    try {
      setError("");

      // 1) Create the borrowing record
      await addBorrow({
        borrowerName: borrowerName.trim(),
        borrowerDate,
        returnDate,
        bookId,
        returned: false,
      });

      // 2) Mark the book as borrowed
      await patchBook(bookId, { status: "Borrowed" });

      setBorrowingBookId(null);
      setBorrowerName("");

      await loadAll();
    } catch (err) {
      setError(err.message || "Failed to borrow the book.");
      await loadAll();
    }
  }; */
  const handleBorrowBook = async (book) => {
    if (!borrowerName.trim()) {
      setError("Please enter the borrower's name.");
      return;
    }

    if (returnDate < borrowerDate) {
      setError("The return date cannot be before the borrow date.");
      return;
    }

    if (book.status !== "Available") {
      setError("This book is already borrowed.");
      return;
    }

    try {
      setError("");

      await addBorrow({
        borrowerName: borrowerName.trim(),
        borrowDate: borrowerDate,
        expectedReturnDate: returnDate,
        bookId: getBookId(book),
      });

      setBorrowingBookId(null);
      setBorrowerName("");

      await loadAll();
    } catch (err) {
      setError(err.message || "Failed to borrow the book.");
      await loadAll();
    }
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title="Books"
        description="Manage your library collection."
        actionLabel="Add Book"
        onAction={handleAddBook}
      />

      {error && <AlertError message={error} onClose={() => setError("")} />}
      {loadError && (
        <AlertError message={loadError} onClose={() => setLoadError("")} />
      )}

      {/* Status filter */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <StatusFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Books" },
            { value: "Available", label: "Available" },
            { value: "Borrowed", label: "Borrowed" },
          ]}
        />
      </div>

      {/* Books list */}
      {loading ? (
        <p className="py-10 text-center text-gray-500">Loading books...</p>
      ) : filteredBooks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-gray-500">No books found for this status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => {
            const bookId = getBookId(book);
            const borrower = getBorrower(bookId);

            return (
              <Card key={bookId}>
                <div className="flex h-full flex-col gap-4">
                  {/* Book information */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {book.title}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        By {book.author || "Unknown Author"}
                      </p>
                    </div>

                    <StatusBadge status={book.status} />
                  </div>

                  {/* Active borrower details */}
                  {book.status === "Borrowed" && (
                    <div className="rounded-lg bg-gray-50 p-3 text-sm">
                      {borrower ? (
                        <>
                          <p>
                            <span className="font-medium">Borrower:</span>{" "}
                            {borrower.borrowerName}
                          </p>

                          <p className="mt-1 text-gray-600">
                            Borrowed:{" "}
                            {borrower.borrowDate
                              ? borrower.borrowDate.slice(0, 10)
                              : "—"}
                          </p>

                          <p className="mt-1 text-gray-600">
                            Expected return:{" "}
                            {borrower.expectedReturnDate
                              ? borrower.expectedReturnDate.slice(0, 10)
                              : "—"}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500">
                          Borrower details are unavailable.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Borrow action: available books only */}
                  {book.status === "Available" &&
                    (String(borrowingBookId) === String(bookId) ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleBorrowBook(book);
                        }}
                        className="space-y-3"
                      >
                        <input
                          type="text"
                          value={borrowerName}
                          onChange={(e) => setBorrowerName(e.target.value)}
                          placeholder="Borrower's name"
                          required
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                        />

                        <div>
                          <label className="mb-1 block text-sm text-gray-600">
                            Borrow date
                          </label>

                          <input
                            type="date"
                            value={borrowerDate}
                            onChange={(e) => {
                              const newDate = e.target.value;
                              setBorrowerDate(newDate);

                              if (returnDate < newDate) {
                                setReturnDate(newDate);
                              }
                            }}
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm text-gray-600">
                            Expected return date
                          </label>

                          <input
                            type="date"
                            value={returnDate}
                            min={borrowerDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                          >
                            Confirm Borrow
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setBorrowingBookId(null);
                              setBorrowerName("");
                              setError("");
                            }}
                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleBorrowClick(book)}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Borrow Book
                      </button>
                    ))}

                  {/* No Return Book button here.
                      Return actions belong to BorrowsPage. */}

                  {/* Edit and delete actions */}
                  <div className="mt-auto border-t border-gray-100 pt-3">
                    <ActionButtons
                      onEdit={() => handleEditBook(book)}
                      onDelete={() => handleDeleteClick(book)}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Book modal */}
      <FormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingBook(null);
          setError("");
        }}
        title={editingBook ? "Edit Book" : "Add Book"}
      >
        <BookForm
          initialData={editingBook}
          onSubmit={handleSaveBook}
          onCancel={() => {
            setShowForm(false);
            setEditingBook(null);
            setError("");
          }}
        />
      </FormModal>

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={Boolean(bookToDelete)}
        title="Delete Book"
        message={`Are you sure you want to delete "${
          bookToDelete?.title ?? ""
        }"?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onCancel={() => setBookToDelete(null)}
        onConfirm={handleDeleteBook}
      />
    </div>
  );
};

export default BooksPage;
