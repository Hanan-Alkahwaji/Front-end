const BASE_URL = "http://localhost:3000";

const handleResponse = async (response) => {
  const text = await response.text();

  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? data.message || `Server Error (${response.status})`
        : data || `Server Error (${response.status})`;

    throw new Error(message);
  }

  return data;
};

const jsonHeaders = {
  "Content-Type": "application/json",
};

// Books
export const fetchBooks = () => fetch(`${BASE_URL}/books`).then(handleResponse);

export const addBook = (book) =>
  fetch(`${BASE_URL}/books`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(book),
  }).then(handleResponse);

export const updateBook = (id, book) =>
  fetch(`${BASE_URL}/books/${id}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(book),
  }).then(handleResponse);

export const deleteBook = (id) =>
  fetch(`${BASE_URL}/books/${id}`, {
    method: "DELETE",
  }).then(handleResponse);

// Borrowers
export const fetchBorrows = () =>
  fetch(`${BASE_URL}/borrowers`).then(handleResponse);

export const addBorrow = (borrow) =>
  fetch(`${BASE_URL}/borrowers`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(borrow),
  }).then(handleResponse);

export const updateBorrow = (id, borrow = {}) =>
  fetch(`${BASE_URL}/borrowers/${id}`, {
    method: "PUT",
    headers: jsonHeaders,
    body: JSON.stringify(borrow),
  }).then(handleResponse);

export const deleteBorrow = (id) =>
  fetch(`${BASE_URL}/borrowers/${id}`, {
    method: "DELETE",
  }).then(handleResponse);
