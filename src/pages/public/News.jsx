import React, {
  useEffect,
  useState,
} from "react";

import {
  useLanguage,
} from "../../context/LanguageContext";

import NewsCard from "../../components/NewsCard";

import {
  getPublishedNews,
} from "../../services/api";

import "./News.css";

function News() {
  const {
    t,
    language,
  } = useLanguage();

  // ==================================================
  // SELECTED CATEGORY
  // ==================================================

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("all");

  // ==================================================
  // NEWS
  // ==================================================

  const [
    newsList,
    setNewsList,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  // ==================================================
  // CATEGORIES
  //
  // IMPORTANT:
  // These keys must match the backend database values.
  // Translation is used only for display.
  // ==================================================

  const categories = [
    {
      key: "all",
      name: t.all,
    },
    {
      key: "karnataka",
      name: t.karnataka,
    },
    {
      key: "india",
      name: t.india,
    },
    {
      key: "world",
      name: t.world,
    },
    {
      key: "politics",
      name: t.politics,
    },
    {
      key: "crime",
      name: t.crime,
    },
    {
      key: "sports",
      name: t.sports,
    },
    {
      key: "cinema",
      name: t.cinema,
    },
    {
      key: "business",
      name: t.business,
    },
    {
      key: "education",
      name: t.education,
    },
  ];

  // ==================================================
  // LOAD PUBLISHED NEWS
  // ==================================================

  useEffect(() => {
    let mounted = true;

    const loadNews = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page: 1,
          limit: 50,
        };

        // Do not send category when "all" is selected.
        if (
          selectedCategory !== "all"
        ) {
          params.category =
            selectedCategory;
        }

        const response =
          await getPublishedNews(
            params
          );

        if (!mounted) {
          return;
        }

        const news =
          response?.news ||
          response?.data ||
          [];

        setNewsList(
          Array.isArray(news)
            ? news
            : []
        );
      } catch (error) {
        console.error(
          "News loading error:",
          error
        );

        if (!mounted) {
          return;
        }

        setError(
          error?.message ||
            (
              language === "kn"
                ? "ಸುದ್ದಿಗಳನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
                : "Unable to load news."
            )
        );

        setNewsList([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadNews();

    return () => {
      mounted = false;
    };
  }, [
    selectedCategory,
    language,
  ]);

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        language === "kn"
          ? "kn-IN"
          : "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    } catch {
      return "";
    }
  };

  // ==================================================
  // CATEGORY DISPLAY NAME
  // ==================================================

  const getCategoryName = (
    category
  ) => {
    if (!category) {
      return "";
    }

    const categoryMap = {
      karnataka:
        t.karnataka,

      india:
        t.india,

      world:
        t.world,

      politics:
        t.politics,

      crime:
        t.crime,

      sports:
        t.sports,

      cinema:
        t.cinema,

      business:
        t.business,

      education:
        t.education,
    };

    return (
      categoryMap[
        String(category)
          .trim()
          .toLowerCase()
      ] ||
      category
    );
  };

  // ==================================================
  // PREPARE NEWS FOR NEWS CARD
  //
  // IMPORTANT:
  // Keep the complete original news object.
  //
  // This preserves:
  // - _id
  // - id
  // - slug
  // - title
  // - description
  // - image
  // - images
  // - category
  // - publishedAt
  // - createdAt
  // - featured
  // - breakingNews
  //
  // NewsCard can therefore use:
  //
  // news.slug
  //
  // for the SEO-friendly URL.
  // ==================================================

  const preparedNews =
    newsList.map(
      (news) => {
        const newsId =
          news?._id ||
          news?.id;

        return {
          ...news,

          // Keep both IDs for compatibility.
          id: newsId,

          // Keep slug untouched.
          // Backend generates this automatically.
          slug:
            news?.slug || "",

          category:
            getCategoryName(
              news?.category
            ),

          date:
            formatDate(
              news?.publishedAt ||
                news?.createdAt
            ),
        };
      }
    );

  // ==================================================
  // HANDLE CATEGORY CHANGE
  // ==================================================

  const handleCategoryChange = (
    categoryKey
  ) => {
    if (
      categoryKey ===
      selectedCategory
    ) {
      return;
    }

    setSelectedCategory(
      categoryKey
    );
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="news-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <section className="page-header">

        <div className="container">

          <h1>
            {t.latestNews}
          </h1>

          <p>
            {t.allNewsDescription}
          </p>

        </div>

      </section>

      {/* =================================
          CATEGORY FILTER
      ================================= */}

      <section className="news-filter-section">

        <div className="container">

          <div
            className="news-filters"
            role="tablist"
            aria-label={
              language === "kn"
                ? "ಸುದ್ದಿ ವರ್ಗಗಳು"
                : "News categories"
            }
          >

            {categories.map(
              (category) => {

                const isActive =
                  selectedCategory ===
                  category.key;

                return (
                  <button
                    type="button"
                    key={
                      category.key
                    }
                    className={
                      isActive
                        ? "news-filter active"
                        : "news-filter"
                    }
                    onClick={() =>
                      handleCategoryChange(
                        category.key
                      )
                    }
                    aria-pressed={
                      isActive
                    }
                  >
                    {
                      category.name
                    }
                  </button>
                );
              }
            )}

          </div>

        </div>

      </section>

      {/* =================================
          NEWS LIST
      ================================= */}

      <section className="news-list-section">

        <div className="container">

          {/* =================================
              LOADING
          ================================= */}

          {loading && (
            <div
              className="no-news"
              role="status"
              aria-live="polite"
            >

              <h3>
                {language === "kn"
                  ? "ಸುದ್ದಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
                  : "Loading news..."}
              </h3>

            </div>
          )}

          {/* =================================
              ERROR
          ================================= */}

          {!loading &&
            error && (
              <div
                className="no-news"
                role="alert"
              >

                <h3>
                  {language === "kn"
                    ? "ಸುದ್ದಿಗಳನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
                    : "Unable to load news."}
                </h3>

                <p>
                  {error}
                </p>

              </div>
            )}

          {/* =================================
              NEWS GRID
          ================================= */}

          {!loading &&
            !error &&
            preparedNews.length >
              0 && (
              <div className="news-grid">

                {preparedNews.map(
                  (news) => {

                    const newsKey =
                      news?.slug ||
                      news?._id ||
                      news?.id;

                    return (
                      <NewsCard
                        key={
                          newsKey
                        }
                        news={
                          news
                        }
                      />
                    );
                  }
                )}

              </div>
            )}

          {/* =================================
              NO NEWS
          ================================= */}

          {!loading &&
            !error &&
            preparedNews.length ===
              0 && (
              <div className="no-news">

                <h3>
                  {t.noNews}
                </h3>

                <p>
                  {
                    t.noNewsDescription
                  }
                </p>

              </div>
            )}

        </div>

      </section>

    </main>
  );
}

export default News;