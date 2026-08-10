import React, { useEffect, useState } from "react";

import "./MonthlyPaperManage.css";

// ======================================================
// API URL
// ======================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ======================================================
// MONTHS
// ======================================================

const months = [
  "ಜನವರಿ",
  "ಫೆಬ್ರವರಿ",
  "ಮಾರ್ಚ್",
  "ಏಪ್ರಿಲ್",
  "ಮೇ",
  "ಜೂನ್",
  "ಜುಲೈ",
  "ಆಗಸ್ಟ್",
  "ಸೆಪ್ಟೆಂಬರ್",
  "ಅಕ್ಟೋಬರ್",
  "ನವೆಂಬರ್",
  "ಡಿಸೆಂಬರ್",
];

// ======================================================
// COMPONENT
// ======================================================

function MonthlyPaperManage() {
  const [papers, setPapers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  // ====================================================
  // FORM DATA
  // ====================================================

  const [formData, setFormData] = useState({
    title: "ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆ",
    month: "",
    year: new Date().getFullYear(),
    description: "",
    status: "Draft",
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [pdfName, setPdfName] = useState("");
  const [coverPreview, setCoverPreview] = useState("");

  // ====================================================
  // AUTH TOKEN
  // ====================================================

  const getToken = () => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken") ||
      localStorage.getItem("authToken") ||
      ""
    );
  };

  // ====================================================
  // AUTH HEADERS
  // ====================================================

  const getAuthHeaders = () => {
    const token = getToken();

    if (!token) {
      return {};
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ====================================================
  // NORMALIZE PAPER
  // ====================================================

  const normalizePaper = (paper) => {
    if (!paper) {
      return null;
    }

    return {
      ...paper,

      _id:
        paper._id ||
        paper.id ||
        paper.paperId ||
        Date.now().toString(),

      title:
        paper.title ||
        "ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆ",

      month:
        paper.month || "",

      year:
        paper.year ||
        new Date().getFullYear(),

      description:
        paper.description || "",

      status:
        paper.status || "Draft",

      pdfUrl:
        paper.pdfUrl ||
        paper.pdfURL ||
        paper.pdf ||
        paper.pdfFile ||
        "",

      pdfOriginalName:
        paper.pdfOriginalName ||
        paper.pdfName ||
        paper.originalPdfName ||
        "",

      coverImage:
        paper.coverImage ||
        paper.coverImageUrl ||
        paper.coverUrl ||
        "",

      createdAt:
        paper.createdAt ||
        paper.created_at ||
        new Date().toISOString(),
    };
  };

  // ====================================================
  // EXTRACT PAPERS FROM API RESPONSE
  // ====================================================

  const extractPapers = (data) => {
    if (!data) {
      return [];
    }

    // Most common response
    if (Array.isArray(data.papers)) {
      return data.papers.map(normalizePaper).filter(Boolean);
    }

    // Alternative response
    if (Array.isArray(data.monthlyPapers)) {
      return data.monthlyPapers
        .map(normalizePaper)
        .filter(Boolean);
    }

    // Alternative response
    if (Array.isArray(data.data)) {
      return data.data
        .map(normalizePaper)
        .filter(Boolean);
    }

    // Alternative response
    if (Array.isArray(data.results)) {
      return data.results
        .map(normalizePaper)
        .filter(Boolean);
    }

    // If API returns one paper
    if (data.paper) {
      const paper = normalizePaper(data.paper);

      return paper ? [paper] : [];
    }

    // If API returns one monthly paper
    if (data.monthlyPaper) {
      const paper = normalizePaper(
        data.monthlyPaper
      );

      return paper ? [paper] : [];
    }

    // Direct object
    if (
      data._id ||
      data.id ||
      data.title
    ) {
      const paper = normalizePaper(data);

      return paper ? [paper] : [];
    }

    return [];
  };

  // ====================================================
  // FETCH PAPERS
  // ====================================================

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/monthly-papers`,
        {
          method: "GET",
          headers: {
            ...getAuthHeaders(),
          },
        }
      );

      const data = await response.json();

      console.log(
        "Monthly Papers API Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to fetch monthly papers."
        );
      }

      const loadedPapers =
        extractPapers(data);

      setPapers(loadedPapers);
    } catch (error) {
      console.error(
        "Fetch monthly papers error:",
        error
      );

      setError(
        error.message ||
          "Unable to fetch monthly papers."
      );
    } finally {
      setLoading(false);
    }
  };

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    fetchPapers();
  }, []);

  // ====================================================
  // HANDLE TEXT CHANGE
  // ====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // ====================================================
  // PDF CHANGE
  // ====================================================

  const handlePdfChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !==
      "application/pdf"
    ) {
      setError(
        "ದಯವಿಟ್ಟು PDF file ಮಾತ್ರ ಆಯ್ಕೆಮಾಡಿ."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      100 * 1024 * 1024
    ) {
      setError(
        "PDF file size 100 MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು."
      );

      event.target.value = "";
      return;
    }

    setPdfFile(file);
    setPdfName(file.name);

    setMessage("");
    setError("");
  };

  // ====================================================
  // COVER IMAGE CHANGE
  // ====================================================

  const handleCoverImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "JPG, PNG ಅಥವಾ WEBP cover image ಮಾತ್ರ ಆಯ್ಕೆಮಾಡಿ."
      );

      event.target.value = "";
      return;
    }

    setCoverImage(file);

    const preview =
      URL.createObjectURL(file);

    setCoverPreview(preview);

    setMessage("");
    setError("");
  };

  // ====================================================
  // RESET FORM
  // ====================================================

  const resetForm = ({
    close = true,
    clearMessages = false,
  } = {}) => {
    setFormData({
      title:
        "ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆ",

      month: "",

      year:
        new Date().getFullYear(),

      description: "",

      status: "Draft",
    });

    setPdfFile(null);
    setCoverImage(null);
    setPdfName("");
    setCoverPreview("");

    setEditingId(null);

    if (close) {
      setShowForm(false);
    }

    if (clearMessages) {
      setMessage("");
      setError("");
    }
  };

  // ====================================================
  // EDIT PAPER
  // ====================================================

  const handleEdit = (paper) => {
    setEditingId(
      paper._id
    );

    setFormData({
      title:
        paper.title ||
        "ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆ",

      month:
        paper.month || "",

      year:
        paper.year ||
        new Date().getFullYear(),

      description:
        paper.description || "",

      status:
        paper.status || "Draft",
    });

    setPdfFile(null);
    setCoverImage(null);

    setPdfName(
      paper.pdfOriginalName || ""
    );

    setCoverPreview(
      paper.coverImage || ""
    );

    setMessage("");
    setError("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ====================================================
  // SUBMIT FORM
  // ====================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!formData.title.trim()) {
      setError(
        "ಪತ್ರಿಕೆಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ."
      );
      return;
    }

    if (!formData.month) {
      setError(
        "ತಿಂಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ."
      );
      return;
    }

    if (!formData.year) {
      setError(
        "ವರ್ಷವನ್ನು ನಮೂದಿಸಿ."
      );
      return;
    }

    if (
      !editingId &&
      !pdfFile
    ) {
      setError(
        "ದಯವಿಟ್ಟು ಪತ್ರಿಕೆಯ PDF ಆಯ್ಕೆಮಾಡಿ."
      );
      return;
    }

    try {
      setSubmitting(true);

      const data =
        new FormData();

      data.append(
        "title",
        formData.title.trim()
      );

      data.append(
        "month",
        formData.month
      );

      data.append(
        "year",
        String(formData.year)
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "status",
        formData.status
      );

      if (pdfFile) {
        data.append(
          "pdf",
          pdfFile
        );
      }

      if (coverImage) {
        data.append(
          "coverImage",
          coverImage
        );
      }

      const endpoint =
        editingId
          ? `${API_URL}/monthly-papers/${editingId}`
          : `${API_URL}/monthly-papers/upload`;

      const method =
        editingId
          ? "PUT"
          : "POST";

      console.log(
        "Submitting Monthly Paper:",
        {
          endpoint,
          method,
          title: formData.title,
          month: formData.month,
          year: formData.year,
          status: formData.status,
        }
      );

      const response =
        await fetch(
          endpoint,
          {
            method,
            headers: {
              ...getAuthHeaders(),
            },
            body: data,
          }
        );

      const result =
        await response.json();

      console.log(
        "Monthly Paper Save Response:",
        result
      );

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to save monthly paper."
        );
      }

      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      const successMessage =
        editingId
          ? "ಮಾಸಿಕ ಪತ್ರಿಕೆಯ ಬದಲಾವಣೆಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ."
          : "ಮಾಸಿಕ ಪತ್ರಿಕೆ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ.";

      setMessage(
        successMessage
      );

      // ------------------------------------------------
      // Try to get newly saved paper
      // ------------------------------------------------

      let savedPaper = null;

      if (result.paper) {
        savedPaper =
          normalizePaper(
            result.paper
          );
      } else if (
        result.monthlyPaper
      ) {
        savedPaper =
          normalizePaper(
            result.monthlyPaper
          );
      } else if (
        result.data &&
        !Array.isArray(result.data)
      ) {
        if (
          result.data._id ||
          result.data.id ||
          result.data.title
        ) {
          savedPaper =
            normalizePaper(
              result.data
            );
        }
      } else if (
        result._id ||
        result.id
      ) {
        savedPaper =
          normalizePaper(
            result
          );
      }

      // ------------------------------------------------
      // Immediately update UI
      // ------------------------------------------------

      if (savedPaper) {
        if (editingId) {
          setPapers(
            (previous) =>
              previous.map(
                (paper) =>
                  paper._id ===
                  editingId
                    ? savedPaper
                    : paper
              )
          );
        } else {
          setPapers(
            (previous) => [
              savedPaper,
              ...previous,
            ]
          );
        }
      }

      // ------------------------------------------------
      // Reset form WITHOUT clearing success message
      // ------------------------------------------------

      resetForm({
        close: true,
        clearMessages: false,
      });

      // ------------------------------------------------
      // Fetch latest list from backend
      // ------------------------------------------------

      await fetchPapers();

      // Keep success message visible
      setMessage(
        successMessage
      );
    } catch (error) {
      console.error(
        "Save monthly paper error:",
        error
      );

      setError(
        error.message ||
          "ಮಾಸಿಕ ಪತ್ರಿಕೆ ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ====================================================
  // TOGGLE STATUS
  // ====================================================

  const handleStatusToggle = async (
    paper
  ) => {
    try {
      setError("");
      setMessage("");

      const response =
        await fetch(
          `${API_URL}/monthly-papers/${paper._id}/status`,
          {
            method: "PATCH",
            headers: {
              ...getAuthHeaders(),
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "Status Update Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to change status."
        );
      }

      setMessage(
        data.message ||
          "Status updated successfully."
      );

      await fetchPapers();
    } catch (error) {
      console.error(
        "Toggle paper status error:",
        error
      );

      setError(
        error.message ||
          "Status ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    }
  };

  // ====================================================
  // DELETE PAPER
  // ====================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "ಈ ಮಾಸಿಕ ಪತ್ರಿಕೆಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response =
        await fetch(
          `${API_URL}/monthly-papers/${id}`,
          {
            method: "DELETE",
            headers: {
              ...getAuthHeaders(),
            },
          }
        );

      const data =
        await response.json();

      console.log(
        "Delete Response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete monthly paper."
        );
      }

      // Remove immediately from UI
      setPapers(
        (previous) =>
          previous.filter(
            (paper) =>
              paper._id !== id
          )
      );

      setMessage(
        data.message ||
          "ಮಾಸಿಕ ಪತ್ರಿಕೆ ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ."
      );

      await fetchPapers();
    } catch (error) {
      console.error(
        "Delete monthly paper error:",
        error
      );

      setError(
        error.message ||
          "ಮಾಸಿಕ ಪತ್ರಿಕೆ ಅಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    }
  };

  // ====================================================
  // READ PAPER
  // ====================================================

  const handleReadPaper = (
    paper
  ) => {
    if (!paper.pdfUrl) {
      setError(
        "ಈ ಪತ್ರಿಕೆಯ PDF ಲಭ್ಯವಿಲ್ಲ."
      );
      return;
    }

    window.open(
      paper.pdfUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ====================================================
  // DOWNLOAD PAPER
  // ====================================================

  const handleDownload = (
    paper
  ) => {
    if (!paper.pdfUrl) {
      setError(
        "ಈ ಪತ್ರಿಕೆಯ PDF ಲಭ್ಯವಿಲ್ಲ."
      );
      return;
    }

    const link =
      document.createElement(
        "a"
      );

    link.href =
      paper.pdfUrl;

    link.target = "_blank";

    link.rel =
      "noopener noreferrer";

    link.download =
      paper.pdfOriginalName ||
      `${paper.title}.pdf`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );
  };

  // ====================================================
  // FORMAT DATE
  // ====================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        "kn-IN"
      );
    } catch {
      return "-";
    }
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="monthly-paper-manage">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="admin-page-header">

        <div>
          <h1>
            ಮಾಸಿಕ ಪತ್ರಿಕೆ ನಿರ್ವಹಣೆ
          </h1>

          <p>
            ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆಯನ್ನು
            ಇಲ್ಲಿ ಅಪ್‌ಲೋಡ್ ಮತ್ತು ನಿರ್ವಹಿಸಿ.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() => {
            if (showForm) {
              resetForm({
                close: true,
                clearMessages: false,
              });
            } else {
              setMessage("");
              setError("");
              setShowForm(true);
            }
          }}
        >
          {showForm
            ? "× ಮುಚ್ಚಿ"
            : "+ ಪತ್ರಿಕೆ ಸೇರಿಸಿ"}
        </button>

      </div>

      {/* ==================================================
          SUCCESS MESSAGE
      ================================================== */}

      {message && (
        <div className="settings-success">
          {message}
        </div>
      )}

      {/* ==================================================
          ERROR MESSAGE
      ================================================== */}

      {error && (
        <div className="news-form-message">
          {error}
        </div>
      )}

      {/* ==================================================
          ADD / EDIT FORM
      ================================================== */}

      {showForm && (
        <section className="admin-form-card monthly-paper-form">

          <div className="admin-form-header">

            <div>
              <h2>
                {editingId
                  ? "ಮಾಸಿಕ ಪತ್ರಿಕೆ ಬದಲಾಯಿಸಿ"
                  : "ಹೊಸ ಮಾಸಿಕ ಪತ್ರಿಕೆ ಸೇರಿಸಿ"}
              </h2>

              <p>
                PDF ಮತ್ತು cover image
                ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.
              </p>
            </div>

            <button
              type="button"
              className="admin-close-button"
              onClick={() =>
                resetForm({
                  close: true,
                  clearMessages: false,
                })
              }
            >
              ×
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
          >

            {/* TITLE */}

            <div className="admin-form-group">

              <label htmlFor="paperTitle">
                ಪತ್ರಿಕೆಯ ಹೆಸರು *
              </label>

              <input
                type="text"
                id="paperTitle"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆ"
                required
              />

            </div>

            {/* MONTH + YEAR */}

            <div className="admin-form-grid">

              <div className="admin-form-group">

                <label htmlFor="paperMonth">
                  ತಿಂಗಳು *
                </label>

                <select
                  id="paperMonth"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    ತಿಂಗಳು ಆಯ್ಕೆಮಾಡಿ
                  </option>

                  {months.map(
                    (month) => (
                      <option
                        key={month}
                        value={month}
                      >
                        {month}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="admin-form-group">

                <label htmlFor="paperYear">
                  ವರ್ಷ *
                </label>

                <input
                  type="number"
                  id="paperYear"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="2000"
                  max="2100"
                  required
                />

              </div>

            </div>

            {/* DESCRIPTION */}

            <div className="admin-form-group">

              <label htmlFor="paperDescription">
                ವಿವರಣೆ
              </label>

              <textarea
                id="paperDescription"
                name="description"
                value={
                  formData.description
                }
                onChange={handleChange}
                placeholder="ಈ ತಿಂಗಳ ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆಯ ಕುರಿತು ಸಣ್ಣ ವಿವರಣೆ..."
                rows="4"
              />

            </div>

            {/* STATUS */}

            <div className="admin-form-group">

              <label htmlFor="paperStatus">
                ಸ್ಥಿತಿ
              </label>

              <select
                id="paperStatus"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="Draft">
                  ಕರಡು
                </option>

                <option value="Published">
                  ಪ್ರಕಟಿತ
                </option>

              </select>

            </div>

            {/* PDF */}

            <div className="admin-form-group">

              <label htmlFor="paperPdf">
                ಪತ್ರಿಕೆ PDF *
              </label>

              <div className="monthly-paper-upload-box">

                <input
                  type="file"
                  id="paperPdf"
                  accept="application/pdf,.pdf"
                  onChange={
                    handlePdfChange
                  }
                />

                <label htmlFor="paperPdf">
                  📄 PDF ಆಯ್ಕೆಮಾಡಿ
                </label>

              </div>

              {pdfName && (
                <div className="monthly-paper-file-name">
                  📄 {pdfName}
                </div>
              )}

              <small>
                PDF ಮಾತ್ರ. ಗರಿಷ್ಠ 100 MB.
              </small>

            </div>

            {/* COVER IMAGE */}

            <div className="admin-form-group">

              <label htmlFor="paperCover">
                Cover Image
              </label>

              <div className="monthly-paper-upload-box">

                <input
                  type="file"
                  id="paperCover"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleCoverImageChange
                  }
                />

                <label htmlFor="paperCover">
                  🖼️ Cover Image ಆಯ್ಕೆಮಾಡಿ
                </label>

              </div>

              {coverPreview && (
                <div className="monthly-paper-cover-preview">

                  <img
                    src={coverPreview}
                    alt="Monthly paper cover preview"
                  />

                </div>
              )}

            </div>

            {/* ACTIONS */}

            <div className="admin-form-actions">

              <button
                type="submit"
                className="admin-primary-button"
                disabled={submitting}
              >
                {submitting
                  ? "ಉಳಿಸಲಾಗುತ್ತಿದೆ..."
                  : editingId
                  ? "ಬದಲಾವಣೆ ಉಳಿಸಿ"
                  : "ಪತ್ರಿಕೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ"}
              </button>

              <button
                type="button"
                className="admin-secondary-button"
                onClick={() =>
                  resetForm({
                    close: true,
                    clearMessages: false,
                  })
                }
                disabled={submitting}
              >
                ರದ್ದುಪಡಿಸಿ
              </button>

            </div>

          </form>

        </section>
      )}

      {/* ==================================================
          PAPER LIST
      ================================================== */}

      <section className="admin-table-card">

        <div className="admin-table-header">

          <div>
            <h2>
              ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆ
            </h2>

            <p>
              ಒಟ್ಟು{" "}
              <strong>
                {papers.length}
              </strong>{" "}
              ಪತ್ರಿಕೆಗಳು
            </p>
          </div>

          {/* Refresh */}

          <button
            type="button"
            className="admin-secondary-button small"
            onClick={fetchPapers}
            disabled={loading}
          >
            {loading
              ? "ಲೋಡ್..."
              : "↻ Refresh"}
          </button>

        </div>

        {/* LOADING */}

        {loading ? (
          <div className="admin-empty">

            <div
              style={{
                fontSize: "30px",
                marginBottom: "10px",
              }}
            >
              ⏳
            </div>

            <h3>
              ಪತ್ರಿಕೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
            </h3>

          </div>
        ) : papers.length === 0 ? (

          /* EMPTY */

          <div className="admin-empty">

            <div
              style={{
                fontSize: "45px",
                marginBottom: "10px",
              }}
            >
              📰
            </div>

            <h3>
              ಯಾವುದೇ ಮಾಸಿಕ ಪತ್ರಿಕೆ ಇಲ್ಲ
            </h3>

            <p>
              "+ ಪತ್ರಿಕೆ ಸೇರಿಸಿ" ಬಟನ್
              ಬಳಸಿ ಮೊದಲ ಪತ್ರಿಕೆಯನ್ನು
              ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.
            </p>

            <button
              type="button"
              className="admin-primary-button"
              onClick={() => {
                setMessage("");
                setError("");
                setShowForm(true);
              }}
            >
              + ಮೊದಲ ಪತ್ರಿಕೆ ಸೇರಿಸಿ
            </button>

          </div>

        ) : (

          /* TABLE */

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>#</th>
                  <th>Cover</th>
                  <th>ಪತ್ರಿಕೆ</th>
                  <th>ತಿಂಗಳು</th>
                  <th>ವರ್ಷ</th>
                  <th>ಸ್ಥಿತಿ</th>
                  <th>ದಿನಾಂಕ</th>
                  <th>ಕ್ರಿಯೆಗಳು</th>
                </tr>

              </thead>

              <tbody>

                {papers.map(
                  (paper, index) => (

                    <tr
                      key={
                        paper._id ||
                        `${paper.title}-${index}`
                      }
                    >

                      {/* NUMBER */}

                      <td>
                        {index + 1}
                      </td>

                      {/* COVER */}

                      <td>

                        {paper.coverImage ? (
                          <img
                            src={
                              paper.coverImage
                            }
                            alt={
                              paper.title
                            }
                            className="monthly-paper-table-cover"
                          />
                        ) : (
                          <div className="monthly-paper-no-cover">
                            📰
                          </div>
                        )}

                      </td>

                      {/* TITLE */}

                      <td>

                        <strong>
                          {paper.title}
                        </strong>

                        {paper.description && (
                          <small className="monthly-paper-description">
                            {
                              paper.description
                            }
                          </small>
                        )}

                        {paper.pdfOriginalName && (
                          <small className="monthly-paper-pdf-name">
                            📄{" "}
                            {
                              paper.pdfOriginalName
                            }
                          </small>
                        )}

                      </td>

                      {/* MONTH */}

                      <td>
                        {paper.month ||
                          "-"}
                      </td>

                      {/* YEAR */}

                      <td>
                        {paper.year ||
                          "-"}
                      </td>

                      {/* STATUS */}

                      <td>

                        <button
                          type="button"
                          className={
                            paper.status ===
                            "Published"
                              ? "status-active"
                              : "status-inactive"
                          }
                          onClick={() =>
                            handleStatusToggle(
                              paper
                            )
                          }
                        >
                          {paper.status ===
                          "Published"
                            ? "ಪ್ರಕಟಿತ"
                            : "ಕರಡು"}
                        </button>

                      </td>

                      {/* DATE */}

                      <td>
                        {formatDate(
                          paper.createdAt
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="monthly-paper-actions">

                          <button
                            type="button"
                            className="admin-primary-button small"
                            onClick={() =>
                              handleReadPaper(
                                paper
                              )
                            }
                            disabled={
                              !paper.pdfUrl
                            }
                            title="PDF ಓದಿ"
                          >
                            📖 ಓದಿ
                          </button>

                          <button
                            type="button"
                            className="admin-secondary-button small"
                            onClick={() =>
                              handleDownload(
                                paper
                              )
                            }
                            disabled={
                              !paper.pdfUrl
                            }
                            title="PDF Download"
                          >
                            ⬇️
                          </button>

                          <button
                            type="button"
                            className="admin-secondary-button small"
                            onClick={() =>
                              handleEdit(
                                paper
                              )
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() =>
                              handleDelete(
                                paper._id
                              )
                            }
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default MonthlyPaperManage;