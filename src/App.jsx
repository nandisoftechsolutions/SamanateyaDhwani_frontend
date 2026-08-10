import { BrowserRouter, Routes, Route } from "react-router-dom";

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
              DASHBOARD
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

        </Routes>

      </main>

    </div>
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
        ================================================== */}

        <Route
          path="/admin/*"
          element={<AdminLayout />}
        />

        {/* ==================================================
            PUBLIC WEBSITE
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