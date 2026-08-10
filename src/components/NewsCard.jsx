import React from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";

import "./NewsCard.css";

function NewsCard({ news }) {
  const { language } = useLanguage();

  // =====================================================
  // SAFETY CHECK
  // =====================================================

  if (!news) {
    return null;
  }

  // =====================================================
  // NEWS ID
  // Supports MongoDB _id and normal id
  // =====================================================

  const newsId =
    news._id ||
    news.id;

  // =====================================================
  // LANGUAGE CONTENT
  // =====================================================

  const title =
    language === "kn"
      ? news.titleKn ||
        news.title ||
        "ಸುದ್ದಿ"
      : news.titleEn ||
        news.title ||
        "News";

  const description =
    language === "kn"
      ? news.descriptionKn ||
        news.description ||
        ""
      : news.descriptionEn ||
        news.description ||
        "";

  const category =
    language === "kn"
      ? news.categoryKn ||
        news.category ||
        ""
      : news.categoryEn ||
        news.category ||
        "";

  const date =
    language === "kn"
      ? news.dateKn ||
        news.date ||
        ""
      : news.dateEn ||
        news.date ||
        "";

  // =====================================================
  // IMAGE
  // =====================================================

  const image =
    news.image ||
    news.imageUrl ||
    "/news-placeholder.jpg";

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <article className="news-card">

      {/* =================================================
          NEWS IMAGE
      ================================================= */}

      <Link
        to={`/news/${newsId}`}
        className="news-card-image-link"
        aria-label={title}
      >

        <div className="news-card-image-wrapper">

          <img
            src={image}
            alt={title}
            className="news-card-image"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src =
                "/news-placeholder.jpg";
            }}
          />

        </div>

      </Link>


      {/* =================================================
          NEWS CONTENT
      ================================================= */}

      <div className="news-card-content">

        {/* ===============================================
            CATEGORY
        =============================================== */}

        {category && (
          <Link
            to={`/category/${
              news.categorySlug ||
              news.category?.toLowerCase()
            }`}
            className="news-card-category"
          >
            {category}
          </Link>
        )}


        {/* ===============================================
            TITLE
        =============================================== */}

        <h3 className="news-card-title">

          <Link
            to={`/news/${newsId}`}
          >
            {title}
          </Link>

        </h3>


        {/* ===============================================
            DESCRIPTION
        =============================================== */}

        {description && (
          <p className="news-card-description">
            {description}
          </p>
        )}


        {/* ===============================================
            DATE
        =============================================== */}

        {date && (
          <div className="news-card-date">
            {date}
          </div>
        )}

      </div>

    </article>
  );
}

export default NewsCard;