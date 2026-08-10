import React, {
  useEffect,
  useState,
} from "react";

import {
  getMedia,
} from "../../services/api";

import {
  useLanguage,
} from "../../context/LanguageContext";

import "./Gallery.css";

function Gallery() {
  const {
    t,
    language,
  } = useLanguage();

  // ==================================================
  // STATE
  // ==================================================

  const [galleryImages, setGalleryImages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==================================================
  // LOAD GALLERY
  // ==================================================

  useEffect(() => {
    const loadGallery =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getMedia();

          const media =
            response.media || [];

          // Only images for gallery
          const images =
            media.filter(
              (item) =>
                item.type ===
                "image"
            );

          setGalleryImages(
            images
          );
        } catch (error) {
          console.error(
            "Gallery loading error:",
            error
          );

          setError(
            error.message ||
              "ಗ್ಯಾಲರಿ ಚಿತ್ರಗಳನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
          );

          setGalleryImages([]);
        } finally {
          setLoading(false);
        }
      };

    loadGallery();
  }, []);

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="gallery-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <section className="page-header">

        <div className="container">

          <h1>
            {t.photoGallery}
          </h1>

          <p>
            {t.galleryDescription}
          </p>

        </div>

      </section>

      {/* =================================
          GALLERY
      ================================= */}

      <section className="gallery-section">

        <div className="container">

          {/* =================================
              LOADING
          ================================= */}

          {loading && (
            <div className="gallery-message">

              <p>
                {language === "kn"
                  ? "ಚಿತ್ರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
                  : "Loading gallery..."}
              </p>

            </div>
          )}

          {/* =================================
              ERROR
          ================================= */}

          {!loading &&
            error && (
              <div className="gallery-message gallery-error">

                <p>
                  {error}
                </p>

              </div>
            )}

          {/* =================================
              EMPTY
          ================================= */}

          {!loading &&
            !error &&
            galleryImages.length ===
              0 && (
              <div className="gallery-message">

                <p>
                  {language === "kn"
                    ? "ಯಾವುದೇ ಚಿತ್ರಗಳು ಲಭ್ಯವಿಲ್ಲ."
                    : "No gallery images available."}
                </p>

              </div>
            )}

          {/* =================================
              GALLERY GRID
          ================================= */}

          {!loading &&
            !error &&
            galleryImages.length >
              0 && (
              <div className="gallery-grid">

                {galleryImages.map(
                  (item) => {

                    const imageId =
                      item._id ||
                      item.id;

                    const imageUrl =
                      item.url;

                    const title =
                      item.originalName ||
                      (language ===
                      "kn"
                        ? "ಸಮಾನತೆ ಧ್ವನಿ"
                        : "Samanateya Dhwani");

                    return (
                      <div
                        className="gallery-card"
                        key={
                          imageId
                        }
                      >

                        <div className="gallery-image-wrapper">

                          <img
                            src={
                              imageUrl
                            }
                            alt={
                              title
                            }
                            className="gallery-image"
                            loading="lazy"
                          />

                        </div>

                        <div className="gallery-title">

                          {title}

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

        </div>

      </section>

    </main>
  );
}

export default Gallery;