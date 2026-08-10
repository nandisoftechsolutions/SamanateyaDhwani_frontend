import React, {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import {
  getPublishedNews,
} from "../../services/api";

import { useLanguage } from "../../context/LanguageContext";

import NewsCard from "../../components/NewsCard";

import "./Category.css";

function Category() {
  const { slug } = useParams();

  const {
    t,
    language,
  } = useLanguage();

  // ==================================================
  // CATEGORY NAMES
  // ==================================================

  const categoryNames = {
    karnataka: t.karnataka,
    india: t.india,
    world: t.world,
    politics: t.politics,
    crime: t.crime,
    sports: t.sports,
    cinema: t.cinema,
    business: t.business,
    education: t.education,
  };

  const categoryName =
    categoryNames[slug] ||
    t.news;

  // ==================================================
  // STATE
  // ==================================================

  const [newsList, setNewsList] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==================================================
  // LOAD CATEGORY NEWS
  // ==================================================

  useEffect(() => {
    const loadNews =
      async () => {
        try {
          setLoading(true);
          setError("");

          /*
            Backend category is currently
            stored using the category name.

            Example:

            /api/news/published?category=ಕರ್ನಾಟಕ
          */

          const response =
            await getPublishedNews({
              category:
                categoryName,
              page: 1,
              limit: 12,
            });

          setNewsList(
            response.news || []
          );
        } catch (error) {
          console.error(
            "Category news error:",
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

    if (categoryName) {
      loadNews();
    }
  }, [
    slug,
    categoryName,
  ]);

  // ==================================================
  // PAGE DESCRIPTION
  // ==================================================

  const categoryDescription =
    language === "kn"
      ? `${categoryName} ವಿಭಾಗದ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು ಮತ್ತು ಬೆಳವಣಿಗೆಗಳು.`
      : `Latest news and developments from ${categoryName}.`;

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="category-page">

      {/* =================================
          CATEGORY HEADER
      ================================= */}

      <section className="category-header">

        <div className="container">

          <div className="category-title">

            <h1>
              {categoryName}
            </h1>

            <span></span>

          </div>

          <p>
            {categoryDescription}
          </p>

        </div>

      </section>

      {/* =================================
          CATEGORY NEWS
      ================================= */}

      <section className="category-news">

        <div className="container">

          {/* =================================
              LOADING
          ================================= */}

          {loading && (
            <div className="category-message">

              <p>
                {language === "kn"
                  ? "ಸುದ್ದಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
                  : "Loading news..."}
              </p>

            </div>
          )}

          {/* =================================
              ERROR
          ================================= */}

          {!loading &&
            error && (
              <div className="category-message category-error">

                <p>
                  {error}
                </p>

              </div>
            )}

          {/* =================================
              NO NEWS
          ================================= */}

          {!loading &&
            !error &&
            newsList.length ===
              0 && (
              <div className="category-message">

                <p>
                  {language === "kn"
                    ? `${categoryName} ವಿಭಾಗದಲ್ಲಿ ಯಾವುದೇ ಪ್ರಕಟಿತ ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ.`
                    : `No published news available in ${categoryName}.`}
                </p>

              </div>
            )}

          {/* =================================
              NEWS GRID
          ================================= */}

          {!loading &&
            !error &&
            newsList.length >
              0 && (
              <div className="category-news-grid">

                {newsList.map(
                  (news) => (
                    <NewsCard
                      key={
                        news._id ||
                        news.id
                      }
                      news={{
                        ...news,

                        id:
                          news._id ||
                          news.id,

                        date:
                          news.publishedAt ||
                          news.createdAt,
                      }}
                    />
                  )
                )}

              </div>
            )}

        </div>

      </section>

    </main>
  );
}

export default Category;