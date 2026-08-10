import React, {
  useEffect,
  useState,
} from "react";

import { useLanguage } from "../context/LanguageContext";
import { getPublishedNews } from "../services/api";

import "./BreakingNews.css";

function BreakingNews() {
  const {
    t,
    language,
  } = useLanguage();

  // =====================================================
  // STATE
  // =====================================================

  const [breakingNews, setBreakingNews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =====================================================
  // FETCH BREAKING NEWS
  // =====================================================

  useEffect(() => {
    let isMounted = true;

    const fetchBreakingNews =
      async () => {
        try {
          setLoading(true);

          // =================================================
          // USE PUBLIC API
          // IMPORTANT:
          //
          // getPublishedNews()
          // calls:
          // GET /api/news/published
          //
          // This does NOT require admin authentication.
          // =================================================

          const result =
            await getPublishedNews();

          console.log(
            "Published News Response:",
            result
          );

          // =================================================
          // SUPPORT DIFFERENT API RESPONSE FORMATS
          // =================================================

          let allNews = [];

          if (Array.isArray(result)) {
            allNews = result;
          } else if (
            Array.isArray(result?.news)
          ) {
            allNews = result.news;
          } else if (
            Array.isArray(result?.data)
          ) {
            allNews = result.data;
          } else if (
            Array.isArray(
              result?.news?.data
            )
          ) {
            allNews =
              result.news.data;
          }

          console.log(
            "All Published News:",
            allNews
          );

          // =================================================
          // FILTER ONLY BREAKING NEWS
          // =================================================

          const filteredNews =
            allNews.filter(
              (news) => {
                return (
                  news?.breakingNews ===
                    true ||
                  news?.breakingNews ===
                    "true" ||
                  news?.breakingNews ===
                    1 ||
                  news?.breakingNews ===
                    "1"
                );
              }
            );

          console.log(
            "Breaking News:",
            filteredNews
          );

          if (isMounted) {
            setBreakingNews(
              filteredNews
            );
          }

        } catch (error) {
          console.error(
            "Breaking News Error:",
            error
          );

          if (isMounted) {
            setBreakingNews([]);
          }

        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

    fetchBreakingNews();

    // =====================================================
    // REFRESH EVERY 60 SECONDS
    // =====================================================

    const refreshInterval =
      setInterval(
        fetchBreakingNews,
        60000
      );

    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {
      isMounted = false;

      clearInterval(
        refreshInterval
      );
    };
  }, []);

  // =====================================================
  // GET NEWS TITLE
  // =====================================================

  const getNewsTitle = (
    news
  ) => {
    if (!news) {
      return "";
    }

    // =====================================================
    // KANNADA
    //
    // Admin enters Kannada only.
    // =====================================================

    if (
      language === "kn" ||
      language === "kannada"
    ) {
      return (
        news.title ||
        news.titleKn ||
        news.headline ||
        "ಸುದ್ದಿ"
      );
    }

    // =====================================================
    // ENGLISH
    //
    // If your backend later provides an automatic
    // English translation, these fields will be used.
    //
    // For now, Kannada title is used as fallback.
    // =====================================================

    return (
      news.translatedTitleEn ||
      news.titleEn ||
      news.englishTitle ||
      news.titleEnglish ||
      news.title ||
      news.titleKn ||
      news.headline ||
      "News"
    );
  };

  // =====================================================
  // OPEN NEWS
  // =====================================================

  const handleNewsClick = (
    news
  ) => {
    if (!news) {
      return;
    }

    // =====================================================
    // PREFER SLUG
    // =====================================================

    if (news.slug) {
      window.location.href =
        `/news/${news.slug}`;

      return;
    }

    // =====================================================
    // FALLBACK TO ID
    // =====================================================

    const id =
      news._id ||
      news.id;

    if (!id) {
      return;
    }

    window.location.href =
      `/news/${id}`;
  };

  // =====================================================
  // DON'T SHOW EMPTY BREAKING NEWS BAR
  // =====================================================

  if (
    !loading &&
    breakingNews.length === 0
  ) {
    return null;
  }

  // =====================================================
  // BREAKING NEWS LABEL
  // =====================================================

  const breakingLabel =
    t?.breakingNews ||
    (
      language === "kn" ||
      language === "kannada"
        ? "ತಾಜಾ ಸುದ್ದಿ"
        : "BREAKING NEWS"
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <section
      className="breaking-news-section"
      aria-label={
        breakingLabel
      }
    >

      <div className="breaking-news-container">

        {/* =============================================
            BREAKING NEWS LABEL
        ============================================= */}

        <div className="breaking-label">

          <span
            className="breaking-icon"
            aria-hidden="true"
          >
            ●
          </span>

          <span className="breaking-label-text">
            {breakingLabel}
          </span>

        </div>


        {/* =============================================
            NEWS TICKER
        ============================================= */}

        <div
          className="breaking-news-list"
          aria-live="polite"
        >

          {/* ===========================================
              LOADING
          =========================================== */}

          {loading ? (

            <span className="breaking-news-loading">
              {language === "kn" ||
              language === "kannada"
                ? "ಸುದ್ದಿ ಲೋಡ್ ಆಗುತ್ತಿದೆ..."
                : "Loading breaking news..."}
            </span>

          ) : (

            <div className="breaking-news-viewport">

              <div
                className={`breaking-news-track ${
                  breakingNews.length === 1
                    ? "single-news"
                    : "multiple-news"
                }`}
              >

                {/* =========================================
                    FIRST SET
                ========================================= */}

                {breakingNews.map(
                  (news, index) => (

                    <button
                      type="button"
                      key={
                        news._id ||
                        news.id ||
                        `breaking-news-${index}`
                      }
                      className="breaking-news-item"
                      onClick={() =>
                        handleNewsClick(news)
                      }
                    >

                      <span
                        className="breaking-news-dot"
                        aria-hidden="true"
                      >
                        ●
                      </span>

                      <span className="breaking-news-title">
                        {getNewsTitle(news)}
                      </span>

                    </button>

                  )
                )}


                {/* =========================================
                    DUPLICATE SET

                    Used for seamless horizontal scrolling.
                    Even one breaking news item is duplicated
                    so the ticker continues moving.
                ========================================= */}

                {breakingNews.map(
                  (news, index) => (

                    <button
                      type="button"
                      key={
                        `duplicate-${
                          news._id ||
                          news.id ||
                          index
                        }`
                      }
                      className="breaking-news-item"
                      onClick={() =>
                        handleNewsClick(news)
                      }
                      tabIndex={-1}
                      aria-hidden="true"
                    >

                      <span
                        className="breaking-news-dot"
                        aria-hidden="true"
                      >
                        ●
                      </span>

                      <span className="breaking-news-title">
                        {getNewsTitle(news)}
                      </span>

                    </button>

                  )
                )}

              </div>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}

export default BreakingNews;