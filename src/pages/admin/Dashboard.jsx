import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getDashboardStats,
  getRecentNews,
} from "../../services/api";

import "./Dashboard.css";

function Dashboard() {
  // ==================================================
  // STATE
  // ==================================================

  const [stats, setStats] = useState({
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
    categories: 0,
    media: 0,
    users: 0,
  });

  const [recentNews, setRecentNews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==================================================
  // LOAD DASHBOARD DATA
  // ==================================================

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        statsResponse,
        recentNewsResponse,
      ] = await Promise.all([
        getDashboardStats(),
        getRecentNews(5),
      ]);


      // ----------------------------------------------
      // Statistics
      // ----------------------------------------------

      if (statsResponse?.stats) {
        setStats({
          totalNews:
            statsResponse.stats.totalNews || 0,

          publishedNews:
            statsResponse.stats.publishedNews || 0,

          draftNews:
            statsResponse.stats.draftNews || 0,

          categories:
            statsResponse.stats.categories || 0,

          media:
            statsResponse.stats.media || 0,

          users:
            statsResponse.stats.users || 0,
        });
      }


      // ----------------------------------------------
      // Recent News
      // ----------------------------------------------

      setRecentNews(
        recentNewsResponse?.news ||
        recentNewsResponse?.recentNews ||
        []
      );

    } catch (error) {
      console.error(
        "Dashboard loading error:",
        error
      );

      setError(
        error.message ||
          "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );

    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // LOAD WHEN PAGE OPENS
  // ==================================================

  useEffect(() => {
    loadDashboard();
  }, []);


  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "kn-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };


  // ==================================================
  // STATISTICS
  // ==================================================

  const statCards = [
    {
      title: "ಒಟ್ಟು ಸುದ್ದಿಗಳು",
      value: stats.totalNews,
      icon: "📰",
      link: "/admin/news",
      className: "news",
    },

    {
      title: "ಪ್ರಕಟಿತ ಸುದ್ದಿಗಳು",
      value: stats.publishedNews,
      icon: "✓",
      link: "/admin/news",
      className: "published",
    },

    {
      title: "ಕರಡು ಸುದ್ದಿಗಳು",
      value: stats.draftNews,
      icon: "📝",
      link: "/admin/news",
      className: "draft",
    },

    {
      title: "ವಿಭಾಗಗಳು",
      value: stats.categories,
      icon: "📁",
      link: "/admin/categories",
      className: "categories",
    },

    {
      title: "ಮೀಡಿಯಾ",
      value: stats.media,
      icon: "🖼️",
      link: "/admin/media",
      className: "media",
    },

    {
      title: "ಬಳಕೆದಾರರು",
      value: stats.users,
      icon: "👥",
      link: "/admin/users",
      className: "users",
    },
  ];


  // ==================================================
  // QUICK ACTIONS
  // ==================================================

  const quickActions = [
    {
      to: "/admin/news/add",
      icon: "📰",
      title: "ಸುದ್ದಿ ಸೇರಿಸಿ",
      description: "ಹೊಸ ಸುದ್ದಿ ಪ್ರಕಟಿಸಿ",
    },

    {
      to: "/admin/news",
      icon: "📋",
      title: "ಸುದ್ದಿ ನಿರ್ವಹಣೆ",
      description: "ಸುದ್ದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ಬದಲಾಯಿಸಿ",
    },

    {
      to: "/admin/categories",
      icon: "📁",
      title: "ವಿಭಾಗಗಳು",
      description: "ಸುದ್ದಿ ವಿಭಾಗಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
    },

    {
      to: "/admin/media",
      icon: "🖼️",
      title: "ಮೀಡಿಯಾ",
      description: "ಚಿತ್ರ ಮತ್ತು ವಿಡಿಯೋ ನಿರ್ವಹಣೆ",
    },

    {
      to: "/admin/monthly-paper",
      icon: "📰",
      title: "ಮಾಸಿಕ ಪತ್ರಿಕೆ",
      description: "ಸಮರ ಧ್ವನಿ ಪತ್ರಿಕೆ ನಿರ್ವಹಿಸಿ",
    },

    {
      to: "/admin/users",
      icon: "👥",
      title: "ಬಳಕೆದಾರರು",
      description: "ಅಡ್ಮಿನ್ ಮತ್ತು ಸಿಬ್ಬಂದಿ ನಿರ್ವಹಣೆ",
    },

    {
      to: "/admin/settings",
      icon: "⚙️",
      title: "ಸೆಟ್ಟಿಂಗ್ಸ್",
      description: "ವೆಬ್‌ಸೈಟ್ ಸೆಟ್ಟಿಂಗ್ಸ್ ನಿರ್ವಹಿಸಿ",
    },
  ];


  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="admin-dashboard-page">


      {/* ==================================================
          DASHBOARD HEADER
      ================================================== */}

      <div className="admin-dashboard-header">

        <div>

          <h1>
            ಅಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್
          </h1>

          <p>
            ಸಮಾನತೆ ಧ್ವನಿ ಸುದ್ದಿ ವೆಬ್‌ಸೈಟ್
            ನಿರ್ವಹಣೆ
          </p>

        </div>


        <div className="dashboard-header-actions">

          <button
            type="button"
            className="admin-secondary-button"
            onClick={loadDashboard}
            disabled={loading}
          >
            {loading
              ? "ಲೋಡ್ ಆಗುತ್ತಿದೆ..."
              : "↻ ರಿಫ್ರೆಶ್"}
          </button>


          <Link
            to="/admin/news/add"
            className="admin-primary-button"
          >
            + ಸುದ್ದಿ ಸೇರಿಸಿ
          </Link>

        </div>

      </div>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="admin-error-message">

          <span>
            ⚠️
          </span>

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={loadDashboard}
          >
            ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ
          </button>

        </div>
      )}


      {/* ==================================================
          STATISTICS
      ================================================== */}

      <section className="dashboard-stats">

        {statCards.map((stat) => (

          <Link
            to={stat.link}
            className={`dashboard-stat-card ${stat.className}`}
            key={stat.title}
          >

            <div className="dashboard-stat-icon">
              {stat.icon}
            </div>

            <div className="dashboard-stat-content">

              <p>
                {stat.title}
              </p>

              <h2>
                {loading
                  ? "..."
                  : stat.value}
              </h2>

              <span className="dashboard-stat-link">
                ನಿರ್ವಹಿಸಿ →
              </span>

            </div>

          </Link>

        ))}

      </section>


      {/* ==================================================
          QUICK ACTIONS
      ================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>

            <h2>
              ತ್ವರಿತ ಕಾರ್ಯಗಳು
            </h2>

            <p>
              ಸಾಮಾನ್ಯವಾಗಿ ಬಳಸುವ
              ನಿರ್ವಹಣಾ ಆಯ್ಕೆಗಳು
            </p>

          </div>

        </div>


        <div className="dashboard-actions">

          {quickActions.map((action) => (

            <Link
              to={action.to}
              className="dashboard-action"
              key={action.to}
            >

              <span className="dashboard-action-icon">
                {action.icon}
              </span>

              <div>

                <strong>
                  {action.title}
                </strong>

                <small>
                  {action.description}
                </small>

              </div>

              <span className="dashboard-action-arrow">
                →
              </span>

            </Link>

          ))}

        </div>

      </section>


      {/* ==================================================
          IMPORTANT MANAGEMENT LINKS
      ================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>

            <h2>
              ಮುಖ್ಯ ನಿರ್ವಹಣೆ
            </h2>

            <p>
              ವೆಬ್‌ಸೈಟ್‌ನ ಪ್ರಮುಖ ವಿಭಾಗಗಳಿಗೆ
              ತ್ವರಿತ ಪ್ರವೇಶ
            </p>

          </div>

        </div>


        <div className="dashboard-management-grid">

          <Link
            to="/admin/monthly-paper"
            className="dashboard-management-card"
          >

            <div className="dashboard-management-icon">
              📰
            </div>

            <div>

              <strong>
                ಸಮರ ಧ್ವನಿ
              </strong>

              <span>
                ಮಾಸಿಕ ಪತ್ರಿಕೆ
              </span>

            </div>

            <b>
              →
            </b>

          </Link>


          <Link
            to="/admin/users"
            className="dashboard-management-card"
          >

            <div className="dashboard-management-icon">
              👥
            </div>

            <div>

              <strong>
                ಬಳಕೆದಾರರು
              </strong>

              <span>
                Admin / Editor / Reporter
              </span>

            </div>

            <b>
              →
            </b>

          </Link>


          <Link
            to="/admin/media"
            className="dashboard-management-card"
          >

            <div className="dashboard-management-icon">
              🖼️
            </div>

            <div>

              <strong>
                ಮೀಡಿಯಾ
              </strong>

              <span>
                ಚಿತ್ರಗಳು ಮತ್ತು ವಿಡಿಯೋಗಳು
              </span>

            </div>

            <b>
              →
            </b>

          </Link>


          <Link
            to="/admin/settings"
            className="dashboard-management-card"
          >

            <div className="dashboard-management-icon">
              ⚙️
            </div>

            <div>

              <strong>
                ಸೆಟ್ಟಿಂಗ್ಸ್
              </strong>

              <span>
                ವೆಬ್‌ಸೈಟ್ ಸೆಟ್ಟಿಂಗ್ಸ್
              </span>

            </div>

            <b>
              →
            </b>

          </Link>

        </div>

      </section>


      {/* ==================================================
          RECENT NEWS
      ================================================== */}

      <section className="dashboard-section">

        <div className="dashboard-section-header">

          <div>

            <h2>
              ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳು
            </h2>

            <p>
              ಇತ್ತೀಚೆಗೆ ಸೇರಿಸಿದ ಸುದ್ದಿಗಳ ಪಟ್ಟಿ
            </p>

          </div>


          <Link
            to="/admin/news"
            className="dashboard-view-all"
          >
            ಎಲ್ಲಾ ಸುದ್ದಿಗಳು →
          </Link>

        </div>


        <div className="admin-table-card">

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>#</th>
                  <th>ಶೀರ್ಷಿಕೆ</th>
                  <th>ವಿಭಾಗ</th>
                  <th>ದಿನಾಂಕ</th>
                  <th>ಸ್ಥಿತಿ</th>
                  <th>ಕ್ರಿಯೆ</th>
                </tr>

              </thead>


              <tbody>

                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="admin-empty"
                    >
                      ಸುದ್ದಿಗಳನ್ನು
                      ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
                    </td>

                  </tr>

                ) : recentNews.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="admin-empty"
                    >

                      <div className="dashboard-empty-state">

                        <span>
                          📰
                        </span>

                        <strong>
                          ಯಾವುದೇ ಸುದ್ದಿಗಳು ಲಭ್ಯವಿಲ್ಲ.
                        </strong>

                        <Link
                          to="/admin/news/add"
                          className="admin-primary-button"
                        >
                          + ಮೊದಲ ಸುದ್ದಿ ಸೇರಿಸಿ
                        </Link>

                      </div>

                    </td>

                  </tr>

                ) : (

                  recentNews.map(
                    (news, index) => (

                      <tr
                        key={
                          news._id ||
                          news.id
                        }
                      >

                        <td>
                          {index + 1}
                        </td>


                        <td>

                          <strong>
                            {news.title ||
                              news.titleKn ||
                              news.titleEn ||
                              "-"}
                          </strong>

                        </td>


                        <td>

                          {typeof news.category ===
                          "object"
                            ? (
                              news.category?.name ||
                              news.category?.title ||
                              "-"
                            )
                            : (
                              news.category ||
                              "-"
                            )}

                        </td>


                        <td>
                          {formatDate(
                            news.publishedAt ||
                            news.createdAt
                          )}
                        </td>


                        <td>

                          <span
                            className={
                              news.status ===
                              "Published"
                                ? "dashboard-status published"
                                : "dashboard-status draft"
                            }
                          >

                            {news.status ===
                            "Published"
                              ? "ಪ್ರಕಟಿತ"
                              : "ಕರಡು"}

                          </span>

                        </td>


                        <td>

                          <Link
                            to={
                              `/admin/news/edit/${
                                news._id ||
                                news.id
                              }`
                            }
                            className="dashboard-table-action"
                          >
                            ಸಂಪಾದಿಸಿ
                          </Link>

                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>

      </section>


      {/* ==================================================
          PUBLIC WEBSITE
      ================================================== */}

      <section className="dashboard-public-preview">

        <div>

          <span className="dashboard-public-icon">
            🌐
          </span>

          <div>

            <strong>
              ಸಾರ್ವಜನಿಕ ವೆಬ್‌ಸೈಟ್
            </strong>

            <p>
              ನಿಮ್ಮ ಸುದ್ದಿ ವೆಬ್‌ಸೈಟ್ ಅನ್ನು
              ವೀಕ್ಷಿಸಿ
            </p>

          </div>

        </div>


        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="dashboard-public-button"
        >
          ವೆಬ್‌ಸೈಟ್ ತೆರೆಯಿರಿ →
        </Link>

      </section>


    </main>
  );
}

export default Dashboard;