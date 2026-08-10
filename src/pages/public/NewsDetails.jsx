import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import NewsCard from "../../components/NewsCard";

import {
  getNewsBySlug,
  getNewsById,
  getRelatedNews,
} from "../../services/api";

import {
  useLanguage,
} from "../../context/LanguageContext";

import "./NewsDetails.css";

function NewsDetails() {
  const { id } = useParams();

  const {
    language,
    t,
  } = useLanguage();

  // ==================================================
  // STATE
  // ==================================================

  const [news, setNews] =
    useState(null);

  const [relatedNews, setRelatedNews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==================================================
  // LOAD NEWS
  // ==================================================

  useEffect(() => {
    const loadNews =
      async () => {
        try {
          setLoading(true);
          setError("");

          let response;

          /*
            Try slug first.

            If your URL is:

            /news/my-news-slug

            backend:
            /api/news/slug/my-news-slug
          */

          try {
            response =
              await getNewsBySlug(id);
          } catch {
            /*
              Fallback for MongoDB ObjectId URL:

              /news/68xxxxxxxxxxxx
            */

            response =
              await getNewsById(id);
          }

          const article =
            response.news ||
            response.data ||
            null;

          if (!article) {
            throw new Error(
              language === "kn"
                ? "ಸುದ್ದಿ ಕಂಡುಬಂದಿಲ್ಲ."
                : "News article not found."
            );
          }

          setNews(article);

          // ==========================================
          // LOAD RELATED NEWS
          // ==========================================

          if (article._id) {
            try {
              const relatedResponse =
                await getRelatedNews(
                  article._id
                );

              setRelatedNews(
                relatedResponse.news ||
                  []
              );
            } catch (
              relatedError
            ) {
              console.error(
                "Related news error:",
                relatedError
              );

              setRelatedNews([]);
            }
          }
        } catch (error) {
          console.error(
            "News details error:",
            error
          );

          setError(
            error.message ||
              (
                language === "kn"
                  ? "ಸುದ್ದಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
                  : "Unable to load news."
              )
          );

          setNews(null);
        } finally {
          setLoading(false);
        }
      };

    loadNews();
  }, [
    id,
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
  // CATEGORY NAME
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
  // SHARE - WHATSAPP
  // ==================================================

  const shareOnWhatsApp =
    () => {
      const url =
        window.location.href;

      const shareText =
        `${news?.title || ""} ${url}`;

      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          shareText
        )}`,
        "_blank",
        "noopener,noreferrer"
      );
    };

  // ==================================================
  // SHARE - FACEBOOK
  // ==================================================

  const shareOnFacebook =
    () => {
      const url =
        window.location.href;

      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        "_blank",
        "noopener,noreferrer"
      );
    };

  // ==================================================
  // COPY LINK
  // ==================================================

  const copyLink =
    async () => {
      try {
        await navigator.clipboard.writeText(
          window.location.href
        );

        alert(
          language === "kn"
            ? "ಸುದ್ದಿಯ ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ."
            : "News link copied successfully."
        );
      } catch (error) {
        console.error(
          "Unable to copy link:",
          error
        );
      }
    };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <main className="news-details-page">

        <section className="news-details-section">

          <div className="container">

            <div className="news-details-message">

              <h2>
                {language === "kn"
                  ? "ಸುದ್ದಿಯನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
                  : "Loading news..."}
              </h2>

            </div>

          </div>

        </section>

      </main>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error || !news) {
    return (
      <main className="news-details-page">

        <section className="news-details-section">

          <div className="container">

            <div className="news-details-message">

              <h2>
                {language === "kn"
                  ? "ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ"
                  : "News not available"}
              </h2>

              <p>
                {error}
              </p>

              <Link
                to="/news"
                className="all-news-button"
              >
                {t.viewAllNews}
              </Link>

            </div>

          </div>

        </section>

      </main>
    );
  }

  // ==================================================
  // ARTICLE DATA
  // ==================================================

  const title =
    news.title || "";

  const description =
    news.description || "";

  const category =
    getCategoryName(
      news.category
    );

  const date =
    formatDate(
      news.publishedAt ||
        news.createdAt
    );

  const author =
    news.author ||
    "ಸಮಾನತೆ ಧ್ವನಿ";

  const image =
    news.image || "";

  /*
    Backend currently stores content
    as one String.

    Split paragraphs using blank lines.
  */

  const content =
    news.content
      ? news.content
          .split(/\n\s*\n/)
          .filter(
            (paragraph) =>
              paragraph.trim()
          )
      : [];

  // ==================================================
  // PREPARE RELATED NEWS
  // ==================================================

  const preparedRelatedNews =
    relatedNews.map(
      (item) => ({
        ...item,

        id:
          item._id ||
          item.id,

        category:
          getCategoryName(
            item.category
          ),

        date:
          formatDate(
            item.publishedAt ||
              item.createdAt
          ),
      })
    );

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="news-details-page">

      <section className="news-details-section">

        <div className="container">

          <div className="news-details-layout">

            {/* ====================================
                MAIN ARTICLE
            ==================================== */}

            <article className="news-article">

              {/* CATEGORY */}

              <div className="article-category">
                {category}
              </div>

              {/* TITLE */}

              <h1 className="article-title">
                {title}
              </h1>

              {/* DESCRIPTION */}

              {description && (
                <p className="article-description">
                  {description}
                </p>
              )}

              {/* META */}

              <div className="article-meta">

                <span>
                  {t.published}:{" "}
                  {date}
                </span>

                <span>
                  {t.reportedBy}:{" "}
                  {author}
                </span>

              </div>

              {/* IMAGE */}

              {image && (
                <div className="article-image">

                  <img
                    src={image}
                    alt={title}
                  />

                </div>
              )}

              {/* CONTENT */}

              <div className="article-content">

                {content.map(
                  (
                    paragraph,
                    index
                  ) => (
                    <p
                      key={
                        index
                      }
                    >
                      {
                        paragraph
                      }
                    </p>
                  )
                )}

              </div>

              {/* SHARE */}

              <div className="article-share">

                <span className="share-title">
                  {t.share}:
                </span>

                <button
                  type="button"
                  onClick={
                    shareOnFacebook
                  }
                  className="share-button facebook"
                >
                  Facebook
                </button>

                <button
                  type="button"
                  onClick={
                    shareOnWhatsApp
                  }
                  className="share-button whatsapp"
                >
                  WhatsApp
                </button>

                <button
                  type="button"
                  onClick={
                    copyLink
                  }
                  className="share-button copy"
                >
                  {t.copyLink}
                </button>

              </div>

            </article>

            {/* ====================================
                SIDEBAR
            ==================================== */}

            <aside className="news-sidebar">

              <div className="sidebar-title">

                <h2>
                  {t.relatedNews}
                </h2>

              </div>

              <div className="related-news-list">

                {preparedRelatedNews.length >
                0 ? (
                  preparedRelatedNews.map(
                    (
                      item
                    ) => (
                      <NewsCard
                        key={
                          item.id
                        }
                        news={
                          item
                        }
                      />
                    )
                  )
                ) : (
                  <p>
                    {language ===
                    "kn"
                      ? "ಸಂಬಂಧಿತ ಸುದ್ದಿಗಳು ಲಭ್ಯವಿಲ್ಲ."
                      : "No related news available."}
                  </p>
                )}

              </div>

              <Link
                to="/news"
                className="all-news-button"
              >
                {t.viewAllNews}
              </Link>

            </aside>

          </div>

        </div>

      </section>

    </main>
  );
}

export default NewsDetails;