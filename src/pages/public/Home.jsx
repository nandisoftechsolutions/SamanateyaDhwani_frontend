import React, {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import BreakingNews from "../../components/BreakingNews";
import NewsCard from "../../components/NewsCard";

import {
  getPublishedNews,
  getFeaturedNews,
} from "../../services/api";

import {
  useLanguage,
} from "../../context/LanguageContext";

import "./Home.css";


function Home() {

  const {
    language,
    t,
  } = useLanguage();


  // ==================================================
  // STATE
  // ==================================================

  const [featuredNews, setFeaturedNews] =
    useState(null);

  const [latestNews, setLatestNews] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==================================================
  // LOAD HOME NEWS
  // ==================================================

  useEffect(() => {

    let mounted = true;


    const loadHomeNews = async () => {

      try {

        setLoading(true);
        setError("");


        // ==========================================
        // FEATURED NEWS
        // ==========================================

        const featuredResponse =
          await getFeaturedNews();


        if (!mounted) {
          return;
        }


        const featured =
          featuredResponse?.news ||
          featuredResponse?.data ||
          null;


        setFeaturedNews(
          Array.isArray(featured)
            ? featured[0] || null
            : featured
        );


        // ==========================================
        // LATEST PUBLISHED NEWS
        // ==========================================

        const latestResponse =
          await getPublishedNews({
            page: 1,
            limit: 5,
          });


        if (!mounted) {
          return;
        }


        const latest =
          latestResponse?.news ||
          latestResponse?.data ||
          [];


        setLatestNews(
          Array.isArray(latest)
            ? latest
            : []
        );

      } catch (error) {

        console.error(
          "Home news loading error:",
          error
        );


        if (mounted) {

          setError(
            error?.message ||
            (
              language === "kn"
                ? "ಸುದ್ದಿಗಳನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
                : "Unable to load news."
            )
          );


          setFeaturedNews(null);

          setLatestNews([]);
        }

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }

    };


    loadHomeNews();


    return () => {
      mounted = false;
    };

  }, [language]);


  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (date) => {

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
  // CATEGORY NAME
  // ==================================================

  const getCategoryName = (
    category
  ) => {

    if (!category) {
      return "";
    }


    const categoryMap = {

      ಕರ್ನಾಟಕ:
        t.karnataka,

      ಭಾರತ:
        t.india,

      ವಿಶ್ವ:
        t.world,

      ರಾಜಕೀಯ:
        t.politics,

      ಅಪರಾಧ:
        t.crime,

      ಕ್ರೀಡೆ:
        t.sports,

      ಸಿನಿಮಾ:
        t.cinema,

      ವ್ಯಾಪಾರ:
        t.business,

      ಶಿಕ್ಷಣ:
        t.education,

    };


    return (
      categoryMap[category] ||
      category
    );

  };


  // ==================================================
  // GET NEWS TITLE
  // ==================================================

  const getNewsTitle = (
    news
  ) => {

    if (!news) {
      return "";
    }


    // ================================================
    // KANNADA
    // ================================================

    if (
      language === "kn"
    ) {

      return (
        news.title ||
        news.titleKn ||
        news.headline ||
        ""
      );

    }


    // ================================================
    // ENGLISH
    // ================================================

    return (
      news.translatedTitleEn ||
      news.titleEn ||
      news.englishTitle ||
      news.title ||
      ""
    );

  };


  // ==================================================
  // GET NEWS DESCRIPTION
  // ==================================================

  const getNewsDescription = (
    news
  ) => {

    if (!news) {
      return "";
    }


    // ================================================
    // KANNADA
    // ================================================

    if (
      language === "kn"
    ) {

      return (
        news.description ||
        news.summary ||
        ""
      );

    }


    // ================================================
    // ENGLISH
    // ================================================

    return (
      news.translatedDescriptionEn ||
      news.descriptionEn ||
      news.englishDescription ||
      news.description ||
      news.summary ||
      ""
    );

  };


  // ==================================================
  // GET NEWS ID
  // ==================================================

  const getNewsId = (
    news
  ) => {

    return (
      news?.slug ||
      news?._id ||
      news?.id ||
      ""
    );

  };


  // ==================================================
  // GET NEWS IMAGE
  // ==================================================

  const getNewsImage = (
    news
  ) => {

    return (
      news?.image ||
      news?.imageUrl ||
      "/images/news-placeholder.jpg"
    );

  };


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <main className="home-page">


      {/* ==================================================
          BREAKING NEWS
      ================================================== */}

      <BreakingNews />


      {/* ==================================================
          FEATURED NEWS
      ================================================== */}

      <section className="home-section">

        <div className="container">


          {/* ============================================
              SECTION HEADING
          ============================================ */}

          <div className="section-heading">

            <h2>
              {t.mainNews}
            </h2>

            <span></span>

          </div>


          {/* ============================================
              LOADING
          ============================================ */}

          {loading && (

            <div className="home-message">

              <p>

                {language === "kn"
                  ? "ಸುದ್ದಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
                  : "Loading news..."}

              </p>

            </div>

          )}


          {/* ============================================
              ERROR
          ============================================ */}

          {!loading &&
            error && (

              <div
                className="home-message home-error"
              >

                <p>
                  {error}
                </p>

              </div>

            )}


          {/* ============================================
              FEATURED NEWS
          ============================================ */}

          {!loading &&
            !error &&
            featuredNews && (

              <article
                className="featured-news"
              >


                {/* ======================================
                    FEATURED IMAGE
                    EXACT 16 : 9
                ====================================== */}

                <Link
                  to={`/news/${getNewsId(
                    featuredNews
                  )}`}
                  className="featured-news-image-link"
                >

                  <div
                    className="featured-news-image-wrapper"
                  >

                    <img
                      src={getNewsImage(
                        featuredNews
                      )}
                      alt={getNewsTitle(
                        featuredNews
                      )}
                      className="featured-news-image"
                      loading="eager"
                      onError={(event) => {

                        event.currentTarget.src =
                          "/images/news-placeholder.jpg";

                      }}
                    />

                  </div>

                </Link>


                {/* ======================================
                    FEATURED CONTENT
                ====================================== */}

                <div
                  className="featured-news-content"
                >


                  {/* ==================================
                      CATEGORY
                  ================================== */}

                  <span
                    className="featured-news-category"
                  >

                    {getCategoryName(
                      featuredNews.category
                    )}

                  </span>


                  {/* ==================================
                      TITLE
                  ================================== */}

                  <h1>

                    <Link
                      to={`/news/${getNewsId(
                        featuredNews
                      )}`}
                    >

                      {getNewsTitle(
                        featuredNews
                      )}

                    </Link>

                  </h1>


                  {/* ==================================
                      DESCRIPTION
                  ================================== */}

                  <p>

                    {getNewsDescription(
                      featuredNews
                    )}

                  </p>


                  {/* ==================================
                      DATE
                  ================================== */}

                  <div
                    className="featured-news-date"
                  >

                    {formatDate(
                      featuredNews.publishedAt ||
                      featuredNews.createdAt
                    )}

                  </div>


                  {/* ==================================
                      READ MORE
                  ================================== */}

                  <Link
                    to={`/news/${getNewsId(
                      featuredNews
                    )}`}
                    className="read-more-button"
                  >

                    {t.readMore}

                  </Link>

                </div>

              </article>

            )}


          {/* ============================================
              NO FEATURED NEWS
          ============================================ */}

          {!loading &&
            !error &&
            !featuredNews && (

              <div
                className="home-message"
              >

                <p>

                  {language === "kn"
                    ? "ಮುಖ್ಯ ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ."
                    : "No featured news available."}

                </p>

              </div>

            )}

        </div>

      </section>


      {/* ==================================================
          LATEST NEWS
      ================================================== */}

      <section
        className="home-section latest-news-section"
      >

        <div className="container">


          {/* ============================================
              SECTION HEADING
          ============================================ */}

          <div className="section-heading">

            <h2>
              {t.latestNewsTitle}
            </h2>

            <span></span>

          </div>


          {/* ============================================
              LATEST NEWS GRID
          ============================================ */}

          {!loading &&
            !error &&
            latestNews.length > 0 && (

              <div
                className="latest-news-grid"
              >

                {latestNews.map(
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

                        title:
                          getNewsTitle(
                            news
                          ),

                        description:
                          getNewsDescription(
                            news
                          ),

                        date:
                          formatDate(
                            news.publishedAt ||
                            news.createdAt
                          ),

                        category:
                          getCategoryName(
                            news.category
                          ),

                      }}
                    />

                  )
                )}

              </div>

            )}


          {/* ============================================
              NO LATEST NEWS
          ============================================ */}

          {!loading &&
            !error &&
            latestNews.length === 0 && (

              <div
                className="home-message"
              >

                <p>

                  {language === "kn"
                    ? "ಇತ್ತೀಚಿನ ಪ್ರಕಟಿತ ಸುದ್ದಿಗಳು ಲಭ್ಯವಿಲ್ಲ."
                    : "No latest news available."}

                </p>

              </div>

            )}


          {/* ============================================
              VIEW ALL
          ============================================ */}

          <div
            className="home-view-all"
          >

            <Link
              to="/news"
              className="read-more-button"
            >

              {t.viewAllNews}

            </Link>

          </div>

        </div>

      </section>


      {/* ==================================================
          VIDEO SECTION
      ================================================== */}

      <section
        className="home-section video-section"
      >

        <div className="container">


          {/* ============================================
              SECTION HEADING
          ============================================ */}

          <div className="section-heading">

            <h2>
              {t.videoNews}
            </h2>

            <span></span>

          </div>


          {/* ============================================
              VIDEO PLACEHOLDER
          ============================================ */}

          <div
            className="video-placeholder"
          >

            <div
              className="video-icon"
            >
              ▶
            </div>


            <h3>
              {t.videosComingSoon}
            </h3>


            <p>

              {language === "kn"
                ? "ಪ್ರಮುಖ ಸುದ್ದಿಗಳ ವಿಡಿಯೋಗಳನ್ನು ಇಲ್ಲಿ ವೀಕ್ಷಿಸಬಹುದು."
                : "You can watch videos of important news stories here."}

            </p>


            <Link
              to="/videos"
              className="read-more-button"
            >

              {t.watchAllVideos}

            </Link>

          </div>

        </div>

      </section>


    </main>

  );

}


export default Home;