import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";

import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { t, language } = useLanguage();

  // =====================================================
  // HANDLE SCROLL
  // =====================================================

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // =====================================================
  // NAVIGATION ITEMS
  // =====================================================

  const navigationItems = [
    // =================================================
    // HOME
    // =================================================

    {
      name: t.home,
      path: "/",
      end: true,
    },

    // =================================================
    // NEWS
    // =================================================

    {
      name:
        language === "kn"
          ? "ಸುದ್ದಿಗಳು"
          : "News",
      path: "/news",
    },

    // =================================================
    // KARNATAKA
    // =================================================

    {
      name: t.karnataka,
      path: "/category/karnataka",
    },

    // =================================================
    // INDIA
    // =================================================

    {
      name: t.india,
      path: "/category/india",
    },

    // =================================================
    // WORLD
    // =================================================

    {
      name: t.world,
      path: "/category/world",
    },

    // =================================================
    // POLITICS
    // =================================================

    {
      name: t.politics,
      path: "/category/politics",
    },

    // =================================================
    // CRIME
    // =================================================

    {
      name: t.crime,
      path: "/category/crime",
    },

    // =================================================
    // SPORTS
    // =================================================

    {
      name: t.sports,
      path: "/category/sports",
    },

    // =================================================
    // CINEMA
    // =================================================

    {
      name: t.cinema,
      path: "/category/cinema",
    },

    // =================================================
    // BUSINESS
    // =================================================

    {
      name: t.business,
      path: "/category/business",
    },

    // =================================================
    // EDUCATION
    // =================================================

    {
      name: t.education,
      path: "/category/education",
    },

    // =================================================
    // VIDEOS
    // =================================================

   

    // =================================================
    // GALLERY
    // =================================================

   

    // =================================================
    // MONTHLY NEWSPAPER
    // =================================================

    {
      name:
        language === "kn"
          ? "ಮಾಸಿಕ ಪತ್ರಿಕೆ"
          : "Monthly Paper",

      path: "/monthly-paper",

      highlight: true,
    },

    // =================================================
    // ABOUT
    // =================================================

   

    // =================================================
    // CONTACT
    // =================================================

  
  ];

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =====================================================
  // TOGGLE MOBILE MENU
  // =====================================================

  const toggleMenu = () => {
    setMenuOpen(
      (previous) => !previous
    );
  };

  // =====================================================
  // SEARCH CLICK
  // =====================================================

  const handleSearchClick = () => {
    closeMenu();
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <nav
      className={`navbar ${
        isScrolled
          ? "navbar-scrolled"
          : ""
      }`}
    >

      <div
        className={`navbar-container ${
          isScrolled
            ? "navbar-container-scrolled"
            : ""
        }`}
      >

        {/* ===============================================
            MOBILE MENU BUTTON
        =============================================== */}

        <button
          type="button"
          className="mobile-menu-button"
          onClick={toggleMenu}
          aria-label={
            menuOpen
              ? (
                  t.closeMenu ||
                  "Close menu"
                )
              : (
                  t.openMenu ||
                  "Open menu"
                )
          }
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          {menuOpen ? "✕" : "☰"}
        </button>


        {/* ===============================================
            NAVIGATION MENU
        =============================================== */}

        <div
          id="main-navigation"
          className={`navbar-menu ${
            menuOpen
              ? "show"
              : ""
          }`}
        >

          {navigationItems.map(
            (item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={
                  item.end || false
                }
                className={({ isActive }) =>
                  `navbar-link ${
                    isActive
                      ? "active"
                      : ""
                  } ${
                    item.highlight
                      ? "navbar-link-highlight"
                      : ""
                  }`
                }
                onClick={closeMenu}
              >

                {/* =====================================
                    NEWSPAPER ICON
                ===================================== */}

                {item.highlight && (
                  <span
                    className="navbar-paper-icon"
                    aria-hidden="true"
                  >
                    📰
                  </span>
                )}

                <span>
                  {item.name}
                </span>

              </NavLink>
            )
          )}

        </div>


        {/* ===============================================
            SEARCH
        =============================================== */}

        <Link
          to="/search"
          className="search-link"
          aria-label={
            t.search ||
            "Search"
          }
          title={
            t.search ||
            "Search"
          }
          onClick={
            handleSearchClick
          }
        >
          <span
            className="search-icon"
            aria-hidden="true"
          >
            🔍
          </span>
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;