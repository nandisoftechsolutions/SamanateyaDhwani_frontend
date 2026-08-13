import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import NewsCard from "../../components/NewsCard";

import {
  getNewsById,
  getNewsBySlug,
  getRelatedNews,
} from "../../services/api";

import {
  useLanguage,
} from "../../context/LanguageContext";

import "./NewsDetails.css";

// ======================================================
// NEWS DETAILS PAGE
// ======================================================

function NewsDetails() {
  const { id } = useParams();

  const {
    language,
    t,
  } = useLanguage();

  // ====================================================
  // STATE
  // ====================================================

  const [news, setNews] = useState(null);

  const [relatedNews, setRelatedNews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ====================================================
  // GALLERY STATE
  // ====================================================

  const [
    selectedImageIndex,
    setSelectedImageIndex,
  ] = useState(0);

  const [
    showGalleryModal,
    setShowGalleryModal,
  ] = useState(false);

  const [
    isAutoSlidePaused,
    setIsAutoSlidePaused,
  ] = useState(false);

  // ====================================================
  // LOAD NEWS
  // ====================================================

  useEffect(() => {
    let mounted = true;

    const loadNews = async () => {
      try {
        setLoading(true);
        setError("");

        const routeValue =
          String(id || "").trim();

        if (!routeValue) {
          throw new Error(
            language === "kn"
              ? "ಸುದ್ದಿ ಲಿಂಕ್ ಲಭ್ಯವಿಲ್ಲ."
              : "News link is missing."
          );
        }

        let response;

        // ==================================================
        // IMPORTANT:
        //
        // MongoDB ObjectId:
        // 24 hexadecimal characters
        //
        // Example:
        // 68a7f9c2xxxxxxxxxxxxxxxx
        //
        // Use /api/news/:id
        //
        // Otherwise:
        // Treat route value as slug.
        //
        // Use /api/news/slug/:slug
        // ==================================================

        const isMongoObjectId =
          /^[a-fA-F0-9]{24}$/.test(
            routeValue
          );

        if (isMongoObjectId) {
          response =
            await getNewsById(
              routeValue
            );
        } else {
          response =
            await getNewsBySlug(
              decodeURIComponent(
                routeValue
              )
            );
        }

        if (!mounted) {
          return;
        }

        // ==================================================
        // RESPONSE FORMAT SUPPORT
        // ==================================================

        const article =
          response?.news ||
          response?.data ||
          response?.article ||
          response;

        if (!article) {
          throw new Error(
            language === "kn"
              ? "ಸುದ್ದಿ ಕಂಡುಬಂದಿಲ್ಲ."
              : "News article not found."
          );
        }

        setNews(article);

        // Reset gallery
        setSelectedImageIndex(0);
        setShowGalleryModal(false);

        // ==================================================
        // RELATED NEWS
        // ==================================================

        const articleId =
          article._id ||
          article.id;

        if (articleId) {
          try {
            const relatedResponse =
              await getRelatedNews(
                articleId
              );

            if (!mounted) {
              return;
            }

            setRelatedNews(
              relatedResponse?.news ||
              relatedResponse?.data ||
              []
            );
          } catch (
            relatedError
          ) {
            console.error(
              "Related news error:",
              relatedError
            );

            if (mounted) {
              setRelatedNews([]);
            }
          }
        } else {
          setRelatedNews([]);
        }
      } catch (loadError) {
        console.error(
          "News details error:",
          loadError
        );

        if (!mounted) {
          return;
        }

        setNews(null);

        setError(
          loadError?.message ||
          (
            language === "kn"
              ? "ಸುದ್ದಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
              : "Unable to load news."
          )
        );
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
  }, [id, language]);

  // ====================================================
  // DATE FORMAT
  // ====================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "";
    }

    return parsedDate.toLocaleDateString(
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

  // ====================================================
  // CATEGORY
  // ====================================================

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
      categoryMap[category] ||
      category
    );
  };

  // ====================================================
  // IMAGE LIST
  // ====================================================

  const imageUrls = useMemo(() => {
    if (!news) {
      return [];
    }

    const images = [];

    // ==================================================
    // MULTIPLE IMAGES
    // ==================================================

    if (
      Array.isArray(news.images)
    ) {
      news.images.forEach(
        (image) => {
          let url = "";

          if (
            typeof image ===
            "string"
          ) {
            url = image;
          } else if (
            image &&
            typeof image ===
              "object"
          ) {
            url =
              image.url ||
              image.secure_url ||
              image.image ||
              image.imageUrl ||
              "";
          }

          if (
            typeof url ===
              "string" &&
            url.trim()
          ) {
            images.push(
              url.trim()
            );
          }
        }
      );
    }

    // ==================================================
    // OLD SINGLE IMAGE
    // ==================================================

    if (
      news.image &&
      typeof news.image ===
        "string"
    ) {
      const mainImage =
        news.image.trim();

      if (
        mainImage &&
        !images.includes(
          mainImage
        )
      ) {
        images.unshift(
          mainImage
        );
      }
    }

    // ==================================================
    // IMAGE URL FALLBACK
    // ==================================================

    if (
      news.imageUrl &&
      typeof news.imageUrl ===
        "string"
    ) {
      const imageUrl =
        news.imageUrl.trim();

      if (
        imageUrl &&
        !images.includes(
          imageUrl
        )
      ) {
        images.unshift(
          imageUrl
        );
      }
    }

    // ==================================================
    // REMOVE DUPLICATES
    // ==================================================

    return [
      ...new Set(images),
    ];
  }, [news]);

  const hasMultipleImages =
    imageUrls.length > 1;

  // ====================================================
  // IMAGE NAVIGATION
  // ====================================================

  const handlePreviousImage =
    () => {
      if (
        imageUrls.length <= 1
      ) {
        return;
      }

      setSelectedImageIndex(
        (previous) =>
          previous <= 0
            ? imageUrls.length - 1
            : previous - 1
      );
    };

  const handleNextImage =
    () => {
      if (
        imageUrls.length <= 1
      ) {
        return;
      }

      setSelectedImageIndex(
        (previous) =>
          previous >=
          imageUrls.length - 1
            ? 0
            : previous + 1
      );
    };

  // ====================================================
  // OPEN GALLERY
  // ====================================================

  const handleImageClick = (
    index
  ) => {
    setSelectedImageIndex(
      index
    );

    setShowGalleryModal(
      true
    );
  };

  // ====================================================
  // CLOSE GALLERY
  // ====================================================

  const handleCloseGallery =
    () => {
      setShowGalleryModal(
        false
      );
    };

  // ====================================================
  // AUTOMATIC SLIDESHOW
  //
  // 5 seconds
  // ====================================================

  useEffect(() => {
    if (
      !hasMultipleImages ||
      showGalleryModal ||
      isAutoSlidePaused
    ) {
      return undefined;
    }

    const interval =
      setInterval(() => {
        setSelectedImageIndex(
          (previous) =>
            previous >=
            imageUrls.length - 1
              ? 0
              : previous + 1
        );
      }, 5000);

    return () => {
      clearInterval(
        interval
      );
    };
  }, [
    hasMultipleImages,
    imageUrls.length,
    showGalleryModal,
    isAutoSlidePaused,
  ]);

  // ====================================================
  // KEYBOARD CONTROLS
  // ====================================================

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (
          !showGalleryModal
        ) {
          return;
        }

        if (
          event.key ===
          "Escape"
        ) {
          handleCloseGallery();
        }

        if (
          event.key ===
          "ArrowLeft"
        ) {
          handlePreviousImage();
        }

        if (
          event.key ===
          "ArrowRight"
        ) {
          handleNextImage();
        }
      };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    if (
      showGalleryModal
    ) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        "";
    };
  }, [
    showGalleryModal,
    imageUrls.length,
  ]);

  // ====================================================
  // ARTICLE TITLE
  // ====================================================

  const articleTitle =
    news
      ? (
          language === "kn"
            ? news.titleKn ||
              news.title ||
              news.titleEn
            : news.titleEn ||
              news.title ||
              news.titleKn
        )
      : "";

  // ====================================================
  // ARTICLE DESCRIPTION
  // ====================================================

  const articleDescription =
    news
      ? (
          language === "kn"
            ? news.descriptionKn ||
              news.description ||
              news.descriptionEn
            : news.descriptionEn ||
              news.description ||
              news.descriptionKn
        )
      : "";

  // ====================================================
  // UPDATE BROWSER / SOCIAL META DATA
  //
  // NOTE:
  // This improves browser SEO and share metadata.
  //
  // For guaranteed WhatsApp/Facebook previews,
  // server-side OG metadata is recommended.
  // ====================================================

  useEffect(() => {
    if (!news) {
      return;
    }

    const title =
      articleTitle ||
      (
        language === "kn"
          ? "ಸಮಾನತೆ ಧ್ವನಿ"
          : "Samanateya Dhwani"
      );

    const description =
      articleDescription ||
      "";

    const canonicalUrl =
      window.location.href;

    const image =
      imageUrls[0] ||
      "";

    // ==================================================
    // DOCUMENT TITLE
    // ==================================================

    document.title =
      `${title} | ಸಮಾನತೆ ಧ್ವನಿ`;

    // ==================================================
    // HELPER
    // ==================================================

    const setMeta = (
      attribute,
      attributeValue,
      content
    ) => {
      if (!content) {
        return;
      }

      let element =
        document.head.querySelector(
          `meta[${attribute}="${attributeValue}"]`
        );

      if (!element) {
        element =
          document.createElement(
            "meta"
          );

        element.setAttribute(
          attribute,
          attributeValue
        );

        document.head.appendChild(
          element
        );
      }

      element.setAttribute(
        "content",
        content
      );
    };

    // ==================================================
    // DESCRIPTION
    // ==================================================

    setMeta(
      "name",
      "description",
      description
    );

    // ==================================================
    // OPEN GRAPH
    // ==================================================

    setMeta(
      "property",
      "og:title",
      title
    );

    setMeta(
      "property",
      "og:description",
      description
    );

    setMeta(
      "property",
      "og:url",
      canonicalUrl
    );

    setMeta(
      "property",
      "og:type",
      "article"
    );

    if (image) {
      setMeta(
        "property",
        "og:image",
        image
      );
    }

    // ==================================================
    // TWITTER
    // ==================================================

    setMeta(
      "name",
      "twitter:card",
      "summary_large_image"
    );

    setMeta(
      "name",
      "twitter:title",
      title
    );

    setMeta(
      "name",
      "twitter:description",
      description
    );

    if (image) {
      setMeta(
        "name",
        "twitter:image",
        image
      );
    }

    // ==================================================
    // CANONICAL URL
    // ==================================================

    let canonical =
      document.head.querySelector(
        'link[rel="canonical"]'
      );

    if (!canonical) {
      canonical =
        document.createElement(
          "link"
        );

      canonical.setAttribute(
        "rel",
        "canonical"
      );

      document.head.appendChild(
        canonical
      );
    }

    canonical.setAttribute(
      "href",
      canonicalUrl
    );

    // ==================================================
    // ARTICLE META
    // ==================================================

    if (
      news.publishedAt
    ) {
      setMeta(
        "property",
        "article:published_time",
        new Date(
          news.publishedAt
        ).toISOString()
      );
    }

    if (
      news.updatedAt
    ) {
      setMeta(
        "property",
        "article:modified_time",
        new Date(
          news.updatedAt
        ).toISOString()
      );
    }
  }, [
    news,
    articleTitle,
    articleDescription,
    imageUrls,
    language,
  ]);

  // ====================================================
  // SHARE URL
  //
  // Always use the actual clean article URL.
  // ====================================================

  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "";

  // ====================================================
  // SHARE WHATSAPP
  // ====================================================

  const shareOnWhatsApp =
    () => {
      if (!news) {
        return;
      }

      const text =
        `${articleTitle || ""}\n\n${
          articleDescription || ""
        }\n\n${shareUrl}`;

      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          text
        )}`,
        "_blank",
        "noopener,noreferrer"
      );
    };

  // ====================================================
  // SHARE FACEBOOK
  // ====================================================

  const shareOnFacebook =
    () => {
      if (!shareUrl) {
        return;
      }

      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}`,
        "_blank",
        "noopener,noreferrer"
      );
    };

  // ====================================================
  // COPY LINK
  // ====================================================

  const copyLink =
    async () => {
      try {
        await navigator.clipboard.writeText(
          shareUrl
        );

        alert(
          language === "kn"
            ? "ಸುದ್ದಿಯ ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ."
            : "News link copied successfully."
        );
      } catch (
        copyError
      ) {
        console.error(
          "Unable to copy link:",
          copyError
        );

        // Fallback
        try {
          const textarea =
            document.createElement(
              "textarea"
            );

          textarea.value =
            shareUrl;

          document.body.appendChild(
            textarea
          );

          textarea.select();

          document.execCommand(
            "copy"
          );

          textarea.remove();

          alert(
            language === "kn"
              ? "ಸುದ್ದಿಯ ಲಿಂಕ್ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ."
              : "News link copied successfully."
          );
        } catch (
          fallbackError
        ) {
          console.error(
            "Copy fallback failed:",
            fallbackError
          );
        }
      }
    };

  // ====================================================
  // LOADING
  // ====================================================

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

  // ====================================================
  // ERROR
  // ====================================================

  if (
    error ||
    !news
  ) {
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

              {error && (
                <p>
                  {error}
                </p>
              )}

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

  // ====================================================
  // ARTICLE DATA
  // ====================================================

  const title =
    articleTitle || "";

  const description =
    articleDescription || "";

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

  // ====================================================
  // ARTICLE CONTENT
  // ====================================================

  const articleContent =
    language === "kn"
      ? news.contentKn ||
        news.content ||
        news.contentEn ||
        ""
      : news.contentEn ||
        news.content ||
        news.contentKn ||
        "";

  const content =
    articleContent
      ? articleContent
          .split(/\n\s*\n/)
          .filter(
            (paragraph) =>
              paragraph.trim()
          )
      : [];

  // ====================================================
  // RELATED NEWS
  // ====================================================

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

  // ====================================================
  // IMAGE ERROR HANDLER
  // ====================================================

  const handleImageError =
    (event) => {
      if (
        event.currentTarget.dataset
          .fallbackApplied ===
        "true"
      ) {
        return;
      }

      event.currentTarget.dataset
        .fallbackApplied =
        "true";

      event.currentTarget.src =
        "/news-placeholder.jpg";
    };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <main className="news-details-page">

      <section className="news-details-section">

        <div className="container">

          <div className="news-details-layout">

            {/* ==========================================
                ARTICLE
            ========================================== */}

            <article className="news-article">

              {/* ========================================
                  CATEGORY
              ======================================== */}

              {category && (
                <div className="article-category">
                  {category}
                </div>
              )}

              {/* ========================================
                  TITLE
              ======================================== */}

              <h1 className="article-title">
                {title}
              </h1>

              {/* ========================================
                  DESCRIPTION
              ======================================== */}

              {description && (
                <p className="article-description">
                  {description}
                </p>
              )}

              {/* ========================================
                  META
              ======================================== */}

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

              {/* ========================================
                  IMAGE GALLERY
              ======================================== */}

              {imageUrls.length > 0 && (

                <div
                  className="article-gallery"
                  onMouseEnter={() =>
                    setIsAutoSlidePaused(
                      true
                    )
                  }
                  onMouseLeave={() =>
                    setIsAutoSlidePaused(
                      false
                    )
                  }
                >

                  {/* ==================================
                      MAIN IMAGE
                  ================================== */}

                  <div
                    className="gallery-main-image"
                    onClick={() =>
                      handleImageClick(
                        selectedImageIndex
                      )
                    }
                  >

                    <img
                      src={
                        imageUrls[
                          selectedImageIndex
                        ]
                      }
                      alt={`${title} - ${
                        selectedImageIndex + 1
                      }`}
                      onError={
                        handleImageError
                      }
                    />

                    {/* ==================================
                        IMAGE COUNTER
                    ================================== */}

                    {hasMultipleImages && (
                      <div className="gallery-image-count">

                        <span>
                          {selectedImageIndex + 1}
                          {" / "}
                          {imageUrls.length}
                        </span>

                        <span className="gallery-click-hint">
                          {language === "kn"
                            ? "ಸ್ವಯಂಚಾಲಿತ ಸ್ಲೈಡ್ • ವೀಕ್ಷಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ"
                            : "Auto slideshow • Click to view"}
                        </span>

                      </div>
                    )}

                    {/* ==================================
                        PREVIOUS ARROW
                    ================================== */}

                    {hasMultipleImages && (
                      <button
                        type="button"
                        className="gallery-main-arrow gallery-main-arrow-prev"
                        onClick={(event) => {
                          event.stopPropagation();
                          handlePreviousImage();
                        }}
                        aria-label={
                          language === "kn"
                            ? "ಹಿಂದಿನ ಚಿತ್ರ"
                            : "Previous image"
                        }
                      >
                        ‹
                      </button>
                    )}

                    {/* ==================================
                        NEXT ARROW
                    ================================== */}

                    {hasMultipleImages && (
                      <button
                        type="button"
                        className="gallery-main-arrow gallery-main-arrow-next"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleNextImage();
                        }}
                        aria-label={
                          language === "kn"
                            ? "ಮುಂದಿನ ಚಿತ್ರ"
                            : "Next image"
                        }
                      >
                        ›
                      </button>
                    )}

                  </div>

                  {/* ==================================
                      DOTS
                  ================================== */}

                  {hasMultipleImages && (

                    <div
                      className="gallery-slide-dots"
                      aria-label={
                        language === "kn"
                          ? "ಚಿತ್ರ ಆಯ್ಕೆ"
                          : "Image selector"
                      }
                    >

                      {imageUrls.map(
                        (_, index) => (

                          <button
                            type="button"
                            key={index}
                            className={
                              `gallery-slide-dot ${
                                index ===
                                selectedImageIndex
                                  ? "active"
                                  : ""
                              }`
                            }
                            onClick={() =>
                              setSelectedImageIndex(
                                index
                              )
                            }
                            aria-label={
                              language === "kn"
                                ? `ಚಿತ್ರ ${index + 1}`
                                : `Image ${index + 1}`
                            }
                          />

                        )
                      )}

                    </div>
                  )}

                  {/* ==================================
                      THUMBNAILS
                  ================================== */}

                  {hasMultipleImages && (

                    <div className="gallery-thumbnails">

                      {imageUrls.map(
                        (
                          url,
                          index
                        ) => (

                          <button
                            type="button"
                            key={index}
                            className={
                              `gallery-thumbnail ${
                                index ===
                                selectedImageIndex
                                  ? "active"
                                  : ""
                              }`
                            }
                            onClick={() =>
                              setSelectedImageIndex(
                                index
                              )
                            }
                            aria-label={
                              language === "kn"
                                ? `ಚಿತ್ರ ${index + 1} ಆಯ್ಕೆಮಾಡಿ`
                                : `Select image ${index + 1}`
                            }
                          >

                            <img
                              src={url}
                              alt={`${title} - ${
                                index + 1
                              }`}
                              onError={
                                handleImageError
                              }
                            />

                          </button>

                        )
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* ========================================
                  ARTICLE CONTENT
              ======================================== */}

              <div className="article-content">

                {content.map(
                  (
                    paragraph,
                    index
                  ) => (

                    <p
                      key={index}
                    >
                      {paragraph}
                    </p>

                  )
                )}

              </div>

              {/* ========================================
                  SHARE
              ======================================== */}

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

            {/* ==========================================
                SIDEBAR
            ========================================== */}

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
                    (item) => (

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
                    {language === "kn"
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

      {/* ================================================
          FULL SCREEN GALLERY MODAL
      ================================================ */}

      {showGalleryModal &&
        imageUrls.length > 0 && (

          <div
            className="gallery-modal"
            onClick={
              handleCloseGallery
            }
          >

            <div
              className="gallery-modal-content"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* ==================================
                  CLOSE
              ================================== */}

              <button
                type="button"
                className="gallery-modal-close"
                onClick={
                  handleCloseGallery
                }
                aria-label={
                  language === "kn"
                    ? "ಗ್ಯಾಲರಿ ಮುಚ್ಚಿ"
                    : "Close gallery"
                }
              >
                ×
              </button>

              {/* ==================================
                  COUNTER
              ================================== */}

              <div className="gallery-modal-counter">

                {selectedImageIndex + 1}
                {" / "}
                {imageUrls.length}

              </div>

              {/* ==================================
                  IMAGE
              ================================== */}

              <div className="gallery-modal-image">

                <img
                  src={
                    imageUrls[
                      selectedImageIndex
                    ]
                  }
                  alt={`${title} - ${
                    selectedImageIndex + 1
                  }`}
                  onError={
                    handleImageError
                  }
                />

              </div>

              {/* ==================================
                  PREVIOUS
              ================================== */}

              {hasMultipleImages && (

                <button
                  type="button"
                  className="gallery-modal-nav prev"
                  onClick={
                    handlePreviousImage
                  }
                  aria-label={
                    language === "kn"
                      ? "ಹಿಂದಿನ ಚಿತ್ರ"
                      : "Previous image"
                  }
                >
                  ‹
                </button>

              )}

              {/* ==================================
                  NEXT
              ================================== */}

              {hasMultipleImages && (

                <button
                  type="button"
                  className="gallery-modal-nav next"
                  onClick={
                    handleNextImage
                  }
                  aria-label={
                    language === "kn"
                      ? "ಮುಂದಿನ ಚಿತ್ರ"
                      : "Next image"
                  }
                >
                  ›
                </button>

              )}

              {/* ==================================
                  MODAL THUMBNAILS
              ================================== */}

              {hasMultipleImages && (

                <div className="gallery-modal-thumbnails">

                  {imageUrls.map(
                    (
                      url,
                      index
                    ) => (

                      <button
                        type="button"
                        key={index}
                        className={
                          `gallery-modal-thumbnail ${
                            index ===
                            selectedImageIndex
                              ? "active"
                              : ""
                          }`
                        }
                        onClick={() =>
                          setSelectedImageIndex(
                            index
                          )
                        }
                        aria-label={
                          language === "kn"
                            ? `ಚಿತ್ರ ${index + 1}`
                            : `Image ${index + 1}`
                        }
                      >

                        <img
                          src={url}
                          alt={`Thumbnail ${
                            index + 1
                          }`}
                          onError={
                            handleImageError
                          }
                        />

                      </button>

                    )
                  )}

                </div>
              )}

            </div>

          </div>
        )}

    </main>
  );
}

export default NewsDetails;