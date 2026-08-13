import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ======================================================
// COMMON / PUBLIC COMPONENTS
// ======================================================

import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ======================================================
// ADMIN COMPONENT
// ======================================================

import AdminNavbar from "./components/AdminNavbar";

// ======================================================
// PUBLIC PAGES
// ======================================================

import Home from "./pages/public/Home";
import News from "./pages/public/News";
import NewsDetails from "./pages/public/NewsDetails";
import Category from "./pages/public/Category";
import Videos from "./pages/public/Videos";
import Gallery from "./pages/public/Gallery";
import Search from "./pages/public/Search";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import MonthlyPaper from "./pages/public/MonthlyPaper";

// ======================================================
// ADMIN PAGES
// ======================================================

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import NewsManage from "./pages/admin/NewsManage";
import NewsAdd from "./pages/admin/NewsAdd";
import NewsEdit from "./pages/admin/NewsEdit";
import CategoryManage from "./pages/admin/CategoryManage";
import MediaManage from "./pages/admin/MediaManage";
import Users from "./pages/admin/Users";
import Settings from "./pages/admin/Settings";
import MonthlyPaperManage from "./pages/admin/MonthlyPaperManage";

// ======================================================
// PUBLIC LAYOUT
// ======================================================

function PublicLayout() {
  return (
    <div className="public-layout">

      {/* ==================================================
          WEBSITE HEADER
      ================================================== */}

      <Header />

      {/* ==================================================
          WEBSITE NAVIGATION
      ================================================== */}

      <Navbar />

      {/* ==================================================
          PUBLIC CONTENT
      ================================================== */}

      <main className="public-main">

        <Routes>

          {/* ==================================================
              HOME
          ================================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* ==================================================
              ALL NEWS
          ================================================== */}

          <Route
            path="/news"
            element={<News />}
          />

          {/* ==================================================
              NEWS DETAILS
          ================================================== */}

          <Route
            path="/news/:id"
            element={<NewsDetails />}
          />

          {/* ==================================================
              CATEGORY
          ================================================== */}

          <Route
            path="/category/:slug"
            element={<Category />}
          />

          {/* ==================================================
              VIDEOS
          ================================================== */}

          <Route
            path="/videos"
            element={<Videos />}
          />

          {/* ==================================================
              GALLERY
          ================================================== */}

          <Route
            path="/gallery"
            element={<Gallery />}
          />

          {/* ==================================================
              SEARCH
          ================================================== */}

          <Route
            path="/search"
            element={<Search />}
          />

          {/* ==================================================
              MONTHLY PAPER
          ================================================== */}

          <Route
            path="/monthly-paper"
            element={<MonthlyPaper />}
          />

          {/* ==================================================
              ABOUT
          ================================================== */}

          <Route
            path="/about"
            element={<About />}
          />

          {/* ==================================================
              CONTACT
          ================================================== */}

          <Route
            path="/contact"
            element={<Contact />}
          />

          {/* ==================================================
              PUBLIC 404
          ================================================== */}

          <Route
            path="*"
            element={<PublicNotFound />}
          />

        </Routes>

      </main>

      {/* ==================================================
          WEBSITE FOOTER
      ================================================== */}

      <Footer />

    </div>
  );
}

// ======================================================
// PUBLIC 404 PAGE
// ======================================================

function PublicNotFound() {
  return (
    <section
      className="app-not-found"
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div>

        <h1
          style={{
            margin: "0 0 10px",
            fontSize: "56px",
            fontWeight: "800",
          }}
        >
          404
        </h1>

        <h2
          style={{
            margin: "0 0 10px",
          }}
        >
          Page Not Found
        </h2>

        <p
          style={{
            margin: "0 0 20px",
            color: "#666",
          }}
        >
          The page you are looking for does not exist.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "10px 18px",
            borderRadius: "5px",
            background: "#b30000",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Go to Home
        </a>

      </div>
    </section>
  );
}

// ======================================================
// ADMIN LAYOUT
// ======================================================

function AdminLayout() {
  return (
    <div className="admin-layout">

      {/* ==================================================
          ADMIN NAVBAR
      ================================================== */}

      <AdminNavbar />

      {/* ==================================================
          ADMIN CONTENT
      ================================================== */}

      <main className="admin-main-content">

        <Routes>

          {/* ==================================================
              ADMIN DASHBOARD
          ================================================== */}

          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* ==================================================
              NEWS MANAGEMENT
          ================================================== */}

          <Route
            path="/news"
            element={<NewsManage />}
          />

          {/* ==================================================
              ADD NEWS
          ================================================== */}

          <Route
            path="/news/add"
            element={<NewsAdd />}
          />

          {/* ==================================================
              EDIT NEWS
          ================================================== */}

          <Route
            path="/news/edit/:id"
            element={<NewsEdit />}
          />

          {/* ==================================================
              CATEGORY MANAGEMENT
          ================================================== */}

          <Route
            path="/categories"
            element={<CategoryManage />}
          />

          {/* ==================================================
              MEDIA MANAGEMENT
          ================================================== */}

          <Route
            path="/media"
            element={<MediaManage />}
          />

          {/* ==================================================
              MONTHLY PAPER MANAGEMENT
          ================================================== */}

          <Route
            path="/monthly-paper"
            element={<MonthlyPaperManage />}
          />

          {/* ==================================================
              USER MANAGEMENT
          ================================================== */}

          <Route
            path="/users"
            element={<Users />}
          />

          {/* ==================================================
              WEBSITE SETTINGS
          ================================================== */}

          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* ==================================================
              ADMIN 404
          ================================================== */}

          <Route
            path="*"
            element={<AdminNotFound />}
          />

        </Routes>

      </main>

    </div>
  );
}

// ======================================================
// ADMIN 404 PAGE
// ======================================================

function AdminNotFound() {
  return (
    <section
      className="admin-not-found"
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        textAlign: "center",
      }}
    >
      <div>

        <h1
          style={{
            margin: "0 0 10px",
            fontSize: "56px",
            fontWeight: "800",
          }}
        >
          404
        </h1>

        <h2
          style={{
            margin: "0 0 10px",
          }}
        >
          Admin Page Not Found
        </h2>

        <p
          style={{
            margin: "0 0 20px",
            color: "#666",
          }}
        >
          The requested admin page does not exist.
        </p>

        <a
          href="/admin"
          style={{
            display: "inline-block",
            padding: "10px 18px",
            borderRadius: "5px",
            background: "#b30000",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Go to Dashboard
        </a>

      </div>
    </section>
  );
}

// ======================================================
// APP
// ======================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================================
            ADMIN LOGIN
        ================================================== */}

        <Route
          path="/admin/login"
          element={<Login />}
        />

        {/* ==================================================
            ADMIN PANEL
        ==================================================
        
            /admin
            /admin/news
            /admin/news/add
            /admin/news/edit/:id
            /admin/categories
            /admin/media
            /admin/monthly-paper
            /admin/users
            /admin/settings
        
        ================================================== */}

        <Route
          path="/admin/*"
          element={<AdminLayout />}
        />

        {/* ==================================================
            PUBLIC WEBSITE
        ==================================================
        
            /
            /news
            /news/:id
            /category/:slug
            /videos
            /gallery
            /search
            /monthly-paper
            /about
            /contact
        
        ================================================== */}

        <Route
          path="/*"
          element={<PublicLayout />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;