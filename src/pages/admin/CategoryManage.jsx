import React, { useEffect, useState } from "react";

import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../services/api";

import "./CategoryManage.css";

function CategoryManage() {
  // ====================================================
  // STATE
  // ====================================================

  const [categories, setCategories] =
    useState([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      slug: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ====================================================
  // GENERATE SLUG
  // ====================================================

  const generateSlug = (name) => {
    return name
      .trim()
      .toLowerCase()
      .normalize("NFKC")
      .replace(
        /[^\p{L}\p{N}\s-]/gu,
        ""
      )
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // ====================================================
  // LOAD CATEGORIES
  // ====================================================

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getCategories();

      setCategories(
        response.categories || []
      );
    } catch (error) {
      console.error(
        "Get categories error:",
        error
      );

      setError(
        error.message ||
          "ವಿಭಾಗಗಳನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // LOAD ON PAGE OPEN
  // ====================================================

  useEffect(() => {
    loadCategories();
  }, []);

  // ====================================================
  // HANDLE NAME CHANGE
  // ====================================================

  const handleNameChange = (
    event
  ) => {
    const name =
      event.target.value;

    setFormData((previous) => ({
      ...previous,

      name,

      slug: editingId
        ? previous.slug
        : generateSlug(name),
    }));

    setError("");
  };

  // ====================================================
  // HANDLE SLUG CHANGE
  // ====================================================

  const handleSlugChange = (
    event
  ) => {
    setFormData((previous) => ({
      ...previous,
      slug: event.target.value
        .toLowerCase()
        .replace(/\s+/g, "-"),
    }));

    setError("");
  };

  // ====================================================
  // SUBMIT CATEGORY
  // ====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const name =
      formData.name.trim();

    const slug =
      formData.slug.trim();

    if (!name) {
      setError(
        "ದಯವಿಟ್ಟು ವಿಭಾಗದ ಹೆಸರು ನಮೂದಿಸಿ."
      );
      return;
    }

    if (!slug) {
      setError(
        "ದಯವಿಟ್ಟು slug ನಮೂದಿಸಿ."
      );
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        // ==============================================
        // UPDATE CATEGORY
        // ==============================================

        await updateCategory(
          editingId,
          {
            name,
            slug,
          }
        );

        setSuccess(
          "ವಿಭಾಗವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ."
        );
      } else {
        // ==============================================
        // CREATE CATEGORY
        // ==============================================

        await addCategory({
          name,
          slug,
          status: "Active",
        });

        setSuccess(
          "ವಿಭಾಗವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ."
        );
      }

      await loadCategories();

      resetForm();
    } catch (error) {
      console.error(
        "Save category error:",
        error
      );

      setError(
        error.message ||
          "ವಿಭಾಗವನ್ನು ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    } finally {
      setSaving(false);
    }
  };

  // ====================================================
  // EDIT CATEGORY
  // ====================================================

  const handleEdit = (
    category
  ) => {
    setEditingId(
      category._id || category.id
    );

    setFormData({
      name: category.name || "",
      slug: category.slug || "",
    });

    setShowForm(true);

    setError("");
    setSuccess("");
  };

  // ====================================================
  // DELETE CATEGORY
  // ====================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "ಈ ವಿಭಾಗವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteCategory(id);

      setSuccess(
        "ವಿಭಾಗವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Delete category error:",
        error
      );

      setError(
        error.message ||
          "ವಿಭಾಗವನ್ನು ಅಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    }
  };

  // ====================================================
  // CHANGE STATUS
  // ====================================================

  const handleStatusChange = async (
    category
  ) => {
    const id =
      category._id ||
      category.id;

    const newStatus =
      category.status ===
      "Active"
        ? "Inactive"
        : "Active";

    try {
      setError("");
      setSuccess("");

      await updateCategory(
        id,
        {
          name: category.name,
          slug: category.slug,
          status: newStatus,
        }
      );

      setSuccess(
        newStatus === "Active"
          ? "ವಿಭಾಗ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ."
          : "ವಿಭಾಗ ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ."
      );

      await loadCategories();
    } catch (error) {
      console.error(
        "Category status error:",
        error
      );

      setError(
        error.message ||
          "ವಿಭಾಗದ ಸ್ಥಿತಿಯನ್ನು ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    }
  };

  // ====================================================
  // OPEN ADD FORM
  // ====================================================

  const openAddForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      slug: "",
    });

    setShowForm(true);

    setError("");
    setSuccess("");
  };

  // ====================================================
  // RESET FORM
  // ====================================================

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <main className="category-manage-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="admin-page-header">

        <div>
          <h1>
            ವಿಭಾಗ ನಿರ್ವಹಣೆ
          </h1>

          <p>
            ಸುದ್ದಿ ವಿಭಾಗಗಳನ್ನು ಇಲ್ಲಿ
            ನಿರ್ವಹಿಸಿ.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddForm}
        >
          + ವಿಭಾಗ ಸೇರಿಸಿ
        </button>

      </div>

      {/* ==================================================
          SUCCESS MESSAGE
      ================================================== */}

      {success && (
        <div className="admin-success-message">
          {success}
        </div>
      )}

      {/* ==================================================
          ERROR MESSAGE
      ================================================== */}

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {/* ==================================================
          ADD / EDIT FORM
      ================================================== */}

      {showForm && (
        <section className="admin-form-card">

          <div className="admin-form-header">

            <div>
              <h2>
                {editingId
                  ? "ವಿಭಾಗ ಬದಲಾಯಿಸಿ"
                  : "ಹೊಸ ವಿಭಾಗ ಸೇರಿಸಿ"}
              </h2>

              <p>
                ವಿಭಾಗದ ಹೆಸರು ಮತ್ತು slug
                ನಮೂದಿಸಿ.
              </p>
            </div>

            <button
              type="button"
              className="admin-close-button"
              onClick={resetForm}
              disabled={saving}
            >
              ×
            </button>

          </div>

          <form
            onSubmit={
              handleSubmit
            }
          >

            <div className="admin-form-grid">

              {/* Category Name */}

              <div className="admin-form-group">

                <label htmlFor="categoryName">
                  ವಿಭಾಗದ ಹೆಸರು
                </label>

                <input
                  type="text"
                  id="categoryName"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleNameChange
                  }
                  placeholder="ಉದಾ: ಕರ್ನಾಟಕ"
                  required
                  disabled={saving}
                />

              </div>

              {/* Slug */}

              <div className="admin-form-group">

                <label htmlFor="categorySlug">
                  Slug
                </label>

                <input
                  type="text"
                  id="categorySlug"
                  name="slug"
                  value={
                    formData.slug
                  }
                  onChange={
                    handleSlugChange
                  }
                  placeholder="ಉದಾ: karnataka"
                  required
                  disabled={saving}
                />

              </div>

            </div>

            {/* Form Actions */}

            <div className="admin-form-actions">

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "ಉಳಿಸಲಾಗುತ್ತಿದೆ..."
                  : editingId
                  ? "ಬದಲಾವಣೆ ಉಳಿಸಿ"
                  : "ವಿಭಾಗ ಸೇರಿಸಿ"}
              </button>

              <button
                type="button"
                className="admin-secondary-button"
                onClick={
                  resetForm
                }
                disabled={saving}
              >
                ರದ್ದುಪಡಿಸಿ
              </button>

            </div>

          </form>

        </section>
      )}

      {/* ==================================================
          CATEGORY TABLE
      ================================================== */}

      <section className="admin-table-card">

        <div className="admin-table-header">

          <div>
            <h2>
              ಎಲ್ಲಾ ವಿಭಾಗಗಳು
            </h2>

            <p>
              ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಬಳಸುವ
              ಸುದ್ದಿ ವಿಭಾಗಗಳು
            </p>
          </div>

          <span>
            ಒಟ್ಟು:{" "}
            {categories.length}
          </span>

        </div>

        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>
              <tr>
                <th>#</th>
                <th>ವಿಭಾಗ</th>
                <th>Slug</th>
                <th>ಸ್ಥಿತಿ</th>
                <th>ಕ್ರಿಯೆಗಳು</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="admin-empty"
                  >
                    ವಿಭಾಗಗಳನ್ನು
                    ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
                  </td>
                </tr>
              ) : categories.length ===
                0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="admin-empty"
                  >
                    ಯಾವುದೇ ವಿಭಾಗಗಳು
                    ಲಭ್ಯವಿಲ್ಲ.
                  </td>
                </tr>
              ) : (
                categories.map(
                  (
                    category,
                    index
                  ) => {
                    const categoryId =
                      category._id ||
                      category.id;

                    return (
                      <tr
                        key={
                          categoryId
                        }
                      >

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {
                              category.name
                            }
                          </strong>
                        </td>

                        <td>
                          <code>
                            {
                              category.slug
                            }
                          </code>
                        </td>

                        <td>

                          <button
                            type="button"
                            className={
                              category.status ===
                              "Active"
                                ? "status-active"
                                : "status-inactive"
                            }
                            onClick={() =>
                              handleStatusChange(
                                category
                              )
                            }
                          >
                            {category.status ===
                            "Active"
                              ? "ಸಕ್ರಿಯ"
                              : "ನಿಷ್ಕ್ರಿಯ"}
                          </button>

                        </td>

                        <td>

                          <div className="admin-actions">

                            <button
                              type="button"
                              className="admin-edit-button"
                              onClick={() =>
                                handleEdit(
                                  category
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="admin-delete-button"
                              onClick={() =>
                                handleDelete(
                                  categoryId
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}

export default CategoryManage;