import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getNews,
  getCategories,
  deleteNews,
  toggleNewsStatus,
  toggleFeatured,
} from "../../services/api";

import "./NewsManage.css";

function NewsManage() {
  // ==================================================
  // STATE
  // ==================================================

  const [newsList, setNewsList] =
    useState([]);

  const [categories, setCategories] =
    useState(["All"]);

  const [searchText, setSearchText] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==================================================
  // LOAD NEWS + CATEGORIES
  // ==================================================

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        newsResponse,
        categoryResponse,
      ] = await Promise.all([
        getNews(),
        getCategories(),
      ]);

      // ==============================================
      // NEWS
      // ==============================================

      setNewsList(
        newsResponse.news || []
      );

      // ==============================================
      // CATEGORIES
      // ==============================================

      const backendCategories =
        categoryResponse.categories ||
        [];

      setCategories([
        "All",
        ...backendCategories.map(
          (category) =>
            category.name
        ),
      ]);
    } catch (error) {
      console.error(
        "News loading error:",
        error
      );

      setError(
        error.message ||
          "ಸುದ್ದಿಗಳನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadData();
  }, []);

  // ==================================================
  // CLEAR MESSAGES
  // ==================================================

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // ==================================================
  // DELETE NEWS
  // ==================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "ಈ ಸುದ್ದಿಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      await deleteNews(id);

      setSuccess(
        "ಸುದ್ದಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ."
      );

      await loadData();
    } catch (error) {
      console.error(
        "Delete news error:",
        error
      );

      setError(
        error.message ||
          "ಸುದ್ದಿಯನ್ನು ಅಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    }
  };

  // ==================================================
  // STATUS CHANGE
  // ==================================================

  const handleStatusChange =
    async (id) => {
      try {
        clearMessages();

        await toggleNewsStatus(
          id
        );

        setSuccess(
          "ಸುದ್ದಿಯ ಸ್ಥಿತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ."
        );

        await loadData();
      } catch (error) {
        console.error(
          "Status change error:",
          error
        );

        setError(
          error.message ||
            "ಸುದ್ದಿಯ ಸ್ಥಿತಿಯನ್ನು ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
        );
      }
    };

  // ==================================================
  // FEATURED CHANGE
  // ==================================================

  const handleFeaturedChange =
    async (id) => {
      try {
        clearMessages();

        await toggleFeatured(
          id
        );

        setSuccess(
          "ಮುಖ್ಯ ಸುದ್ದಿಯ ಸ್ಥಿತಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಬದಲಾಯಿಸಲಾಗಿದೆ."
        );

        await loadData();
      } catch (error) {
        console.error(
          "Featured change error:",
          error
        );

        setError(
          error.message ||
            "ಮುಖ್ಯ ಸುದ್ದಿಯ ಸ್ಥಿತಿಯನ್ನು ಬದಲಾಯಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
        );
      }
    };

  // ==================================================
  // FILTER NEWS
  // ==================================================

  const filteredNews =
    newsList.filter(
      (news) => {
        const search =
          searchText
            .trim()
            .toLowerCase();

        const title =
          news.title ||
          "";

        const category =
          news.category ||
          "";

        const author =
          news.author ||
          "";

        const matchesSearch =
          !search ||
          title
            .toLowerCase()
            .includes(search) ||
          category
            .toLowerCase()
            .includes(search) ||
          author
            .toLowerCase()
            .includes(search);

        const matchesCategory =
          categoryFilter ===
            "All" ||
          category ===
            categoryFilter;

        const matchesStatus =
          statusFilter ===
            "All" ||
          news.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus
        );
      }
    );

  // ==================================================
  // CLEAR FILTERS
  // ==================================================

  const clearFilters = () => {
    setSearchText("");
    setCategoryFilter("All");
    setStatusFilter("All");
  };

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "kn-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="news-manage-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="admin-page-header">

        <div>

          <h1>
            ಸುದ್ದಿ ನಿರ್ವಹಣೆ
          </h1>

          <p>
            ಎಲ್ಲಾ ಸುದ್ದಿಗಳನ್ನು
            ಇಲ್ಲಿ ನಿರ್ವಹಿಸಿ.
          </p>

        </div>

        <Link
          to="/admin/news/add"
          className="admin-primary-button"
        >
          + ಹೊಸ ಸುದ್ದಿ
        </Link>

      </div>

      {/* ==================================================
          SUCCESS
      ================================================== */}

      {success && (
        <div className="admin-success-message">
          {success}
        </div>
      )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {/* ==================================================
          FILTERS
      ================================================== */}

      <section className="news-manage-filters">

        {/* SEARCH */}

        <div className="news-filter-item search">

          <label htmlFor="newsSearch">
            ಸುದ್ದಿ ಹುಡುಕಿ
          </label>

          <input
            type="search"
            id="newsSearch"
            value={searchText}
            onChange={(
              event
            ) =>
              setSearchText(
                event.target.value
              )
            }
            placeholder="ಶೀರ್ಷಿಕೆ, ವಿಭಾಗ ಅಥವಾ ಲೇಖಕ..."
          />

        </div>

        {/* CATEGORY */}

        <div className="news-filter-item">

          <label htmlFor="categoryFilter">
            ವಿಭಾಗ
          </label>

          <select
            id="categoryFilter"
            value={
              categoryFilter
            }
            onChange={(
              event
            ) =>
              setCategoryFilter(
                event.target.value
              )
            }
          >

            {categories.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category ===
                  "All"
                    ? "ಎಲ್ಲಾ ವಿಭಾಗಗಳು"
                    : category}
                </option>
              )
            )}

          </select>

        </div>

        {/* STATUS */}

        <div className="news-filter-item">

          <label htmlFor="statusFilter">
            ಸ್ಥಿತಿ
          </label>

          <select
            id="statusFilter"
            value={
              statusFilter
            }
            onChange={(
              event
            ) =>
              setStatusFilter(
                event.target.value
              )
            }
          >

            <option value="All">
              ಎಲ್ಲಾ
            </option>

            <option value="Published">
              ಪ್ರಕಟಿತ
            </option>

            <option value="Draft">
              ಕರಡು
            </option>

          </select>

        </div>

        {/* CLEAR */}

        <button
          type="button"
          className="admin-secondary-button"
          onClick={
            clearFilters
          }
        >
          Clear
        </button>

      </section>

      {/* ==================================================
          SUMMARY
      ================================================== */}

      <div className="news-manage-summary">

        <span>
          ತೋರಿಸಲಾಗುತ್ತಿದೆ:{" "}
          <strong>
            {
              filteredNews.length
            }
          </strong>
        </span>

        <span>
          ಒಟ್ಟು ಸುದ್ದಿ:{" "}
          <strong>
            {newsList.length}
          </strong>
        </span>

      </div>

      {/* ==================================================
          NEWS TABLE
      ================================================== */}

      <section className="admin-table-card">

        <div className="admin-table-wrapper">

          <table className="admin-table news-manage-table">

            <thead>

              <tr>
                <th>#</th>
                <th>ಸುದ್ದಿ</th>
                <th>ವಿಭಾಗ</th>
                <th>ಲೇಖಕ</th>
                <th>ದಿನಾಂಕ</th>
                <th>ಸ್ಥಿತಿ</th>
                <th>ಮುಖ್ಯ</th>
                <th>ಕ್ರಿಯೆಗಳು</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (
                <tr>

                  <td
                    colSpan="8"
                    className="admin-empty"
                  >
                    ಸುದ್ದಿಗಳನ್ನು
                    ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
                  </td>

                </tr>
              ) : filteredNews.length ===
                0 ? (
                <tr>

                  <td
                    colSpan="8"
                    className="admin-empty"
                  >
                    ಯಾವುದೇ ಸುದ್ದಿ
                    ಕಂಡುಬಂದಿಲ್ಲ.
                  </td>

                </tr>
              ) : (
                filteredNews.map(
                  (
                    news,
                    index
                  ) => {

                    const newsId =
                      news._id ||
                      news.id;

                    return (
                      <tr
                        key={newsId}
                      >

                        {/* NUMBER */}

                        <td>
                          {index + 1}
                        </td>

                        {/* TITLE */}

                        <td className="news-manage-title">

                          <strong>
                            {
                              news.title
                            }
                          </strong>

                        </td>

                        {/* CATEGORY */}

                        <td>
                          {
                            news.category ||
                            "-"
                          }
                        </td>

                        {/* AUTHOR */}

                        <td>
                          {
                            news.author ||
                            "ಸಮಾನತೆ ಧ್ವನಿ"
                          }
                        </td>

                        {/* DATE */}

                        <td>
                          {formatDate(
                            news.publishedAt ||
                              news.createdAt
                          )}
                        </td>

                        {/* STATUS */}

                        <td>

                          <button
                            type="button"
                            className={
                              news.status ===
                              "Published"
                                ? "status-active"
                                : "status-inactive"
                            }
                            onClick={() =>
                              handleStatusChange(
                                newsId
                              )
                            }
                          >

                            {news.status ===
                            "Published"
                              ? "ಪ್ರಕಟಿತ"
                              : "ಕರಡು"}

                          </button>

                        </td>

                        {/* FEATURED */}

                        <td>

                          <button
                            type="button"
                            className={
                              news.featured
                                ? "featured-active"
                                : "featured-inactive"
                            }
                            onClick={() =>
                              handleFeaturedChange(
                                newsId
                              )
                            }
                            aria-label={
                              news.featured
                                ? "ಮುಖ್ಯ ಸುದ್ದಿ ತೆಗೆದುಹಾಕಿ"
                                : "ಮುಖ್ಯ ಸುದ್ದಿ ಮಾಡಿ"
                            }
                          >

                            {news.featured
                              ? "★"
                              : "☆"}

                          </button>

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="admin-actions">

                            <Link
                              to={`/admin/news/edit/${newsId}`}
                              className="admin-edit-button"
                            >
                              Edit
                            </Link>

                            <button
                              type="button"
                              className="admin-delete-button"
                              onClick={() =>
                                handleDelete(
                                  newsId
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

export default NewsManage;