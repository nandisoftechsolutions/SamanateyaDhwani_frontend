import React, {
  useEffect,
  useState,
} from "react";

import {
  getSettings,
  updateSettings,
  uploadMedia,
} from "../../services/api";

import "./Settings.css";

function Settings() {
  // ==================================================
  // SETTINGS
  // ==================================================

  const [settings, setSettings] =
    useState({
      siteName: "ಸಮಾನತೆ ಧ್ವನಿ",
      tagline:
        "ನಿಮ್ಮ ಧ್ವನಿ - ನಮ್ಮ ಜವಾಬ್ದಾರಿ",
      email: "",
      phone: "",
      address:
        "ವಿಜಯಪುರ, ಕರ್ನಾಟಕ, ಭಾರತ",
      youtube: "",
      facebook: "",
      instagram: "",
    });

  // ==================================================
  // LOGO
  // ==================================================

  const [logo, setLogo] =
    useState(null);

  const [logoPreview, setLogoPreview] =
    useState("");

  const [currentLogoPublicId, setCurrentLogoPublicId] =
    useState("");

  // ==================================================
  // UI
  // ==================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // ==================================================
  // LOAD SETTINGS
  // ==================================================

  useEffect(() => {
    const loadSettings =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getSettings();

          const data =
            response.settings ||
            response.data ||
            {};

          setSettings(
            (previous) => ({
              ...previous,
              ...data,
            })
          );

          // Existing logo
          if (data.logo) {
            setLogoPreview(
              data.logo
            );
          }

          if (
            data.logoPublicId
          ) {
            setCurrentLogoPublicId(
              data.logoPublicId
            );
          }
        } catch (error) {
          console.error(
            "Get settings error:",
            error
          );

          setError(
            error.message ||
              "ಸೆಟ್ಟಿಂಗ್ಸ್ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
          );
        } finally {
          setLoading(false);
        }
      };

    loadSettings();
  }, []);

  // ==================================================
  // HANDLE CHANGE
  // ==================================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setSettings(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setMessage("");
    setError("");
  };

  // ==================================================
  // HANDLE LOGO
  // ==================================================

  const handleLogoChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // Validate image
    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setError(
        "ದಯವಿಟ್ಟು image file ಮಾತ್ರ ಆಯ್ಕೆಮಾಡಿ."
      );

      event.target.value = "";
      return;
    }

    // 5 MB limit
    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "ಲೋಗೋದ ಗಾತ್ರ 5MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು."
      );

      event.target.value = "";
      return;
    }

    setLogo(file);

    if (logoPreview) {
      URL.revokeObjectURL(
        logoPreview
      );
    }

    const preview =
      URL.createObjectURL(file);

    setLogoPreview(preview);

    setMessage("");
    setError("");
  };

  // ==================================================
  // SAVE SETTINGS
  // ==================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      setSaving(true);

      let logoUrl =
        settings.logo || "";

      let logoPublicId =
        currentLogoPublicId || "";

      // ==============================================
      // UPLOAD NEW LOGO
      // ==============================================

      if (logo) {
        const formData =
          new FormData();

        formData.append(
          "file",
          logo
        );

        const uploadResponse =
          await uploadMedia(
            formData
          );

        const uploadedMedia =
          uploadResponse.media;

        if (!uploadedMedia) {
          throw new Error(
            "ಲೋಗೋ ಅಪ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ."
          );
        }

        logoUrl =
          uploadedMedia.url ||
          "";

        logoPublicId =
          uploadedMedia.publicId ||
          "";
      }

      // ==============================================
      // UPDATE SETTINGS
      // ==============================================

      await updateSettings({
        ...settings,

        logo:
          logoUrl,

        logoPublicId:
          logoPublicId,
      });

      // ==============================================
      // UPDATE LOCAL STATE
      // ==============================================

      setSettings(
        (previous) => ({
          ...previous,
          logo: logoUrl,
          logoPublicId:
            logoPublicId,
        })
      );

      setCurrentLogoPublicId(
        logoPublicId
      );

      setLogo(null);

      // ==============================================
      // SUCCESS
      // ==============================================

      setMessage(
        "ವೆಬ್‌ಸೈಟ್ ಸೆಟ್ಟಿಂಗ್ಸ್ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ."
      );
    } catch (error) {
      console.error(
        "Update settings error:",
        error
      );

      setError(
        error.message ||
          "ಸೆಟ್ಟಿಂಗ್ಸ್ ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <main className="settings-page">

        <div className="admin-page-header">

          <div>
            <h1>
              ವೆಬ್‌ಸೈಟ್ ಸೆಟ್ಟಿಂಗ್ಸ್
            </h1>

            <p>
              ಸೆಟ್ಟಿಂಗ್ಸ್ ಲೋಡ್
              ಮಾಡಲಾಗುತ್ತಿದೆ...
            </p>
          </div>

        </div>

        <section className="admin-form-card">

          <div className="admin-empty">
            ಸೆಟ್ಟಿಂಗ್ಸ್
            ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
          </div>

        </section>

      </main>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="settings-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="admin-page-header">

        <div>

          <h1>
            ವೆಬ್‌ಸೈಟ್ ಸೆಟ್ಟಿಂಗ್ಸ್
          </h1>

          <p>
            ವೆಬ್‌ಸೈಟ್‌ನ ಸಾಮಾನ್ಯ
            ಮಾಹಿತಿಯನ್ನು ಇಲ್ಲಿ
            ನಿರ್ವಹಿಸಿ.
          </p>

        </div>

      </div>

      {/* ==================================================
          SUCCESS
      ================================================== */}

      {message && (
        <div className="settings-success">
          {message}
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
          FORM
      ================================================== */}

      <form
        onSubmit={handleSubmit}
      >

        <div className="settings-layout">

          {/* ==================================================
              MAIN SETTINGS
          ================================================== */}

          <div className="settings-main">

            {/* WEBSITE INFORMATION */}

            <section className="admin-form-card">

              <h2 className="news-form-title">
                ವೆಬ್‌ಸೈಟ್ ಮಾಹಿತಿ
              </h2>

              {/* SITE NAME */}

              <div className="admin-form-group">

                <label htmlFor="siteName">
                  ವೆಬ್‌ಸೈಟ್ ಹೆಸರು
                </label>

                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={
                    settings.siteName
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="ವೆಬ್‌ಸೈಟ್ ಹೆಸರು"
                  disabled={saving}
                />

              </div>

              {/* TAGLINE */}

              <div className="admin-form-group">

                <label htmlFor="tagline">
                  ಘೋಷವಾಕ್ಯ
                </label>

                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  value={
                    settings.tagline
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="ವೆಬ್‌ಸೈಟ್ ಘೋಷವಾಕ್ಯ"
                  disabled={saving}
                />

              </div>

              {/* EMAIL */}

              <div className="admin-form-group">

                <label htmlFor="email">
                  ಇಮೇಲ್
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={
                    settings.email
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="info@example.com"
                  disabled={saving}
                />

              </div>

              {/* PHONE */}

              <div className="admin-form-group">

                <label htmlFor="phone">
                  ಮೊಬೈಲ್ ಸಂಖ್ಯೆ
                </label>

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={
                    settings.phone
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="+91 XXXXX XXXXX"
                  disabled={saving}
                />

              </div>

              {/* ADDRESS */}

              <div className="admin-form-group">

                <label htmlFor="address">
                  ವಿಳಾಸ
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={
                    settings.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="ವೆಬ್‌ಸೈಟ್ ಕಚೇರಿ ವಿಳಾಸ"
                  rows="4"
                  disabled={saving}
                />

              </div>

            </section>

            {/* ==================================================
                SOCIAL MEDIA
            ================================================== */}

            <section className="admin-form-card">

              <h2 className="news-form-title">
                ಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳು
              </h2>

              {/* YOUTUBE */}

              <div className="admin-form-group">

                <label htmlFor="youtube">
                  YouTube
                </label>

                <input
                  type="url"
                  id="youtube"
                  name="youtube"
                  value={
                    settings.youtube
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://youtube.com/..."
                  disabled={saving}
                />

              </div>

              {/* FACEBOOK */}

              <div className="admin-form-group">

                <label htmlFor="facebook">
                  Facebook
                </label>

                <input
                  type="url"
                  id="facebook"
                  name="facebook"
                  value={
                    settings.facebook
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://facebook.com/..."
                  disabled={saving}
                />

              </div>

              {/* INSTAGRAM */}

              <div className="admin-form-group">

                <label htmlFor="instagram">
                  Instagram
                </label>

                <input
                  type="url"
                  id="instagram"
                  name="instagram"
                  value={
                    settings.instagram
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://instagram.com/..."
                  disabled={saving}
                />

              </div>

            </section>

          </div>

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="settings-sidebar">

            {/* ==================================================
                LOGO
            ================================================== */}

            <section className="admin-form-card">

              <h2 className="news-form-title">
                ವೆಬ್‌ಸೈಟ್ ಲೋಗೋ
              </h2>

              <div className="settings-logo-upload">

                <input
                  type="file"
                  id="siteLogo"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={
                    handleLogoChange
                  }
                  disabled={saving}
                />

                <label htmlFor="siteLogo">
                  ಲೋಗೋ ಆಯ್ಕೆಮಾಡಿ
                </label>

              </div>

              <div className="settings-logo-preview">

                {logoPreview ? (
                  <img
                    src={
                      logoPreview
                    }
                    alt="Website logo preview"
                  />
                ) : (
                  <div className="settings-logo-placeholder">
                    ಸ
                  </div>
                )}

              </div>

              {logo && (
                <p className="settings-file-name">
                  {logo.name}
                </p>
              )}

              <p className="settings-help-text">
                PNG, JPG ಅಥವಾ WebP
                ಚಿತ್ರವನ್ನು ಬಳಸಬಹುದು.
              </p>

            </section>

            {/* ==================================================
                SAVE
            ================================================== */}

            <section className="admin-form-card">

              <button
                type="submit"
                className="admin-primary-button settings-save-button"
                disabled={saving}
              >
                {saving
                  ? "ಉಳಿಸಲಾಗುತ್ತಿದೆ..."
                  : "ಸೆಟ್ಟಿಂಗ್ಸ್ ಉಳಿಸಿ"}
              </button>

            </section>

          </aside>

        </div>

      </form>

    </main>
  );
}

export default Settings;