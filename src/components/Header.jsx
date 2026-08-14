import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { getSettings } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

import "./Header.css";

function Header() {
  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  // =====================================================
  // WEBSITE SETTINGS
  // =====================================================

  const [settings, setSettings] = useState({
    siteName: "ಸಮಾನತೆಯ ಧ್ವನಿ",
    tagline: "ನಿಮ್ಮ ಧ್ವನಿ – ನಮ್ಮ ಜವಾಬ್ದಾರಿ",

    email: "",
    phone: "",
    address: "",

    youtube: "",
    facebook: "",
    instagram: "",
    x: "",
    whatsapp: "",
    telegram: "",

    logo: "",
  });

  // =====================================================
  // LOAD WEBSITE SETTINGS
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const response = await getSettings();

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
          "Header settings error:",
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
  // YOUTUBE ICON
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

  // =====================================================
  // FACEBOOK ICON
  // =====================================================

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

  // =====================================================
  // INSTAGRAM ICON
  // =====================================================

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

  // =====================================================
  // X ICON
  // =====================================================

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

  // =====================================================
  // WHATSAPP ICON
  // =====================================================

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

  // =====================================================
  // TELEGRAM ICON
  // =====================================================

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
  // WHATSAPP NUMBER
  // =====================================================

  const cleanPhone = settings.phone
    ? String(settings.phone).replace(/\D/g, "")
    : "";

  // =====================================================
  // SOCIAL MEDIA LINKS
  // =====================================================

  const socialItems = [
    {
      name: "YouTube",
      url: settings.youtube,
      icon: <YouTubeIcon />,
      className: "youtube",
    },

    {
      name: "Facebook",
      url: settings.facebook,
      icon: <FacebookIcon />,
      className: "facebook",
    },

    {
      name: "Instagram",
      url: settings.instagram,
      icon: <InstagramIcon />,
      className: "instagram",
    },

    {
      name: "X",
      url: settings.x,
      icon: <XIcon />,
      className: "x",
    },

    {
      name: "WhatsApp",
      url:
        settings.whatsapp ||
        (cleanPhone
          ? `https://wa.me/${cleanPhone}`
          : ""),
      icon: <WhatsAppIcon />,
      className: "whatsapp",
    },

    {
      name: "Telegram",
      url: settings.telegram,
      icon: <TelegramIcon />,
      className: "telegram",
    },
  ];

  // =====================================================
  // ONLY AVAILABLE SOCIAL LINKS
  // =====================================================

  const availableSocialItems =
    socialItems.filter(
      (social) =>
        social.url &&
        String(social.url).trim() !== ""
    );

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigationItems = [
    {
      path: "/",
      name:
        language === "kn"
          ? "ಮುಖಪುಟ"
          : "Home",
      end: true,
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
      name:
        language === "kn"
          ? "ವಿಡಿಯೋ"
          : "Videos",
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
      name:
        language === "kn"
          ? "ಮಾಸಿಕ ಪತ್ರಿಕೆ"
          : "Monthly Paper",
    },

    {
      path: "/about",
      name:
        language === "kn"
          ? "ನಮ್ಮ ಬಗ್ಗೆ"
          : "About",
    },

    {
      path: "/contact",
      name:
        language === "kn"
          ? "ಸಂಪರ್ಕಿಸಿ"
          : "Contact",
    },
  ];

  // =====================================================
  // TODAY'S NEWS
  // =====================================================

  const todayNews =
    t.todayNews ||
    (
      language === "kn"
        ? "ಇಂದಿನ ಸುದ್ದಿ"
        : "Today's News"
    );

  // =====================================================
  // TAGLINE
  // FROM ADMIN SETTINGS
  // =====================================================

  const tagline =
    settings.tagline ||
    (
      language === "kn"
        ? "ನಿಮ್ಮ ಧ್ವನಿ – ನಮ್ಮ ಜವಾಬ್ದಾರಿ"
        : "Your Voice – Our Responsibility"
    );

  // =====================================================
  // REGISTRATION NUMBER
  // =====================================================

  const registrationNumber =
    "DRVJ/ISOR/223/2026-2027";

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <header className="site-header">

      {/* =================================================
          REGISTRATION NUMBER
          TOP RIGHT
      ================================================= */}

      <div
        className="header-registration-number"
        aria-label="Registration Number"
      >
        <span className="registration-label">
          Reg. No.:
        </span>

        <span className="registration-value">
          {registrationNumber}
        </span>
      </div>


      {/* =================================================
          TOP HEADER
      ================================================= */}

      <div className="header-container">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="header-left">

          <Link
            to="/"
            className="header-logo-link"
            aria-label={
              settings.siteName ||
              "ಸಮಾನತೆಯ ಧ್ವನಿ"
            }
          >

            {settings.logo ? (
              <img
                src={settings.logo}
                alt={
                  settings.siteName ||
                  "ಸಮಾನತೆಯ ಧ್ವನಿ Logo"
                }
                className="header-logo-image"
              />
            ) : (
              <span className="header-logo-fallback">
                ಸ
              </span>
            )}

          </Link>

          {/* Today's News */}

          <span className="header-date">
            {todayNews}
          </span>

        </div>


        {/* =================================================
            CENTER BRAND
        ================================================= */}

        <div className="header-brand">

          <Link
            to="/"
            className="header-brand-link"
            aria-label={
              settings.siteName ||
              "ಸಮಾನತೆಯ ಧ್ವನಿ"
            }
          >

            {/* =========================================
                BRAND NAME
            ========================================= */}

            <span className="brand-name">
              {settings.siteName ||
                "ಸಮಾನತೆಯ ಧ್ವನಿ"}
            </span>

            {/* =========================================
                TAGLINE / SUB HEADING
            ========================================= */}

            <span className="brand-tagline">
              {tagline}
            </span>

          </Link>

        </div>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="header-right">

          {/* =================================================
              SOCIAL MEDIA
          ================================================= */}

          {availableSocialItems.length > 0 && (
            <div
              className="header-socials"
              aria-label="Social media links"
            >

              {availableSocialItems.map(
                (social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`header-social-link social-${social.className}`}
                    aria-label={social.name}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                )
              )}

            </div>
          )}


          {/* =================================================
              LANGUAGE SWITCHER
          ================================================= */}

          <div
            className="language-switcher"
            aria-label="Language selection"
          >

            <button
              type="button"
              className={
                language === "kn"
                  ? "language-button active"
                  : "language-button"
              }
              onClick={() =>
                setLanguage("kn")
              }
            >
              ಕನ್ನಡ
            </button>

            <span className="language-divider">
              |
            </span>

            <button
              type="button"
              className={
                language === "en"
                  ? "language-button active"
                  : "language-button"
              }
              onClick={() =>
                setLanguage("en")
              }
            >
              English
            </button>

          </div>

        </div>

      </div>


      {/* =================================================
          NAVIGATION BAR
      ================================================= */}

      <nav
        className="header-bottom"
        aria-label="Main navigation"
      >

        <div className="header-bottom-inner">

          {navigationItems.map(
            (item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end || false}
                className={({ isActive }) =>
                  `header-nav-link ${
                    isActive
                      ? "active"
                      : ""
                  }`
                }
              >
                {item.name}
              </NavLink>
            )
          )}

        </div>

      </nav>

    </header>
  );
}

export default Header;