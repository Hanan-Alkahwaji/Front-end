const BASE_URL = "http://localhost:3000";

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Server Error (${response.status})`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

const jsonHeaders = { "Content-Type": "application/json" };

//Books
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

export const patchBook = (id, partialData) =>
  fetch(`${BASE_URL}/books/${id}`, {
    method: "Put",
    headers: jsonHeaders,
    body: JSON.stringify(partialData),
  }).then(handleResponse);

export const deleteBook = (id) =>
  fetch(`${BASE_URL}/books/${id}`, { method: "DELETE" }).then(handleResponse);

//Borrows
export const fetchBorrows = () =>
  fetch(`${BASE_URL}/borrowers`).then(handleResponse);

export const addBorrow = (borrow) =>
  fetch(`${BASE_URL}/borrowers`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(borrow),
  }).then(handleResponse);

export const updateBorrow = (id, borrow) =>
  fetch(`${BASE_URL}/borrowers/${id}`, {
    method: "Put",
    headers: jsonHeaders,
    body: JSON.stringify(borrow),
  }).then(handleResponse);

export const deleteBorrow = (id) =>
  fetch(`${BASE_URL}/borrowers/${id}`, { method: "DELETE" }).then(
    handleResponse
  );
