import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getSettings,
} from "../../services/api";

import {
  useLanguage,
} from "../../context/LanguageContext";

import "./About.css";

function About() {
  const { t, language } = useLanguage();

  // =====================================================
  // WEBSITE SETTINGS
  // =====================================================

  const [settings, setSettings] = useState({
    siteName: "ಸಮಾನತೆಯ ಧ್ವನಿ",
    tagline:
      "ನಿಮ್ಮ ಧ್ವನಿ – ನಮ್ಮ ಜವಾಬ್ದಾರಿ",
    email: "",
    phone: "",
    address: "",
    youtube: "",
    facebook: "",
    instagram: "",
    logo: "",
  });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");

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
      } catch (err) {
        console.error(
          "About settings error:",
          err
        );

        setError(
          language === "kn"
            ? "ವೆಬ್‌ಸೈಟ್ ಮಾಹಿತಿಯನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
            : "Unable to load website information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [language]);

  // =====================================================
  // LANGUAGE TEXT
  // =====================================================

  const isKannada =
    language === "kn";

  const text = {
    aboutLabel: isKannada
      ? "ನಮ್ಮ ಬಗ್ಗೆ"
      : "ABOUT US",

    introLabel: isKannada
      ? "ಸಮಾನತೆಯ ಧ್ವನಿ"
      : "SAMANATEYA DHWANI",

    introTitle: isKannada
      ? "ಜನರ ಧ್ವನಿಗೆ ಒಂದು ವಿಶ್ವಾಸಾರ್ಹ ವೇದಿಕೆ"
      : "A Trusted Platform for the Voice of the People",

    introOne: isKannada
      ? "ಸಮಾನತೆಯ ಧ್ವನಿ ಒಂದು ಡಿಜಿಟಲ್ ಸುದ್ದಿ ವೇದಿಕೆಯಾಗಿದ್ದು, ಕರ್ನಾಟಕ, ಭಾರತ ಮತ್ತು ವಿಶ್ವದ ಪ್ರಮುಖ ಬೆಳವಣಿಗೆಗಳನ್ನು ಓದುಗರಿಗೆ ಸರಳ, ಸ್ಪಷ್ಟ ಮತ್ತು ಜವಾಬ್ದಾರಿಯುತ ರೀತಿಯಲ್ಲಿ ತಲುಪಿಸುವ ಉದ್ದೇಶವನ್ನು ಹೊಂದಿದೆ."
      : "Samanateya Dhwani is a digital news platform focused on bringing important developments from Karnataka, India and around the world to readers in a clear, accessible and responsible manner.",

    introTwo: isKannada
      ? "ಸುದ್ದಿ ಕೇವಲ ಮಾಹಿತಿಯಲ್ಲ; ಅದು ಸಮಾಜದ ಅರಿವು ಮತ್ತು ಜನರ ಹಕ್ಕುಗಳೊಂದಿಗೆ ಸಂಬಂಧ ಹೊಂದಿರುವ ಪ್ರಮುಖ ಮಾಧ್ಯಮವಾಗಿದೆ. ಈ ನಂಬಿಕೆಯೊಂದಿಗೆ ಜನರಿಗೆ ಸಂಬಂಧಿಸಿದ ವಿಷಯಗಳು, ಸಾರ್ವಜನಿಕ ವಿಚಾರಗಳು ಮತ್ತು ಪ್ರಮುಖ ಬೆಳವಣಿಗೆಗಳನ್ನು ನಮ್ಮ ವೇದಿಕೆಯ ಮೂಲಕ ತಲುಪಿಸುವ ಪ್ರಯತ್ನ ಮಾಡಲಾಗುತ್ತದೆ."
      : "News is more than information; it plays an important role in public awareness and understanding. With this belief, our platform aims to bring readers important developments, public-interest issues and stories that matter to society.",

    newsChannel: isKannada
      ? "ಸುದ್ದಿ ವಾಹಿನಿ"
      : "NEWS CHANNEL",

    whatWeDo: isKannada
      ? "ನಾವು ಏನು ಮಾಡುತ್ತೇವೆ"
      : "WHAT WE DO",

    whatWeDoTitle: isKannada
      ? "ಸುದ್ದಿ ಮತ್ತು ಮಾಹಿತಿಯನ್ನು ಜನರಿಗೆ ತಲುಪಿಸುವುದು"
      : "Bringing News and Information to People",

    whatWeDoDescription: isKannada
      ? "ವಿವಿಧ ಕ್ಷೇತ್ರಗಳ ಪ್ರಮುಖ ಮಾಹಿತಿಯನ್ನು ಒಂದೇ ವೇದಿಕೆಯಲ್ಲಿ ಓದುಗರಿಗೆ ತಲುಪಿಸುವುದು ನಮ್ಮ ಪ್ರಮುಖ ಉದ್ದೇಶ."
      : "Our aim is to bring important information from different areas together on one accessible platform.",

    mission: isKannada
      ? "ನಮ್ಮ ಧ್ಯೇಯ"
      : "OUR MISSION",

    missionTitle: isKannada
      ? "ಜವಾಬ್ದಾರಿಯುತ ಮತ್ತು ಉಪಯುಕ್ತ ಸುದ್ದಿ"
      : "Responsible and Useful News",

    missionText: isKannada
      ? "ನಿಖರವಾದ, ಸ್ಪಷ್ಟವಾದ ಮತ್ತು ಜನರಿಗೆ ಉಪಯುಕ್ತವಾದ ಸುದ್ದಿಯನ್ನು ಜವಾಬ್ದಾರಿಯುತ ರೀತಿಯಲ್ಲಿ ತಲುಪಿಸುವುದು ನಮ್ಮ ಪ್ರಮುಖ ಧ್ಯೇಯವಾಗಿದೆ."
      : "Our mission is to deliver clear, useful and responsible news to readers.",

    vision: isKannada
      ? "ನಮ್ಮ ದೃಷ್ಟಿಕೋನ"
      : "OUR VISION",

    visionTitle: isKannada
      ? "ತಂತ್ರಜ್ಞಾನದಿಂದ ವಿಶ್ವಾಸಾರ್ಹ ಮಾಹಿತಿ"
      : "Reliable Information Through Technology",

    visionText: isKannada
      ? "ತಂತ್ರಜ್ಞಾನದ ಸಹಾಯದಿಂದ ವಿಶ್ವಾಸಾರ್ಹ ಸುದ್ದಿಯನ್ನು ಹೆಚ್ಚಿನ ಜನರಿಗೆ ತಲುಪಿಸುವ ಆಧುನಿಕ ಸುದ್ದಿ ವೇದಿಕೆಯನ್ನು ನಿರ್ಮಿಸುವುದು ನಮ್ಮ ದೃಷ್ಟಿಕೋನ."
      : "Our vision is to build a modern news platform that uses technology to make reliable information available to more people.",

    values: isKannada
      ? "ನಮ್ಮ ಮೌಲ್ಯಗಳು"
      : "OUR VALUES",

    valuesTitle: isKannada
      ? "ಜವಾಬ್ದಾರಿಯುತ ಪತ್ರಿಕೋದ್ಯಮಕ್ಕೆ ಆದ್ಯತೆ"
      : "Committed to Responsible Journalism",

    accuracy: isKannada
      ? "ನಿಖರತೆ"
      : "Accuracy",

    accuracyText: isKannada
      ? "ಸುದ್ದಿಯ ಮಾಹಿತಿಯನ್ನು ಸಾಧ್ಯವಾದಷ್ಟು ಸ್ಪಷ್ಟವಾಗಿ ಮತ್ತು ನಿಖರವಾಗಿ ನೀಡಲು ನಾವು ಪ್ರಯತ್ನಿಸುತ್ತೇವೆ."
      : "We strive to present news information as clearly and accurately as possible.",

    responsibility: isKannada
      ? "ಜವಾಬ್ದಾರಿ"
      : "Responsibility",

    responsibilityText: isKannada
      ? "ಸುದ್ದಿ ಪ್ರಕಟಣೆಯಲ್ಲಿ ಸಾರ್ವಜನಿಕ ಜವಾಬ್ದಾರಿ ಮತ್ತು ಸಾಮಾಜಿಕ ಪರಿಣಾಮವನ್ನು ಗಮನದಲ್ಲಿಟ್ಟುಕೊಳ್ಳುತ್ತೇವೆ."
      : "We consider public responsibility and social impact when presenting news.",

    transparency: isKannada
      ? "ಪಾರದರ್ಶಕತೆ"
      : "Transparency",

    transparencyText: isKannada
      ? "ಓದುಗರಿಗೆ ಸ್ಪಷ್ಟವಾದ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸುವುದು ನಮ್ಮ ಪ್ರಮುಖ ಆದ್ಯತೆ."
      : "Providing readers with clear information is one of our key priorities.",

    peopleVoice: isKannada
      ? "ಜನರ ಧ್ವನಿ"
      : "Voice of the People",

    peopleVoiceText: isKannada
      ? "ಜನರಿಗೆ ಸಂಬಂಧಿಸಿದ ವಿಚಾರಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಹಿತಾಸಕ್ತಿಯ ವಿಷಯಗಳಿಗೆ ಆದ್ಯತೆ ನೀಡುತ್ತೇವೆ."
      : "We give importance to issues concerning people and matters of public interest.",

    paperLabel: isKannada
      ? "ಮಾಸಿಕ ಪ್ರಕಟಣೆ"
      : "MONTHLY PUBLICATION",

    paperTitle: isKannada
      ? "ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆ"
      : "Samara Dhwani Monthly Newspaper",

    paperText: isKannada
      ? "ಸಮಾನತೆಯ ಧ್ವನಿ ಡಿಜಿಟಲ್ ಸುದ್ದಿ ವೇದಿಕೆಯ ಜೊತೆಗೆ, ನಮ್ಮ ಮಾಸಿಕ ಪ್ರಕಟಣೆಯಾದ ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆಯನ್ನೂ ಓದುಗರಿಗೆ ಡಿಜಿಟಲ್ ರೂಪದಲ್ಲಿ ಒದಗಿಸಲಾಗುತ್ತದೆ."
      : "Along with the Samanateya Dhwani digital news platform, our monthly publication, Samara Dhwani Monthly Newspaper, is also made available to readers in digital format.",

    readPaper: isKannada
      ? "📰 ಪತ್ರಿಕೆ ಓದಿ"
      : "📰 Read Newspaper",

    platformLabel: isKannada
      ? "ಡಿಜಿಟಲ್ ವೇದಿಕೆ"
      : "DIGITAL PLATFORM",

    platformTitle: isKannada
      ? "ಎಲ್ಲೆಡೆ, ಎಲ್ಲ ಸಮಯದಲ್ಲೂ ಸುದ್ದಿ"
      : "News Wherever You Are",

    platformText: isKannada
      ? "ವೆಬ್‌ಸೈಟ್, ವಿಡಿಯೋ ಸುದ್ದಿ, ಫೋಟೋ ಗ್ಯಾಲರಿ, ಹುಡುಕಾಟ ವ್ಯವಸ್ಥೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಮಾಸಿಕ ಪತ್ರಿಕೆಯಂತಹ ಸೌಲಭ್ಯಗಳ ಮೂಲಕ ಓದುಗರಿಗೆ ಸುಲಭವಾದ ಸುದ್ದಿ ಅನುಭವವನ್ನು ನೀಡುವ ಉದ್ದೇಶ ನಮ್ಮದು."
      : "Through our website, video news, photo gallery, search features and digital monthly newspaper, we aim to provide readers with a convenient and modern news experience.",

    contactLabel: isKannada
      ? "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ"
      : "GET IN TOUCH",

    contactTitle: isKannada
      ? "ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ನಮಗೆ ಮುಖ್ಯ"
      : "Your Voice Matters to Us",

    contactText: isKannada
      ? "ಸುದ್ದಿ, ಸಲಹೆ, ಅಭಿಪ್ರಾಯ ಅಥವಾ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಾಗಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು."
      : "You can contact us for news, suggestions, feedback or any questions.",

    contactButton: isKannada
      ? "ಸಂಪರ್ಕಿಸಿ →"
      : "Contact Us →",

    reliable: isKannada
      ? "ವಿಶ್ವಾಸಾರ್ಹ ಮಾಹಿತಿ"
      : "Reliable Information",

    responsible: isKannada
      ? "ಜವಾಬ್ದಾರಿಯುತ ಸುದ್ದಿ"
      : "Responsible News",

    voice: isKannada
      ? "ಜನರ ಧ್ವನಿ"
      : "Voice of the People",
  };

  // =====================================================
  // SOCIAL MEDIA
  // =====================================================

  const socialLinks = [
    {
      name: "YouTube",
      url: settings.youtube,
      icon: "▶",
      className: "youtube",
    },
    {
      name: "Facebook",
      url: settings.facebook,
      icon: "f",
      className: "facebook",
    },
    {
      name: "Instagram",
      url: settings.instagram,
      icon: "◎",
      className: "instagram",
    },
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="about-page">

        <section className="about-loading-section">

          <div className="container">

            <div className="about-loading">

              <div className="about-loading-spinner">
                ⟳
              </div>

              <p>
                {isKannada
                  ? "ಮಾಹಿತಿ ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
                  : "Loading information..."}
              </p>

            </div>

          </div>

        </section>

      </main>
    );
  }

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <main className="about-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <section className="about-header">

        <div className="container">

          <div className="about-header-content">

            {settings.logo ? (
              <div className="about-header-logo">

                <img
                  src={settings.logo}
                  alt={
                    settings.siteName ||
                    "Logo"
                  }
                />

              </div>
            ) : (
              <div className="about-header-logo-placeholder">
                {settings.siteName?.charAt(0) ||
                  "ಸ"}
              </div>
            )}

            <div>

              <span className="about-header-label">
                {text.aboutLabel}
              </span>

              <h1>
                {settings.siteName ||
                  t.siteName}
              </h1>

              <p>
                {settings.tagline ||
                  text.introOne}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="container">

          <div className="about-settings-warning">
            {error}
          </div>

        </div>
      )}


      {/* ==================================================
          INTRODUCTION
      ================================================== */}

      <section className="about-introduction">

        <div className="container">

          <div className="about-intro-grid">

            <div className="about-intro-content">

              <span className="about-section-label">
                {text.introLabel}
              </span>

              <h2>
                {text.introTitle}
              </h2>

              <p>
                {text.introOne}
              </p>

              <p>
                {text.introTwo}
              </p>

            </div>


            {/* BRAND CARD */}

            <div className="about-brand-card">

              {settings.logo ? (
                <div className="about-brand-logo-image">

                  <img
                    src={settings.logo}
                    alt={
                      settings.siteName ||
                      "Logo"
                    }
                  />

                </div>
              ) : (
                <div className="about-brand-logo">
                  {settings.siteName?.charAt(0) ||
                    "ಸ"}
                </div>
              )}

              <h3>
                {settings.siteName ||
                  t.siteName}
              </h3>

              <p>
                {text.newsChannel}
              </p>

              <div className="about-brand-line"></div>

              <strong>
                {settings.tagline ||
                  (
                    isKannada
                      ? "ನಿಮ್ಮ ಧ್ವನಿ – ನಮ್ಮ ಜವಾಬ್ದಾರಿ"
                      : "Your Voice – Our Responsibility"
                  )}
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          WHAT WE DO
      ================================================== */}

      <section className="about-services-section">

        <div className="container">

          <div className="about-section-heading">

            <span>
              {text.whatWeDo}
            </span>

            <h2>
              {text.whatWeDoTitle}
            </h2>

            <p>
              {text.whatWeDoDescription}
            </p>

          </div>


          <div className="about-services-grid">

            {/* Karnataka */}

            <div className="about-service-card">

              <div className="about-service-icon">
                🏛️
              </div>

              <h3>
                {isKannada
                  ? "ಕರ್ನಾಟಕ"
                  : "Karnataka"}
              </h3>

              <p>
                {isKannada
                  ? "ರಾಜ್ಯದ ಜಿಲ್ಲೆಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಮಟ್ಟದ ಪ್ರಮುಖ ಬೆಳವಣಿಗೆಗಳು."
                  : "Important developments from districts and local areas across Karnataka."}
              </p>

            </div>


            {/* India */}

            <div className="about-service-card">

              <div className="about-service-icon">
                🇮🇳
              </div>

              <h3>
                {isKannada
                  ? "ರಾಷ್ಟ್ರೀಯ ಸುದ್ದಿ"
                  : "National News"}
              </h3>

              <p>
                {isKannada
                  ? "ಭಾರತದಾದ್ಯಂತ ನಡೆಯುವ ಪ್ರಮುಖ ರಾಷ್ಟ್ರೀಯ ಬೆಳವಣಿಗೆಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕ ವಿಚಾರಗಳು."
                  : "Major national developments and public-interest issues from across India."}
              </p>

            </div>


            {/* World */}

            <div className="about-service-card">

              <div className="about-service-icon">
                🌍
              </div>

              <h3>
                {isKannada
                  ? "ವಿಶ್ವ ಸುದ್ದಿ"
                  : "World News"}
              </h3>

              <p>
                {isKannada
                  ? "ಅಂತರರಾಷ್ಟ್ರೀಯ ಮಟ್ಟದಲ್ಲಿ ನಡೆಯುವ ಪ್ರಮುಖ ಬೆಳವಣಿಗೆಗಳ ಮಾಹಿತಿ."
                  : "Important developments and events from around the world."}
              </p>

            </div>


            {/* Politics */}

            <div className="about-service-card">

              <div className="about-service-icon">
                🗳️
              </div>

              <h3>
                {isKannada
                  ? "ರಾಜಕೀಯ"
                  : "Politics"}
              </h3>

              <p>
                {isKannada
                  ? "ರಾಜಕೀಯ ಕ್ಷೇತ್ರದ ಪ್ರಮುಖ ಬೆಳವಣಿಗೆಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕ ವಿಚಾರಗಳು."
                  : "Important political developments and public-interest issues."}
              </p>

            </div>


            {/* Crime */}

            <div className="about-service-card">

              <div className="about-service-icon">
                ⚖️
              </div>

              <h3>
                {isKannada
                  ? "ಅಪರಾಧ"
                  : "Crime"}
              </h3>

              <p>
                {isKannada
                  ? "ಅಪರಾಧ ಪ್ರಕರಣಗಳು ಮತ್ತು ಸಂಬಂಧಿತ ಬೆಳವಣಿಗೆಗಳ ಕುರಿತು ಮಾಹಿತಿ."
                  : "Information about crime cases and related developments."}
              </p>

            </div>


            {/* Sports */}

            <div className="about-service-card">

              <div className="about-service-icon">
                🏆
              </div>

              <h3>
                {isKannada
                  ? "ಕ್ರೀಡೆ"
                  : "Sports"}
              </h3>

              <p>
                {isKannada
                  ? "ಕ್ರೀಡಾ ಜಗತ್ತಿನ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು ಮತ್ತು ಬೆಳವಣಿಗೆಗಳು."
                  : "Important news and developments from the world of sports."}
              </p>

            </div>


            {/* Cinema */}

            <div className="about-service-card">

              <div className="about-service-icon">
                🎬
              </div>

              <h3>
                {isKannada
                  ? "ಸಿನಿಮಾ"
                  : "Cinema"}
              </h3>

              <p>
                {isKannada
                  ? "ಚಿತ್ರರಂಗ ಮತ್ತು ಮನರಂಜನಾ ಕ್ಷೇತ್ರದ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು."
                  : "Important news from the film and entertainment industry."}
              </p>

            </div>


            {/* Education */}

            <div className="about-service-card">

              <div className="about-service-icon">
                🎓
              </div>

              <h3>
                {isKannada
                  ? "ಶಿಕ್ಷಣ"
                  : "Education"}
              </h3>

              <p>
                {isKannada
                  ? "ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಶಿಕ್ಷಣ ಕ್ಷೇತ್ರಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಪ್ರಮುಖ ಮಾಹಿತಿ."
                  : "Important information related to students and the education sector."}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          MISSION & VISION
      ================================================== */}

      <section className="about-mission-section">

        <div className="container">

          <div className="about-mission-grid">

            {/* Mission */}

            <div className="about-info-box mission-box">

              <div className="about-info-icon">
                🎯
              </div>

              <span className="about-box-label">
                {text.mission}
              </span>

              <h2>
                {text.missionTitle}
              </h2>

              <p>
                {text.missionText}
              </p>

            </div>


            {/* Vision */}

            <div className="about-info-box vision-box">

              <div className="about-info-icon">
                👁️
              </div>

              <span className="about-box-label">
                {text.vision}
              </span>

              <h2>
                {text.visionTitle}
              </h2>

              <p>
                {text.visionText}
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          VALUES
      ================================================== */}

      <section className="about-values-section">

        <div className="container">

          <div className="about-section-heading">

            <span>
              {text.values}
            </span>

            <h2>
              {text.valuesTitle}
            </h2>

          </div>


          <div className="about-values-grid">

            <div className="about-value-card">

              <span>✓</span>

              <div>

                <h3>
                  {text.accuracy}
                </h3>

                <p>
                  {text.accuracyText}
                </p>

              </div>

            </div>


            <div className="about-value-card">

              <span>✓</span>

              <div>

                <h3>
                  {text.responsibility}
                </h3>

                <p>
                  {text.responsibilityText}
                </p>

              </div>

            </div>


            <div className="about-value-card">

              <span>✓</span>

              <div>

                <h3>
                  {text.transparency}
                </h3>

                <p>
                  {text.transparencyText}
                </p>

              </div>

            </div>


            <div className="about-value-card">

              <span>✓</span>

              <div>

                <h3>
                  {text.peopleVoice}
                </h3>

                <p>
                  {text.peopleVoiceText}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          MONTHLY PAPER
      ================================================== */}

      <section className="about-paper-section">

        <div className="container">

          <div className="about-paper-box">

            <div className="about-paper-icon">
              🗞️
            </div>

            <div className="about-paper-content">

              <span>
                {text.paperLabel}
              </span>

              <h2>
                {text.paperTitle}
              </h2>

              <p>
                {text.paperText}
              </p>

              <Link
                to="/monthly-paper"
                className="about-paper-button"
              >
                {text.readPaper}
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          DIGITAL PLATFORM
      ================================================== */}

      <section className="about-platform-section">

        <div className="container">

          <div className="about-platform-content">

            <div>

              <span className="about-section-label">
                {text.platformLabel}
              </span>

              <h2>
                {text.platformTitle}
              </h2>

            </div>

            <p>
              {text.platformText}
            </p>

          </div>


          <div className="about-platform-features">

            <div>
              <strong>📰</strong>
              <span>
                {isKannada
                  ? "ದೈನಂದಿನ ಸುದ್ದಿ"
                  : "Daily News"}
              </span>
            </div>

            <div>
              <strong>🎥</strong>
              <span>
                {isKannada
                  ? "ವಿಡಿಯೋ ಸುದ್ದಿ"
                  : "Video News"}
              </span>
            </div>

            <div>
              <strong>🖼️</strong>
              <span>
                {isKannada
                  ? "ಫೋಟೋ ಗ್ಯಾಲರಿ"
                  : "Photo Gallery"}
              </span>
            </div>

            <div>
              <strong>🔎</strong>
              <span>
                {isKannada
                  ? "ಸುದ್ದಿ ಹುಡುಕಾಟ"
                  : "News Search"}
              </span>
            </div>

            <div>
              <strong>🗞️</strong>
              <span>
                {isKannada
                  ? "ಮಾಸಿಕ ಪತ್ರಿಕೆ"
                  : "Monthly Paper"}
              </span>
            </div>

            <div>
              <strong>🌐</strong>
              <span>
                {isKannada
                  ? "ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್"
                  : "Kannada & English"}
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          WEBSITE INFORMATION FROM SETTINGS
      ================================================== */}

      <section className="about-settings-section">

        <div className="container">

          <div className="about-settings-card">

            <div className="about-settings-header">

              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={
                    settings.siteName ||
                    "Logo"
                  }
                  className="about-settings-logo"
                />
              ) : (
                <div className="about-settings-logo-placeholder">
                  {settings.siteName?.charAt(0) ||
                    "ಸ"}
                </div>
              )}

              <div>

                <span>
                  {isKannada
                    ? "ವೆಬ್‌ಸೈಟ್ ಮಾಹಿತಿ"
                    : "WEBSITE INFORMATION"}
                </span>

                <h2>
                  {settings.siteName ||
                    t.siteName}
                </h2>

                <p>
                  {settings.tagline}
                </p>

              </div>

            </div>


            <div className="about-settings-details">

              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="about-settings-item"
                >
                  <span>✉</span>

                  <div>
                    <small>
                      {isKannada
                        ? "ಇಮೇಲ್"
                        : "EMAIL"}
                    </small>

                    <strong>
                      {settings.email}
                    </strong>
                  </div>
                </a>
              )}


              {settings.phone && (
                <a
                  href={`tel:${settings.phone}`}
                  className="about-settings-item"
                >
                  <span>☎</span>

                  <div>
                    <small>
                      {isKannada
                        ? "ದೂರವಾಣಿ"
                        : "PHONE"}
                    </small>

                    <strong>
                      {settings.phone}
                    </strong>
                  </div>
                </a>
              )}


              {settings.address && (
                <div className="about-settings-item">

                  <span>📍</span>

                  <div>

                    <small>
                      {isKannada
                        ? "ವಿಳಾಸ"
                        : "ADDRESS"}
                    </small>

                    <strong>
                      {settings.address}
                    </strong>

                  </div>

                </div>
              )}

            </div>


            {/* SOCIAL LINKS */}

            {socialLinks.some(
              (social) => social.url
            ) && (
              <div className="about-social-section">

                <h3>
                  {isKannada
                    ? "ನಮ್ಮನ್ನು ಅನುಸರಿಸಿ"
                    : "Follow Us"}
                </h3>

                <div className="about-social-links">

                  {socialLinks.map(
                    (social) =>
                      social.url && (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`about-social-link ${social.className}`}
                        >
                          <span>
                            {social.icon}
                          </span>

                          {social.name}
                        </a>
                      )
                  )}

                </div>

              </div>
            )}

          </div>

        </div>

      </section>


      {/* ==================================================
          CONTACT / SUPPORT
      ================================================== */}

      <section className="about-contact-section">

        <div className="container">

          <div className="about-contact-box">

            <div>

              <span className="about-section-label">
                {text.contactLabel}
              </span>

              <h2>
                {text.contactTitle}
              </h2>

              <p>
                {text.contactText}
              </p>

            </div>

            <Link
              to="/contact"
              className="about-contact-button"
            >
              {text.contactButton}
            </Link>

          </div>

        </div>

      </section>


      {/* ==================================================
          FINAL MESSAGE
      ================================================== */}

      <section className="about-final-section">

        <div className="container">

          <div className="about-final-content">

            {settings.logo ? (
              <div className="about-final-logo-image">

                <img
                  src={settings.logo}
                  alt={
                    settings.siteName ||
                    "Logo"
                  }
                />

              </div>
            ) : (
              <div className="about-final-logo">
                {settings.siteName?.charAt(0) ||
                  "ಸ"}
              </div>
            )}

            <h2>
              {settings.siteName ||
                t.siteName}
            </h2>

            <p>
              {settings.tagline ||
                (
                  isKannada
                    ? "ನಿಮ್ಮ ಧ್ವನಿ – ನಮ್ಮ ಜವಾಬ್ದಾರಿ"
                    : "Your Voice – Our Responsibility"
                )}
            </p>

            <span>
              {text.reliable}
              {" • "}
              {text.responsible}
              {" • "}
              {text.voice}
            </span>

          </div>

        </div>

      </section>

    </main>
  );
}

export default About;