import React, { useState } from "react";
import {
  NavLink,
  Link,
  useNavigate,
} from "react-router-dom";

import "./AdminNavbar.css";

function AdminNavbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const navigate = useNavigate();

  // ======================================================
  // ADMIN NAVIGATION
  // ======================================================

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: "📊",
      end: true,
    },
    {
      name: "News",
      path: "/admin/news",
      icon: "📰",
    },
    {
      name: "Add News",
      path: "/admin/news/add",
      icon: "➕",
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: "📂",
    },
    {
      name: "Media",
      path: "/admin/media",
      icon: "🎬",
    },
    {
      name: "Monthly Paper",
      path: "/admin/monthly-paper",
      icon: "🗞️",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "👥",
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: "⚙️",
    },
  ];

  // ======================================================
  // CLOSE MOBILE MENU
  // ======================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    const confirmed =
      window.confirm(
        "ನೀವು Admin Dashboard ನಿಂದ Logout ಆಗಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?"
      );

    if (!confirmed) {
      return;
    }

    // Remove possible authentication tokens

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "authToken"
    );

    localStorage.removeItem(
      "admin"
    );

    localStorage.removeItem(
      "adminUser"
    );

    closeMenu();

    navigate(
      "/admin/login",
      {
        replace: true,
      }
    );
  };

  return (
    <header className="admin-navbar">

      {/* ==================================================
          TOP BAR
      ================================================== */}

      <div className="admin-navbar-top">

        {/* BRAND */}

        <Link
          to="/admin"
          className="admin-navbar-brand"
          onClick={closeMenu}
        >

          <div className="admin-brand-logo">
            ಸ
          </div>

          <div className="admin-brand-text">

            <strong>
              ಸಮಾನತೆಯ ಧ್ವನಿ
            </strong>

            <span>
              ADMIN PANEL
            </span>

          </div>

        </Link>

        {/* MOBILE BUTTON */}

        <button
          type="button"
          className="admin-mobile-button"
          onClick={() =>
            setMenuOpen(
              (previous) =>
                !previous
            )
          }
          aria-label={
            menuOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={
            menuOpen
          }
        >
          {menuOpen
            ? "✕"
            : "☰"}
        </button>

        {/* RIGHT SIDE */}

        <div className="admin-navbar-actions">

          <Link
            to="/"
            className="admin-view-site"
          >
            🌐
            <span>
              View Website
            </span>
          </Link>

          <button
            type="button"
            className="admin-logout-button"
            onClick={
              handleLogout
            }
          >
            🚪
            <span>
              Logout
            </span>
          </button>

        </div>

      </div>

      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <div
        className={`admin-navbar-menu ${
          menuOpen
            ? "show"
            : ""
        }`}
      >

        <div className="admin-navbar-menu-inner">

          {/* SECTION LABEL */}

          <div className="admin-menu-label">
            ADMINISTRATION
          </div>

          {/* NAV ITEMS */}

          <nav className="admin-navigation">

            {navigationItems.map(
              (item) => (
                <NavLink
                  key={
                    item.path
                  }
                  to={
                    item.path
                  }
                  end={
                    item.end ||
                    false
                  }
                  className={({
                    isActive,
                  }) =>
                    `admin-nav-link ${
                      isActive
                        ? "active"
                        : ""
                    }`
                  }
                  onClick={
                    closeMenu
                  }
                >

                  <span className="admin-nav-icon">
                    {item.icon}
                  </span>

                  <span className="admin-nav-name">
                    {item.name}
                  </span>

                </NavLink>
              )
            )}

          </nav>

          {/* MOBILE ACTIONS */}

          <div className="admin-mobile-actions">

            <Link
              to="/"
              className="admin-mobile-site-link"
              onClick={
                closeMenu
              }
            >
              🌐 View Website
            </Link>

            <button
              type="button"
              className="admin-mobile-logout"
              onClick={
                handleLogout
              }
            >
              🚪 Logout
            </button>

          </div>

        </div>

      </div>

    </header>
  );
}

export default AdminNavbar;