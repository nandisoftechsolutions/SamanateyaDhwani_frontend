import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getVideoMedia } from "../../services/api";

import { useLanguage } from "../../context/LanguageContext";

import "./Videos.css";

function Videos() {
  const { language } = useLanguage();

  // ======================================================
  // STATE
  // ======================================================

  const [videos, setVideos] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ======================================================
  // LOAD VIDEOS FROM BACKEND
  // ======================================================

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getVideoMedia();

        console.log("Video API Response:", response);

        /*
          Your backend may return:

          {
            success: true,
            media: [...]
          }

          or

          {
            success: true,
            data: [...]
          }

          This handles both.
        */

        const videoData =
          response?.media ||
          response?.data ||
          [];

        if (Array.isArray(videoData)) {
          setVideos(videoData);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error(
          "Failed to load videos:",
          err
        );

        setError(
          err.message ||
            (
              language === "kn"
                ? "ವಿಡಿಯೋಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
                : "Unable to load videos."
            )
        );

        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [language]);

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    try {
      return new Date(date).toLocaleDateString(
        language === "kn"
          ? "kn-IN"
          : "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    } catch (error) {
      return "";
    }
  };

  // ======================================================
  // GET VIDEO TITLE
  // ======================================================

  const getVideoTitle = (video) => {
    if (video.title) {
      return video.title;
    }

    if (video.name) {
      return video.name;
    }

    if (video.originalName) {
      return video.originalName;
    }

    return language === "kn"
      ? "ಸಮಾನತೆ ಧ್ವನಿ ವಿಡಿಯೋ ಸುದ್ದಿ"
      : "Samanateya Dhwani Video News";
  };

  // ======================================================
  // GET VIDEO DESCRIPTION
  // ======================================================

  const getVideoDescription = (video) => {
    if (video.description) {
      return video.description;
    }

    return language === "kn"
      ? "ಸಮಾನತೆ ಧ್ವನಿಯ ಪ್ರಮುಖ ವಿಡಿಯೋ ಸುದ್ದಿ."
      : "Latest video news from Samanateya Dhwani.";
  };

  // ======================================================
  // GET VIDEO URL
  // ======================================================

  const getVideoUrl = (video) => {
    return (
      video.url ||
      video.secure_url ||
      video.videoUrl ||
      ""
    );
  };

  // ======================================================
  // GET VIDEO ID
  // ======================================================

  const getVideoId = (video, index) => {
    return (
      video._id ||
      video.id ||
      video.publicId ||
      `video-${index}`
    );
  };

  // ======================================================
  // FEATURED VIDEO
  // ======================================================

  const featuredVideo =
    videos.length > 0
      ? videos[0]
      : null;

  // ======================================================
  // RECENT VIDEOS
  // ======================================================

  const recentVideos =
    videos.length > 1
      ? videos.slice(1)
      : [];

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <main className="videos-page">

      {/* ============================================
          PAGE HEADER
      ============================================ */}

      <section className="page-header">

        <div className="container">

          <h1>
            ವಿಡಿಯೋ ಸುದ್ದಿ
          </h1>

          <p>
            ಸಮಾನತೆ ಧ್ವನಿಯ ಪ್ರಮುಖ ಸುದ್ದಿಗಳ
            ವಿಡಿಯೋ ವರದಿಗಳು
          </p>

        </div>

      </section>

      {/* ============================================
          LOADING
      ============================================ */}

      {loading && (
        <section className="video-list-section">

          <div className="container">

            <div className="video-empty">

              <div className="video-loading-icon">
                ▶
              </div>

              <h3>
                ವಿಡಿಯೋಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
              </h3>

              <p>
                Please wait...
              </p>

            </div>

          </div>

        </section>
      )}

      {/* ============================================
          ERROR
      ============================================ */}

      {!loading && error && (
        <section className="video-list-section">

          <div className="container">

            <div className="video-empty">

              <div className="video-error-icon">
                !
              </div>

              <h3>
                ವಿಡಿಯೋಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ
              </h3>

              <p>
                {error}
              </p>

              <button
                type="button"
                className="read-more-button"
                onClick={() =>
                  window.location.reload()
                }
              >
                ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ
              </button>

            </div>

          </div>

        </section>
      )}

      {/* ============================================
          FEATURED VIDEO
      ============================================ */}

      {!loading &&
        !error &&
        featuredVideo && (
          <section className="featured-video-section">

            <div className="container">

              {/* Section Heading */}

              <div className="section-heading">

                <h2>
                  ಮುಖ್ಯ ವಿಡಿಯೋ
                </h2>

                <span></span>

              </div>

              {/* Featured Video */}

              <article className="featured-video">

                {/* Video */}

                <div className="featured-video-image">

                  <video
                    src={getVideoUrl(
                      featuredVideo
                    )}
                    controls
                    preload="metadata"
                    playsInline
                  />

                </div>

                {/* Content */}

                <div className="featured-video-content">

                  <span className="video-category">
                    ವಿಡಿಯೋ ಸುದ್ದಿ
                  </span>

                  <h2>
                    {getVideoTitle(
                      featuredVideo
                    )}
                  </h2>

                  <p>
                    {getVideoDescription(
                      featuredVideo
                    )}
                  </p>

                  <span className="video-date">

                    {formatDate(
                      featuredVideo.createdAt ||
                        featuredVideo.created_at ||
                        featuredVideo.date
                    )}

                  </span>

                </div>

              </article>

            </div>

          </section>
        )}

      {/* ============================================
          RECENT VIDEOS
      ============================================ */}

      {!loading &&
        !error &&
        recentVideos.length > 0 && (
          <section className="video-list-section">

            <div className="container">

              {/* Section Heading */}

              <div className="section-heading">

                <h2>
                  ಇತ್ತೀಚಿನ ವಿಡಿಯೋಗಳು
                </h2>

                <span></span>

              </div>

              {/* Video Grid */}

              <div className="video-grid">

                {recentVideos.map(
                  (video, index) => {

                    const videoUrl =
                      getVideoUrl(video);

                    return (
                      <article
                        className="video-card"
                        key={getVideoId(
                          video,
                          index
                        )}
                      >

                        {/* Video */}

                        <div className="video-card-image">

                          {videoUrl ? (
                            <video
                              src={videoUrl}
                              controls
                              preload="metadata"
                              playsInline
                            />
                          ) : (
                            <div className="video-no-source">
                              <span>
                                ▶
                              </span>

                              <p>
                                Video unavailable
                              </p>
                            </div>
                          )}

                        </div>

                        {/* Content */}

                        <div className="video-card-content">

                          <span className="video-category">
                            ವಿಡಿಯೋ ಸುದ್ದಿ
                          </span>

                          <h3>
                            {getVideoTitle(
                              video
                            )}
                          </h3>

                          <p>
                            {getVideoDescription(
                              video
                            )}
                          </p>

                          <span className="video-date">

                            {formatDate(
                              video.createdAt ||
                                video.created_at ||
                                video.date
                            )}

                          </span>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

            </div>

          </section>
        )}

      {/* ============================================
          NO VIDEOS
      ============================================ */}

      {!loading &&
        !error &&
        videos.length === 0 && (
          <section className="video-list-section">

            <div className="container">

              <div className="video-empty">

                <div className="video-empty-icon">
                  ▶
                </div>

                <h3>
                  ಯಾವುದೇ ವಿಡಿಯೋಗಳು ಲಭ್ಯವಿಲ್ಲ
                </h3>

                <p>
                  ಅಡ್ಮಿನ್ ಪ್ಯಾನೆಲ್‌ನಿಂದ ವಿಡಿಯೋ
                  ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ನಂತರ ಇಲ್ಲಿ
                  ವಿಡಿಯೋಗಳು ಕಾಣಿಸುತ್ತವೆ.
                </p>

              </div>

            </div>

          </section>
        )}

      {/* ============================================
          YOUTUBE CHANNEL
      ============================================ */}

      <section className="video-channel-section">

        <div className="container">

          <div className="video-channel-box">

            <h2>
              ನಮ್ಮ ವಿಡಿಯೋಗಳನ್ನು ವೀಕ್ಷಿಸಿ
            </h2>

            <p>
              ಸಮಾನತೆ ಧ್ವನಿಯ ಇನ್ನಷ್ಟು ವಿಡಿಯೋ
              ಸುದ್ದಿಗಳಿಗಾಗಿ ನಮ್ಮ YouTube
              ಚಾನೆಲ್‌ ಅನ್ನು ಅನುಸರಿಸಿ.
            </p>

            <Link
              to="#"
              className="youtube-button"
            >
              YouTube ಚಾನೆಲ್
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Videos;