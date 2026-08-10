import React, {
  useEffect,
  useState,
} from "react";

import {
  getMedia,
  uploadMedia,
  deleteMedia,
} from "../../services/api";

import "./MediaManage.css";

function MediaManage() {
  // ==================================================
  // STATE
  // ==================================================

  const [media, setMedia] =
    useState([]);

  const [selectedType, setSelectedType] =
    useState("All");

  const [showForm, setShowForm] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [mediaName, setMediaName] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ==================================================
  // LOAD MEDIA
  // ==================================================

  const loadMedia = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getMedia();

      setMedia(
        response.media || []
      );
    } catch (error) {
      console.error(
        "Get media error:",
        error
      );

      setError(
        error.message ||
          "ಮೀಡಿಯಾ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // LOAD MEDIA ON PAGE OPEN
  // ==================================================

  useEffect(() => {
    loadMedia();
  }, []);

  // ==================================================
  // HANDLE FILE CHANGE
  // ==================================================

  const handleFileChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    setSelectedFile(
      file || null
    );

    setError("");
    setSuccess("");

    // Automatically use filename
    // as media title if title is empty
    if (
      file &&
      !mediaName.trim()
    ) {
      const fileName =
        file.name.replace(
          /\.[^/.]+$/,
          ""
        );

      setMediaName(fileName);
    }
  };

  // ==================================================
  // HANDLE UPLOAD
  // ==================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedFile) {
      setError(
        "ದಯವಿಟ್ಟು ಒಂದು ಚಿತ್ರ ಅಥವಾ ವಿಡಿಯೋ ಆಯ್ಕೆಮಾಡಿ."
      );
      return;
    }

    try {
      setUploading(true);

      // ==============================================
      // CREATE FORM DATA
      // ==============================================

      const formData =
        new FormData();

      formData.append(
        "file",
        selectedFile
      );

      // ==============================================
      // UPLOAD TO CLOUDINARY
      // ==============================================

      const response =
        await uploadMedia(
          formData
        );

      console.log(
        "Media uploaded:",
        response
      );

      setSuccess(
        "ಮೀಡಿಯಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ."
      );

      // ==============================================
      // REFRESH MEDIA
      // ==============================================

      await loadMedia();

      // ==============================================
      // RESET
      // ==============================================

      resetForm();
    } catch (error) {
      console.error(
        "Media upload error:",
        error
      );

      setError(
        error.message ||
          "ಮೀಡಿಯಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    } finally {
      setUploading(false);
    }
  };

  // ==================================================
  // DELETE MEDIA
  // ==================================================

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "ಈ ಮೀಡಿಯಾವನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteMedia(id);

      setSuccess(
        "ಮೀಡಿಯಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ."
      );

      await loadMedia();
    } catch (error) {
      console.error(
        "Delete media error:",
        error
      );

      setError(
        error.message ||
          "ಮೀಡಿಯಾವನ್ನು ಅಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    }
  };

  // ==================================================
  // RESET FORM
  // ==================================================

  const resetForm = () => {
    setSelectedFile(null);
    setMediaName("");
    setShowForm(false);

    // Reset file input
    const fileInput =
      document.getElementById(
        "mediaFile"
      );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ==================================================
  // FILTER MEDIA
  // ==================================================

  const filteredMedia =
    selectedType === "All"
      ? media
      : media.filter(
          (item) =>
            item.resourceType ===
            selectedType.toLowerCase()
        );

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "-";
    }

    return new Date(
      date
    ).toLocaleDateString(
      "kn-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="media-manage-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="admin-page-header">

        <div>
          <h1>
            ಮೀಡಿಯಾ ನಿರ್ವಹಣೆ
          </h1>

          <p>
            ಚಿತ್ರ ಮತ್ತು ವಿಡಿಯೋಗಳನ್ನು
            ಇಲ್ಲಿ ನಿರ್ವಹಿಸಿ.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() => {
            setShowForm(true);
            setError("");
            setSuccess("");
          }}
        >
          + ಮೀಡಿಯಾ ಸೇರಿಸಿ
        </button>

      </div>

      {/* ==================================================
          SUCCESS
      ================================================== */}

      {success && (
        <div className="admin-success-message">
          {success}
        </div>
      )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {/* ==================================================
          UPLOAD FORM
      ================================================== */}

      {showForm && (
        <section className="admin-form-card">

          <div className="admin-form-header">

            <div>
              <h2>
                ಹೊಸ ಮೀಡಿಯಾ ಸೇರಿಸಿ
              </h2>

              <p>
                ಚಿತ್ರ ಅಥವಾ ವಿಡಿಯೋ
                Cloudinaryಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.
              </p>
            </div>

            <button
              type="button"
              className="admin-close-button"
              onClick={resetForm}
              disabled={uploading}
            >
              ×
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
          >

            {/* ============================================
                MEDIA NAME
            ============================================ */}

            <div className="admin-form-group">

              <label htmlFor="mediaName">
                ಮೀಡಿಯಾ ಹೆಸರು
              </label>

              <input
                type="text"
                id="mediaName"
                value={mediaName}
                onChange={(event) =>
                  setMediaName(
                    event.target.value
                  )
                }
                placeholder="ಉದಾ: ವಿಜಯಪುರ ಸುದ್ದಿ"
                disabled={uploading}
              />

            </div>

            {/* ============================================
                FILE
            ============================================ */}

            <div className="admin-form-group">

              <label htmlFor="mediaFile">
                ಚಿತ್ರ / ವಿಡಿಯೋ
              </label>

              <input
                type="file"
                id="mediaFile"
                name="file"
                accept="image/*,video/*"
                onChange={
                  handleFileChange
                }
                disabled={uploading}
                required
              />

              <small>
                JPG, PNG, WEBP ಅಥವಾ
                MP4 ಮುಂತಾದ ಫೈಲ್‌ಗಳನ್ನು
                ಆಯ್ಕೆಮಾಡಬಹುದು.
              </small>

            </div>

            {/* ============================================
                SELECTED FILE
            ============================================ */}

            {selectedFile && (
              <div className="media-selected-file">

                <strong>
                  ಆಯ್ಕೆ ಮಾಡಿದ ಫೈಲ್:
                </strong>

                <span>
                  {
                    selectedFile.name
                  }
                </span>

                <small>
                  {(
                    selectedFile.size /
                    (1024 * 1024)
                  ).toFixed(2)}{" "}
                  MB
                </small>

              </div>
            )}

            {/* ============================================
                ACTIONS
            ============================================ */}

            <div className="admin-form-actions">

              <button
                type="submit"
                className="admin-primary-button"
                disabled={uploading}
              >
                {uploading
                  ? "ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ..."
                  : "ಮೀಡಿಯಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ"}
              </button>

              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
                disabled={uploading}
              >
                ರದ್ದುಪಡಿಸಿ
              </button>

            </div>

          </form>

        </section>
      )}

      {/* ==================================================
          FILTER
      ================================================== */}

      <section className="media-filter">

        <button
          type="button"
          className={
            selectedType ===
            "All"
              ? "media-filter-button active"
              : "media-filter-button"
          }
          onClick={() =>
            setSelectedType(
              "All"
            )
          }
        >
          ಎಲ್ಲಾ
        </button>

        <button
          type="button"
          className={
            selectedType ===
            "Image"
              ? "media-filter-button active"
              : "media-filter-button"
          }
          onClick={() =>
            setSelectedType(
              "Image"
            )
          }
        >
          ಚಿತ್ರಗಳು
        </button>

        <button
          type="button"
          className={
            selectedType ===
            "Video"
              ? "media-filter-button active"
              : "media-filter-button"
          }
          onClick={() =>
            setSelectedType(
              "Video"
            )
          }
        >
          ವಿಡಿಯೋಗಳು
        </button>

      </section>

      {/* ==================================================
          MEDIA LIST
      ================================================== */}

      <section className="media-table-card">

        <div className="admin-table-header">

          <div>
            <h2>
              ಎಲ್ಲಾ ಮೀಡಿಯಾ
            </h2>

            <p>
              ಒಟ್ಟು{" "}
              {
                filteredMedia.length
              }{" "}
              ಮೀಡಿಯಾ
            </p>
          </div>

        </div>

        <div className="admin-table-wrapper">

          <table className="admin-table">

            <thead>

              <tr>
                <th>#</th>
                <th>Preview</th>
                <th>ಹೆಸರು</th>
                <th>ಪ್ರಕಾರ</th>
                <th>ದಿನಾಂಕ</th>
                <th>ಕ್ರಿಯೆಗಳು</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (
                <tr>

                  <td
                    colSpan="6"
                    className="admin-empty"
                  >
                    ಮೀಡಿಯಾವನ್ನು
                    ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
                  </td>

                </tr>
              ) : filteredMedia.length ===
                0 ? (
                <tr>

                  <td
                    colSpan="6"
                    className="admin-empty"
                  >
                    ಯಾವುದೇ ಮೀಡಿಯಾ
                    ಲಭ್ಯವಿಲ್ಲ.
                  </td>

                </tr>
              ) : (
                filteredMedia.map(
                  (
                    item,
                    index
                  ) => {

                    const isImage =
                      item.resourceType ===
                      "image";

                    const isVideo =
                      item.resourceType ===
                      "video";

                    return (
                      <tr
                        key={
                          item._id
                        }
                      >

                        {/* Number */}

                        <td>
                          {index + 1}
                        </td>

                        {/* Preview */}

                        <td>

                          {isImage ? (
                            <img
                              src={
                                item.url
                              }
                              alt={
                                item.title ||
                                item.originalName ||
                                "Media"
                              }
                              className="media-preview"
                            />
                          ) : isVideo ? (
                            <video
                              src={
                                item.url
                              }
                              className="media-preview"
                              controls
                              preload="metadata"
                            />
                          ) : (
                            <div className="media-video-preview">
                              📁
                            </div>
                          )}

                        </td>

                        {/* Name */}

                        <td>

                          <strong>
                            {
                              item.title ||
                              item.originalName ||
                              item.fileName
                            }
                          </strong>

                        </td>

                        {/* Type */}

                        <td>

                          <span className="media-type">

                            {isImage
                              ? "ಚಿತ್ರ"
                              : isVideo
                              ? "ವಿಡಿಯೋ"
                              : item.resourceType}

                          </span>

                        </td>

                        {/* Date */}

                        <td>
                          {formatDate(
                            item.createdAt
                          )}
                        </td>

                        {/* Actions */}

                        <td>

                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() =>
                              handleDelete(
                                item._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}

export default MediaManage;