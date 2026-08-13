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
    news.id ||
    "";

  // =====================================================
  // NEWS SLUG
  //
  // IMPORTANT:
  //
  // Prefer the backend-generated slug.
  //
  // Example:
  //
  // /news/arjun-lamani-apology-to-journalists
  //
  // instead of:
  //
  // /news/68a7f9c2xxxxxxxx
  //
  // Existing articles without a slug will
  // automatically fall back to the ID.
  // =====================================================

  const newsSlug =
    typeof news.slug === "string"
      ? news.slug.trim()
      : "";

  // =====================================================
  // NEWS URL
  //
  // Slug is preferred.
  // ID is used only as fallback.
  // =====================================================

  const newsUrl =
    newsSlug
      ? `/news/${encodeURIComponent(
          newsSlug
        )}`
      : newsId
      ? `/news/${encodeURIComponent(
          newsId
        )}`
      : "/news";

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
  //
  // Main image is preferred.
  //
  // For multiple-image news, the first/main image
  // remains the card image.
  // =====================================================

  const image =
    news.image ||
    news.imageUrl ||
    (
      Array.isArray(news.images) &&
      news.images.length > 0
        ? (
            typeof news.images[0] ===
            "string"
              ? news.images[0]
              : news.images[0]?.url
          )
        : ""
    ) ||
    "/news-placeholder.jpg";

  // =====================================================
  // CATEGORY URL
  // =====================================================

  const categorySlug =
    news.categorySlug ||
    (
      typeof news.category ===
      "string"
        ? news.category
            .trim()
            .toLowerCase()
            .replace(
              /\s+/g,
              "-"
            )
        : ""
    );

  const categoryUrl =
    categorySlug
      ? `/category/${encodeURIComponent(
          categorySlug
        )}`
      : "/news";

  // =====================================================
  // IMAGE ERROR HANDLER
  // =====================================================

  const handleImageError = (
    event
  ) => {
    if (
      event.currentTarget.src.includes(
        "news-placeholder.jpg"
      )
    ) {
      return;
    }

    event.currentTarget.src =
      "/news-placeholder.jpg";
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <article className="news-card">

      {/* =================================================
          NEWS IMAGE
      ================================================= */}

      <Link
        to={newsUrl}
        className="news-card-image-link"
        aria-label={title}
      >

        <div className="news-card-image-wrapper">

          <img
            src={image}
            alt={title}
            className="news-card-image"
            loading="lazy"
            onError={
              handleImageError
            }
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
            to={categoryUrl}
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
            to={newsUrl}
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