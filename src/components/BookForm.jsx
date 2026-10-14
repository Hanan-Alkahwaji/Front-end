import { useState, useEffect } from "react";
import { AlertError } from "./ui/AlertError.jsx";

const BookForm = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      title: initialData?.title || "",
      author: initialData?.author || "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Book title is required.";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author name is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      await onSubmit({
        title: formData.title.trim(),
        author: formData.author.trim(),
      });
    } catch (err) {
      setApiError(
        err.message || "Failed to save book. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition ${
      errors[field]
        ? "border-red-500 focus:ring-1 focus:ring-red-500"
        : "border-french/40 focus:ring-1 focus:ring-french"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AlertError
        message={apiError}
        onClose={() => setApiError(null)}
      />

      <div>
        <label
          htmlFor="title"
          className="mb-1 block text-xs font-semibold text-navy"
        >
          Book Title <span className="text-red-500">*</span>
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. 1984"
          className={inputClass("title")}
        />

        {errors.title && (
          <p className="mt-1 text-xs text-red-500">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="author"
          className="mb-1 block text-xs font-semibold text-navy"
        >
          Author Name <span className="text-red-500">*</span>
        </label>

        <input
          id="author"
          name="author"
          type="text"
          value={formData.author}
          onChange={handleChange}
          placeholder="e.g. George Orwell"
          className={inputClass("author")}
        />

        {errors.author && (
          <p className="mt-1 text-xs text-red-500">
            {errors.author}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-french/25 pt-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-french/40 bg-white px-4 py-2 text-xs font-medium text-navy/80 transition hover:bg-french/15 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-xl bg-navy px-4 py-2 text-xs font-medium text-white transition hover:bg-navy/85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting && (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}

          {initialData ? "Update Book" : "Save Book"}
        </button>
      </div>
    </form>
  );
};

export default BookForm;