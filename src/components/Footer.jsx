import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";
import { getSettings } from "../services/api";

import "./Footer.css";


function Footer() {

  const currentYear = new Date().getFullYear();

  const {
    t,
    language,
  } = useLanguage();


  // =====================================================
  // WEBSITE SETTINGS
  // =====================================================

  const [settings, setSettings] = useState({
    siteName: "ಸಮಾನತೆಯ ಧ್ವನಿ",
    tagline: "ನಿಮ್ಮ ಧ್ವನಿ - ನಮ್ಮ ಜವಾಬ್ದಾರಿ",
    description: "",
    email: "",
    phone: "",
    address: "ವಿಜಯಪುರ, ಕರ್ನಾಟಕ",
    logo: "",
    youtube: "",
    facebook: "",
    instagram: "",
    x: "",
    whatsapp: "",
    telegram: "",
  });


  // =====================================================
  // LOAD SETTINGS
  // =====================================================

  useEffect(() => {

    let mounted = true;


    const loadSettings = async () => {

      try {

        const response =
          await getSettings();


        const data =
          response?.settings ||
          response?.data ||
          response ||
          {};


        if (mounted) {

          setSettings((previous) => ({
            ...previous,
            ...data,
          }));

        }

      } catch (error) {

        console.error(
          "Footer settings error:",
          error
        );

      }

    };


    loadSettings();


    return () => {
      mounted = false;
    };

  }, []);


  // =====================================================
  // LANGUAGE TEXT
  // =====================================================

  const text = {

    quickLinks:
      language === "kn"
        ? "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು"
        : "Quick Links",

    categories:
      language === "kn"
        ? "ವಿಭಾಗಗಳು"
        : "Categories",

    special:
      language === "kn"
        ? "ವಿಶೇಷ"
        : "Special",

    followUs:
      language === "kn"
        ? "ನಮ್ಮನ್ನು ಅನುಸರಿಸಿ"
        : "Follow Us",

    monthlyPaper:
      language === "kn"
        ? "ಮಾಸಿಕ ಪತ್ರಿಕೆ"
        : "Monthly Paper",

    adminLogin:
      language === "kn"
        ? "ಅಡ್ಮಿನ್ ಲಾಗಿನ್"
        : "Admin Login",

    contactUs:
      language === "kn"
        ? "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ"
        : "Contact Us",

    readPaper:
      language === "kn"
        ? "ಪತ್ರಿಕೆ ಓದಿ"
        : "Read Newspaper",

    search:
      language === "kn"
        ? "ಹುಡುಕಿ"
        : "Search",

    privacy:
      language === "kn"
        ? "ಗೌಪ್ಯತಾ ನೀತಿ"
        : "Privacy Policy",

    terms:
      language === "kn"
        ? "ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು"
        : "Terms & Conditions",

    developedBy:
      language === "kn"
        ? "ಅಭಿವೃದ್ಧಿಪಡಿಸಿದವರು"
        : "Developed by",

    developer:
      language === "kn"
        ? "ಡೆವಲಪರ್"
        : "Developer",

    location:
      language === "kn"
        ? "ವಿಜಯಪುರ, ಕರ್ನಾಟಕ"
        : "Vijayapura, Karnataka",

    newsChannel:
      language === "kn"
        ? "ಸುದ್ದಿ ವಾಹಿನಿ"
        : "NEWS CHANNEL",

    allRights:
      language === "kn"
        ? "ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ."
        : "All rights reserved.",

    monthlyPaperTitle:
      language === "kn"
        ? "ಸಮರ ಧ್ವನಿ"
        : "Samara Dhwani",

    monthlyPaperSubtitle:
      language === "kn"
        ? "ಮಾಸಿಕ ಪತ್ರಿಕೆ"
        : "Monthly Newspaper",

  };


  // =====================================================
  // DESCRIPTION
  // =====================================================

  const footerDescription =
    settings.description ||
    t.footerDescription ||
    (
      language === "kn"
        ? "ಸಮಾನತೆಯ ಧ್ವನಿ ಸುದ್ದಿ ವಾಹಿನಿ ಜನರ ಧ್ವನಿಯನ್ನು ಜನರಿಗೆ ತಲುಪಿಸುವ ವಿಶ್ವಾಸಾರ್ಹ ಡಿಜಿಟಲ್ ಸುದ್ದಿ ವೇದಿಕೆಯಾಗಿದೆ."
        : "Samanateya Dhwani is a digital news platform committed to delivering reliable news and giving people a voice."
    );


  // =====================================================
  // PHONE
  // =====================================================

  const cleanPhone = settings.phone
    ? String(settings.phone).replace(
        /\D/g,
        ""
      )
    : "";


  // =====================================================
  // SOCIAL ICONS
  // =====================================================

  const YouTubeIcon = () => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.8V8.2l6.5 3.8-6.5 3.8Z"
      />
    </svg>
  );


  const FacebookIcon = () => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V10H8v3h2.6v8h2.9Z"
      />
    </svg>
  );


  const InstagramIcon = () => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >

      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1"
        fill="currentColor"
      />

    </svg>
  );


  const XIcon = () => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M18.9 2H22l-6.8 7.8L23.2 22h-6.2l-4.9-6.1L6.8 22H3.7l7.2-8.2L3 2h6.3l4.4 5.5L18.9 2Zm-1.1 17.8h1.7L8.5 4.1H6.7l11.1 15.7Z"
      />
    </svg>
  );


  const WhatsAppIcon = () => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.3-.7-1.5-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7 1-.1.2-.3.2-.5.1-1.3-.7-2.2-1.3-3.1-2.9-.2-.3.2-.3.6-1.1.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.5-.4h-.4c-.1 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 1.6.6 2.1.5 2.8.4.5-.1 1.3-.5 1.5-1 .2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z"
      />
    </svg>
  );


  const TelegramIcon = () => (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M21.8 3.4 18.5 20c-.3 1.2-1 1.5-2 .9l-5.5-4-2.7 2.6c-.3.3-.5.5-1 .5l.4-5.6L18 5.2c.4-.4-.1-.6-.6-.2L5.5 12.5 0 10.8c-1.2-.4-1.2-1.2.3-1.7L21 1.2c1-.4 1.9.2.8 2.2Z"
      />
    </svg>
  );


  // =====================================================
  // SOCIAL LINKS
  // =====================================================

  const socialLinks = [

    {
      name: "YouTube",
      url: settings.youtube,
      className: "youtube",
      icon: <YouTubeIcon />,
    },

    {
      name: "Facebook",
      url: settings.facebook,
      className: "facebook",
      icon: <FacebookIcon />,
    },

    {
      name: "Instagram",
      url: settings.instagram,
      className: "instagram",
      icon: <InstagramIcon />,
    },

    {
      name: "X",
      url: settings.x,
      className: "x",
      icon: <XIcon />,
    },

    {
      name: "WhatsApp",
      url:
        settings.whatsapp ||
        (
          cleanPhone
            ? `https://wa.me/${cleanPhone}`
            : ""
        ),
      className: "whatsapp",
      icon: <WhatsAppIcon />,
    },

    {
      name: "Telegram",
      url: settings.telegram,
      className: "telegram",
      icon: <TelegramIcon />,
    },

  ].filter(
    (social) => social.url
  );


  // =====================================================
  // QUICK LINKS
  // =====================================================

  const quickLinks = [

    {
      path: "/",
      name: t.home,
    },

    {
      path: "/news",
      name:
        language === "kn"
          ? "ಸುದ್ದಿಗಳು"
          : "News",
    },

    {
      path: "/videos",
      name: t.videos,
    },

    {
      path: "/gallery",
      name:
        language === "kn"
          ? "ಗ್ಯಾಲರಿ"
          : "Gallery",
    },

    {
      path: "/monthly-paper",
      name: text.monthlyPaper,
    },

    {
      path: "/search",
      name: text.search,
    },

    {
      path: "/about",
      name: t.about,
    },

    {
      path: "/contact",
      name: t.contact,
    },

  ];


  // =====================================================
  // CATEGORY LINKS
  // =====================================================

  const categoryLinks = [

    {
      path: "/category/karnataka",
      name: t.karnataka,
    },

    {
      path: "/category/india",
      name: t.india,
    },

    {
      path: "/category/world",
      name: t.world,
    },

    {
      path: "/category/politics",
      name: t.politics,
    },

    {
      path: "/category/crime",
      name: t.crime,
    },

    {
      path: "/category/sports",
      name: t.sports,
    },

    {
      path: "/category/cinema",
      name: t.cinema,
    },

    {
      path: "/category/business",
      name: t.business,
    },

    {
      path: "/category/education",
      name: t.education,
    },

  ];


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <footer className="footer">

      {/* =================================================
          TOP LINE
      ================================================= */}

      <div className="footer-top-line"></div>


      {/* =================================================
          MAIN FOOTER
      ================================================= */}

      <div className="footer-container">

        <div className="footer-content">


          {/* =================================================
              BRAND
          ================================================= */}

          <div className="footer-section footer-about">

            <Link
              to="/"
              className="footer-brand"
            >

              {settings.logo ? (

                <span className="footer-brand-logo image-logo">

                  <img
                    src={settings.logo}
                    alt={
                      settings.siteName ||
                      "Logo"
                    }
                  />

                </span>

              ) : (

                <span className="footer-brand-logo">
                  ಸ
                </span>

              )}


              <span className="footer-brand-text">

                <strong>
                  {settings.siteName ||
                    "ಸಮಾನತೆಯ ಧ್ವನಿ"}
                </strong>

                <small>
                  {settings.tagline ||
                    text.newsChannel}
                </small>

              </span>

            </Link>


            <p className="footer-description">
              {footerDescription}
            </p>


            {/* TAGLINE */}

            <div className="footer-tagline">
              {settings.tagline ||
                "ನಿಮ್ಮ ಧ್ವನಿ - ನಮ್ಮ ಜವಾಬ್ದಾರಿ"}
            </div>


            {/* SOCIAL */}

            {socialLinks.length > 0 && (

              <div
                className="footer-social"
                aria-label={text.followUs}
              >

                {socialLinks.map(
                  (social) => (

                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`footer-social-link ${social.className}`}
                      aria-label={social.name}
                      title={social.name}
                    >
                      {social.icon}
                    </a>

                  )
                )}

              </div>

            )}

          </div>


          {/* =================================================
              QUICK LINKS
          ================================================= */}

          <div className="footer-section">

            <h4>
              {text.quickLinks}
            </h4>

            <div className="footer-link-list">

              {quickLinks.map(
                (item) => (

                  <Link
                    key={item.path}
                    to={item.path}
                  >

                    <span>›</span>

                    {item.name}

                  </Link>

                )
              )}

            </div>

          </div>


          {/* =================================================
              CATEGORIES
          ================================================= */}

          <div className="footer-section">

            <h4>
              {text.categories}
            </h4>

            <div className="footer-link-list">

              {categoryLinks.map(
                (item) => (

                  <Link
                    key={item.path}
                    to={item.path}
                  >

                    <span>›</span>

                    {item.name}

                  </Link>

                )
              )}

            </div>

          </div>


          {/* =================================================
              SPECIAL
          ================================================= */}

          <div className="footer-section footer-special">

            <h4>
              {text.special}
            </h4>


            {/* MONTHLY PAPER */}

            <Link
              to="/monthly-paper"
              className="footer-special-card"
            >

              <span className="footer-special-icon">
                📰
              </span>

              <span>

                <strong>
                  {text.monthlyPaper}
                </strong>

                <small>
                  {text.readPaper}
                </small>

              </span>

              <span className="footer-card-arrow">
                →
              </span>

            </Link>


            {/* ADMIN */}

            <Link
              to="/admin/login"
              className="footer-special-card"
            >

              <span className="footer-special-icon">
                🔐
              </span>

              <span>

                <strong>
                  {text.adminLogin}
                </strong>

                <small>
                  Dashboard Access
                </small>

              </span>

              <span className="footer-card-arrow">
                →
              </span>

            </Link>


            {/* CONTACT */}

            <Link
              to="/contact"
              className="footer-special-card"
            >

              <span className="footer-special-icon">
                ✉
              </span>

              <span>

                <strong>
                  {text.contactUs}
                </strong>

                <small>
                  {settings.email ||
                    settings.phone ||
                    "Contact Information"}
                </small>

              </span>

              <span className="footer-card-arrow">
                →
              </span>

            </Link>


            {/* PAPER INFO */}

            <div className="footer-paper-info">

              <span className="footer-paper-info-icon">
                🗞️
              </span>

              <div>

                <strong>
                  {text.monthlyPaperTitle}
                </strong>

                <small>
                  {text.monthlyPaperSubtitle}
                </small>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            CONTACT STRIP
        ================================================= */}

        <div className="footer-contact-strip">


          <div className="footer-contact-item">

            <span>✉</span>

            <div>

              <small>
                Email
              </small>

              <strong>
                {settings.email ||
                  "Email not available"}
              </strong>

            </div>

          </div>


          <div className="footer-contact-item">

            <span>☎</span>

            <div>

              <small>
                {language === "kn"
                  ? "ದೂರವಾಣಿ"
                  : "Phone"}
              </small>

              <strong>
                {settings.phone ||
                  "Phone not available"}
              </strong>

            </div>

          </div>


          <div className="footer-contact-item">

            <span>📍</span>

            <div>

              <small>
                {language === "kn"
                  ? "ವಿಳಾಸ"
                  : "Address"}
              </small>

              <strong>
                {settings.address ||
                  text.location}
              </strong>

            </div>

          </div>


        </div>


        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="footer-divider"></div>


        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="footer-bottom">


          <div className="footer-copyright">

            <p>

              © {currentYear}{" "}

              <strong>
                {settings.siteName ||
                  t.siteName ||
                  "ಸಮಾನತೆಯ ಧ್ವನಿ"}
              </strong>

              {" "}

              {t.allRightsReserved ||
                text.allRights}

            </p>

          </div>


          <div className="footer-bottom-links">

            <Link to="/privacy">
              {t.privacyPolicy ||
                text.privacy}
            </Link>

            <span>|</span>

            <Link to="/terms">
              {t.termsConditions ||
                text.terms}
            </Link>

            <span>|</span>

            <Link to="/admin/login">
              {text.adminLogin}
            </Link>

          </div>

        </div>


        {/* =================================================
            DEVELOPER
        ================================================= */}

        <div className="footer-developer">

          <span>
            {text.developedBy}
          </span>

          <strong>
            Nandi Softech Solutions
          </strong>

          <span className="developer-separator">
            •
          </span>

          <span>
            {text.developer}
          </span>

          <strong>
            Arjun Nandi
          </strong>

        </div>


        {/* =================================================
            LOCATION
        ================================================= */}

        <div className="footer-location">

          <span>
            {settings.siteName ||
              "ಸಮಾನತೆಯ ಧ್ವನಿ"}
          </span>

          <span className="footer-credit-dot">
            •
          </span>

          <span>
            {text.location}
          </span>

        </div>

      </div>

    </footer>

  );

}


export default Footer;