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

  const [newsList, setNewsList] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==================================================
  // CATEGORIES
  //
  // These keys NEVER change.
  // Translation is only for display.
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
  // LOAD NEWS
  // ==================================================

  useEffect(() => {
    const loadNews =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getPublishedNews({
              category:
                selectedCategory ===
                "all"
                  ? undefined
                  : selectedCategory,

              page: 1,

              limit: 50,
            });

          setNewsList(
            response.news || []
          );
        } catch (error) {
          console.error(
            "News loading error:",
            error
          );

          setError(
            error.message ||
              "ಸುದ್ದಿಗಳನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
          );

          setNewsList([]);
        } finally {
          setLoading(false);
        }
      };

    loadNews();
  }, [
    selectedCategory,
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
  };

  // ==================================================
  // CATEGORY DISPLAY NAME
  // ==================================================

  const getCategoryName = (
    category
  ) => {
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
        category
      ] || category
    );
  };

  // ==================================================
  // PREPARE NEWS FOR NEWS CARD
  // ==================================================

  const preparedNews =
    newsList.map(
      (news) => ({
        ...news,

        id:
          news._id ||
          news.id,

        category:
          getCategoryName(
            news.category
          ),

        date:
          formatDate(
            news.publishedAt ||
              news.createdAt
          ),
      })
    );

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

          <div className="news-filters">

            {categories.map(
              (category) => (
                <button
                  type="button"
                  key={
                    category.key
                  }
                  className={
                    selectedCategory ===
                    category.key
                      ? "news-filter active"
                      : "news-filter"
                  }
                  onClick={() =>
                    setSelectedCategory(
                      category.key
                    )
                  }
                >
                  {
                    category.name
                  }
                </button>
              )
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
            <div className="no-news">

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
              <div className="no-news">

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
                  (news) => (
                    <NewsCard
                      key={
                        news.id
                      }
                      news={
                        news
                      }
                    />
                  )
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