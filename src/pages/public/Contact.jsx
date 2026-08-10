import React, { useEffect, useState } from "react";

import {
  getSettings,
  sendContactMessage,
} from "../../services/api";

import {
  useLanguage,
} from "../../context/LanguageContext";

import "./Contact.css";

function Contact() {
  const { t, language } = useLanguage();

  // ==================================================
  // SETTINGS
  // ==================================================

  const [settings, setSettings] = useState({
    siteName: "ಸಮಾನತೆಯ ಧ್ವನಿ",
    tagline: "ನಿಮ್ಮ ಧ್ವನಿ - ನಮ್ಮ ಜವಾಬ್ದಾರಿ",
    email: "",
    phone: "",
    address: "",
    youtube: "",
    facebook: "",
    instagram: "",
    logo: "",
  });

  const [settingsLoading, setSettingsLoading] =
    useState(true);

  const [settingsError, setSettingsError] =
    useState("");

  // ==================================================
  // CONTACT FORM
  // ==================================================

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // ==================================================
  // UI STATE
  // ==================================================

  const [submitted, setSubmitted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ==================================================
  // LOAD WEBSITE SETTINGS
  // ==================================================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setSettingsLoading(true);
        setSettingsError("");

        const response =
          await getSettings();

        const data =
          response?.settings ||
          response?.data ||
          response ||
          {};

        setSettings((previous) => ({
          ...previous,
          ...data,
        }));
      } catch (error) {
        console.error(
          "Get settings error:",
          error
        );

        setSettingsError(
          error.message ||
            "ವೆಬ್‌ಸೈಟ್ ಮಾಹಿತಿ ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
        );
      } finally {
        setSettingsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // ==================================================
  // HANDLE FORM CHANGE
  // ==================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSubmitted(false);
    setError("");
  };

  // ==================================================
  // HANDLE FORM SUBMIT
  // ==================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSubmitted(false);
    setError("");

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setError(
        language === "kn"
          ? "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಅಗತ್ಯ ಮಾಹಿತಿಯನ್ನು ನಮೂದಿಸಿ."
          : "Please fill in all required fields."
      );

      return;
    }

    try {
      setLoading(true);

      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      // Success
      setSubmitted(true);

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(
        "Contact form error:",
        error
      );

      setError(
        error.message ||
          (
            language === "kn"
              ? "ಸಂದೇಶ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
              : "Unable to send your message. Please try again."
          )
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // OPEN SOCIAL MEDIA
  // ==================================================

  const openSocial = (url) => {
    if (!url) {
      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ==================================================
  // COPY EMAIL
  // ==================================================

  const copyEmail = async () => {
    if (!settings.email) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        settings.email
      );

      alert(
        language === "kn"
          ? "ಇಮೇಲ್ ವಿಳಾಸ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ."
          : "Email address copied."
      );
    } catch (error) {
      console.error(
        "Copy email error:",
        error
      );
    }
  };

  // ==================================================
  // COPY PHONE
  // ==================================================

  const copyPhone = async () => {
    if (!settings.phone) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        settings.phone
      );

      alert(
        language === "kn"
          ? "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ."
          : "Phone number copied."
      );
    } catch (error) {
      console.error(
        "Copy phone error:",
        error
      );
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (settingsLoading) {
    return (
      <main className="contact-page">

        <section className="contact-header">
          <div className="container">

            <div className="contact-loading">
              <div className="contact-loading-spinner">
                ⟳
              </div>

              <p>
                {language === "kn"
                  ? "ಮಾಹಿತಿ ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
                  : "Loading contact information..."}
              </p>
            </div>

          </div>
        </section>

      </main>
    );
  }

  // ==================================================
  // RETURN
  // ==================================================

  return (
    <main className="contact-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="contact-header">

        <div className="container">

          <div className="contact-header-content">

            {settings.logo && (
              <div className="contact-header-logo">

                <img
                  src={settings.logo}
                  alt={
                    settings.siteName ||
                    "Website Logo"
                  }
                />

              </div>
            )}

            <div>

              <span className="contact-header-label">
                {language === "kn"
                  ? "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ"
                  : "GET IN TOUCH"}
              </span>

              <h1>
                {t.contact}
              </h1>

              <p>
                {settings.tagline ||
                  t.contactHeaderDescription}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          CONTENT
      ================================================== */}

      <section className="contact-content-section">

        <div className="container">

          {settingsError && (
            <div className="contact-warning">
              {settingsError}
            </div>
          )}

          <div className="contact-grid">


            {/* ==================================================
                LEFT SIDE
            ================================================== */}

            <div className="contact-information">

              <div className="contact-brand-card">

                {settings.logo ? (
                  <img
                    src={settings.logo}
                    alt={
                      settings.siteName ||
                      "Website Logo"
                    }
                    className="contact-logo"
                  />
                ) : (
                  <div className="contact-logo-placeholder">
                    {settings.siteName
                      ?.charAt(0) || "ಸ"}
                  </div>
                )}

                <div>

                  <h2>
                    {settings.siteName ||
                      "ಸಮಾನತೆಯ ಧ್ವನಿ"}
                  </h2>

                  <p>
                    {settings.tagline ||
                      (
                        language === "kn"
                          ? "ನಿಮ್ಮ ಧ್ವನಿ - ನಮ್ಮ ಜವಾಬ್ದಾರಿ"
                          : "Your Voice - Our Responsibility"
                      )}
                  </p>

                </div>

              </div>


              {/* INTRO */}

              <div className="contact-introduction">

                <h2>
                  {t.contactUs}
                </h2>

                <p>
                  {t.contactIntro}
                </p>

                <p>
                  {language === "kn"
                    ? "ಸುದ್ದಿ, ಜಾಹೀರಾತು, ಸಹಕಾರ, ಸಲಹೆ ಅಥವಾ ಯಾವುದೇ ವಿಚಾರಕ್ಕಾಗಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು."
                    : "You can contact us for news, advertisements, collaborations, suggestions, feedback or any other enquiries."}
                </p>

              </div>


              {/* ==================================================
                  EMAIL
              ================================================== */}

              {settings.email && (
                <div className="contact-info-item">

                  <span className="contact-info-icon">
                    ✉
                  </span>

                  <div className="contact-info-content">

                    <strong>
                      {t.email}
                    </strong>

                    <a
                      href={`mailto:${settings.email}`}
                    >
                      {settings.email}
                    </a>

                    <button
                      type="button"
                      className="contact-copy-button"
                      onClick={copyEmail}
                    >
                      {language === "kn"
                        ? "ಕಾಪಿ"
                        : "Copy"}
                    </button>

                  </div>

                </div>
              )}


              {/* ==================================================
                  PHONE
              ================================================== */}

              {settings.phone && (
                <div className="contact-info-item">

                  <span className="contact-info-icon">
                    ☎
                  </span>

                  <div className="contact-info-content">

                    <strong>
                      {t.phone}
                    </strong>

                    <a
                      href={`tel:${settings.phone}`}
                    >
                      {settings.phone}
                    </a>

                    <button
                      type="button"
                      className="contact-copy-button"
                      onClick={copyPhone}
                    >
                      {language === "kn"
                        ? "ಕಾಪಿ"
                        : "Copy"}
                    </button>

                  </div>

                </div>
              )}


              {/* ==================================================
                  WHATSAPP
              ================================================== */}

              {settings.phone && (
                <div className="contact-info-item">

                  <span className="contact-info-icon whatsapp-icon">
                    💬
                  </span>

                  <div className="contact-info-content">

                    <strong>
                      WhatsApp
                    </strong>

                    <a
                      href={`https://wa.me/${settings.phone.replace(
                        /\D/g,
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {language === "kn"
                        ? "WhatsApp ನಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ"
                        : "Contact us on WhatsApp"}
                    </a>

                  </div>

                </div>
              )}


              {/* ==================================================
                  ADDRESS
              ================================================== */}

              {settings.address && (
                <div className="contact-info-item">

                  <span className="contact-info-icon">
                    📍
                  </span>

                  <div className="contact-info-content">

                    <strong>
                      {t.address}
                    </strong>

                    <p>
                      {settings.address}
                    </p>

                  </div>

                </div>
              )}


              {/* ==================================================
                  SOCIAL MEDIA
              ================================================== */}

              <div className="contact-social-section">

                <h3>
                  {t.followUs ||
                    (
                      language === "kn"
                        ? "ನಮ್ಮನ್ನು ಅನುಸರಿಸಿ"
                        : "Follow Us"
                    )}
                </h3>

                <div className="contact-social-links">

                  {settings.youtube && (
                    <button
                      type="button"
                      className="contact-social youtube"
                      onClick={() =>
                        openSocial(
                          settings.youtube
                        )
                      }
                    >
                      <span>▶</span>
                      <strong>
                        YouTube
                      </strong>
                    </button>
                  )}

                  {settings.facebook && (
                    <button
                      type="button"
                      className="contact-social facebook"
                      onClick={() =>
                        openSocial(
                          settings.facebook
                        )
                      }
                    >
                      <span>f</span>
                      <strong>
                        Facebook
                      </strong>
                    </button>
                  )}

                  {settings.instagram && (
                    <button
                      type="button"
                      className="contact-social instagram"
                      onClick={() =>
                        openSocial(
                          settings.instagram
                        )
                      }
                    >
                      <span>◎</span>
                      <strong>
                        Instagram
                      </strong>
                    </button>
                  )}

                </div>

              </div>


              {/* ==================================================
                  WEBSITE INFO
              ================================================== */}

              <div className="contact-office-note">

                <span className="contact-office-icon">
                  📰
                </span>

                <div>

                  <strong>
                    {settings.siteName}
                  </strong>

                  <p>
                    {language === "kn"
                      ? "ನಿಖರವಾದ ಮತ್ತು ಜವಾಬ್ದಾರಿಯುತ ಸುದ್ದಿಗಾಗಿ ನಮ್ಮೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ."
                      : "Stay connected with us for accurate and responsible news."}
                  </p>

                </div>

              </div>

            </div>


            {/* ==================================================
                RIGHT SIDE - FORM
            ================================================== */}

            <div className="contact-form-card">

              <div className="contact-form-header">

                <span className="contact-form-label">
                  {language === "kn"
                    ? "ಸಂದೇಶ ಕಳುಹಿಸಿ"
                    : "SEND MESSAGE"}
                </span>

                <h2>
                  {t.sendMessage}
                </h2>

                <p>
                  {language === "kn"
                    ? "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ನಮಗೆ ಕಳುಹಿಸಿ. ಸಾಧ್ಯವಾದಷ್ಟು ಬೇಗ ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತೇವೆ."
                    : "Send us your message and we will get back to you as soon as possible."}
                </p>

              </div>


              {/* SUCCESS */}

              {submitted && (
                <div className="contact-success">

                  <span>✓</span>

                  <div>

                    <strong>
                      {language === "kn"
                        ? "ಸಂದೇಶ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ"
                        : "Message sent successfully"}
                    </strong>

                    <p>
                      {language === "kn"
                        ? "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ನಾವು ಸ್ವೀಕರಿಸಿದ್ದೇವೆ."
                        : "We have received your message."}
                    </p>

                  </div>

                </div>
              )}


              {/* ERROR */}

              {error && (
                <div className="contact-error">

                  <span>!</span>

                  <p>
                    {error}
                  </p>

                </div>
              )}


              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="contact-form"
              >

                {/* NAME */}

                <div className="contact-form-group">

                  <label htmlFor="name">
                    {t.name}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={
                      t.namePlaceholder ||
                      (
                        language === "kn"
                          ? "ನಿಮ್ಮ ಹೆಸರು"
                          : "Your name"
                      )
                    }
                    required
                    disabled={loading}
                  />

                </div>


                {/* EMAIL */}

                <div className="contact-form-group">

                  <label htmlFor="email">
                    {t.email}
                    <span>*</span>
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={
                      t.emailPlaceholder ||
                      (
                        language === "kn"
                          ? "ನಿಮ್ಮ ಇಮೇಲ್"
                          : "Your email"
                      )
                    }
                    required
                    disabled={loading}
                  />

                </div>


                {/* PHONE */}

                <div className="contact-form-group">

                  <label htmlFor="phone">
                    {t.phoneNumber ||
                      t.phone}

                    <small>
                      {language === "kn"
                        ? " (ಐಚ್ಛಿಕ)"
                        : " (Optional)"}
                    </small>
                  </label>

                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={
                      t.phonePlaceholder ||
                      (
                        language === "kn"
                          ? "ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ"
                          : "Your phone number"
                      )
                    }
                    disabled={loading}
                  />

                </div>


                {/* SUBJECT */}

                <div className="contact-form-group">

                  <label htmlFor="subject">
                    {t.subject}
                    <span>*</span>
                  </label>

                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={
                      t.subjectPlaceholder ||
                      (
                        language === "kn"
                          ? "ವಿಷಯ"
                          : "Subject"
                      )
                    }
                    required
                    disabled={loading}
                  />

                </div>


                {/* MESSAGE */}

                <div className="contact-form-group">

                  <label htmlFor="message">
                    {t.message}
                    <span>*</span>
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={
                      t.messagePlaceholder ||
                      (
                        language === "kn"
                          ? "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
                          : "Write your message here..."
                      )
                    }
                    rows="6"
                    required
                    disabled={loading}
                  />

                </div>


                {/* SUBMIT */}

                <button
                  type="submit"
                  className="contact-submit-button"
                  disabled={loading}
                >

                  {loading ? (
                    <>
                      <span className="contact-button-spinner">
                        ⟳
                      </span>

                      {language === "kn"
                        ? "ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ..."
                        : "Sending..."}
                    </>
                  ) : (
                    <>
                      <span>
                        ✈
                      </span>

                      {t.sendMessage}
                    </>
                  )}

                </button>

              </form>


              {/* FORM FOOTER */}

              <div className="contact-form-footer">

                <span>
                  🔒
                </span>

                <p>
                  {language === "kn"
                    ? "ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಗೌಪ್ಯವಾಗಿ ಇರಿಸಲಾಗುತ್ತದೆ."
                    : "Your personal information will be kept private."}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Contact;