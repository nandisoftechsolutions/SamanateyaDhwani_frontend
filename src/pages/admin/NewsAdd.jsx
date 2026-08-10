import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  addNews,
  uploadMedia,
} from "../../services/api";

import { useLanguage } from "../../context/LanguageContext";

import "./NewsAdd.css";

function NewsAdd() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // ==================================================
  // FORM DATA
  // ==================================================

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    content: "",
    author: "",
    status: "Draft",
    featured: false,
    breakingNews: false,

    // Link opened when the image / play button is clicked
    externalLink: "",

    // Social media links
    socialLinks: {
      youtube: "",
      facebook: "",
      instagram: "",
      x: "",
      whatsapp: "",
      telegram: "",
    },

    state: "",
    district: "",
    taluk: "",
    village: "",
  });

  // ==================================================
  // IMAGE
  // ==================================================

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // ==================================================
  // UI
  // ==================================================

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // ==================================================
  // CATEGORIES
  // ==================================================

  const categories = [
    {
      key: "karnataka",
      name: "ಕರ್ನಾಟಕ",
    },
    {
      key: "india",
      name: "ಭಾರತ",
    },
    {
      key: "world",
      name: "ವಿಶ್ವ",
    },
    {
      key: "politics",
      name: "ರಾಜಕೀಯ",
    },
    {
      key: "crime",
      name: "ಅಪರಾಧ",
    },
    {
      key: "sports",
      name: "ಕ್ರೀಡೆ",
    },
    {
      key: "cinema",
      name: "ಸಿನಿಮಾ",
    },
    {
      key: "business",
      name: "ವ್ಯಾಪಾರ",
    },
    {
      key: "education",
      name: "ಶಿಕ್ಷಣ",
    },
  ];

  // ==================================================
  // LOCATION DATA
  // ==================================================

  const locationData = {
    Karnataka: {
      Vijayapura: {
        Vijayapura: [
          "Vijayapura",
          "Gunaki",
          "Tikota",
          "Babaleshwar",
          "Basavana Bagewadi",
        ],

        Indi: [
          "Indi",
          "Chadachan",
          "Devar Hippargi",
          "Zalaki",
        ],

        Sindagi: [
          "Sindagi",
          "Almel",
          "Devar Hippargi",
        ],

        Muddebihal: [
          "Muddebihal",
          "Talakawad",
          "Huvina Hippargi",
        ],

        BasavanaBagewadi: [
          "Basavana Bagewadi",
          "Managuli",
          "Almatti",
        ],
      },

      BengaluruUrban: {
        BengaluruNorth: [
          "Yelahanka",
          "Jakkur",
          "Doddaballapur",
        ],

        BengaluruSouth: [
          "Jigani",
          "Begur",
          "Bannerghatta",
        ],
      },

      Belagavi: {
        Belagavi: [
          "Belagavi",
          "Kakati",
          "Udyambag",
        ],

        Athani: [
          "Athani",
          "Kagwad",
          "Ugar",
        ],
      },

      Bagalkot: {
        Bagalkot: [
          "Bagalkot",
          "Navanagar",
        ],

        Jamkhandi: [
          "Jamkhandi",
          "Savalagi",
        ],
      },
    },

    Maharashtra: {
      Mumbai: {
        Mumbai: [
          "Mumbai",
          "Andheri",
          "Borivali",
        ],
      },

      Pune: {
        Pune: [
          "Pune",
          "Hinjewadi",
          "Kothrud",
        ],
      },
    },

    Telangana: {
      Hyderabad: {
        Hyderabad: [
          "Hyderabad",
          "Secunderabad",
        ],
      },
    },

    TamilNadu: {
      Chennai: {
        Chennai: [
          "Chennai",
          "Tambaram",
        ],
      },
    },

    AndhraPradesh: {
      Vijayawada: {
        Vijayawada: [
          "Vijayawada",
          "Gannavaram",
        ],
      },
    },
  };

  // ==================================================
  // LOCATION OPTIONS
  // ==================================================

  const states = Object.keys(locationData);

  const districts = formData.state
    ? Object.keys(
        locationData[formData.state] || {}
      )
    : [];

  const taluks =
    formData.state &&
    formData.district
      ? Object.keys(
          locationData[
            formData.state
          ]?.[formData.district] || {}
        )
      : [];

  const villages =
    formData.state &&
    formData.district &&
    formData.taluk
      ? locationData[
          formData.state
        ]?.[formData.district]?.[
          formData.taluk
        ] || []
      : [];

  // ==================================================
  // CLEAN IMAGE PREVIEW
  // ==================================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ==================================================
  // HANDLE NORMAL INPUT
  // ==================================================

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setMessage("");
    setError("");
  };

  // ==================================================
  // STATE CHANGE
  // ==================================================

  const handleStateChange = (event) => {
    const value =
      event.target.value;

    setFormData((previous) => ({
      ...previous,
      state: value,
      district: "",
      taluk: "",
      village: "",
    }));

    setMessage("");
    setError("");
  };

  // ==================================================
  // DISTRICT CHANGE
  // ==================================================

  const handleDistrictChange = (event) => {
    const value =
      event.target.value;

    setFormData((previous) => ({
      ...previous,
      district: value,
      taluk: "",
      village: "",
    }));

    setMessage("");
    setError("");
  };

  // ==================================================
  // TALUK CHANGE
  // ==================================================

  const handleTalukChange = (event) => {
    const value =
      event.target.value;

    setFormData((previous) => ({
      ...previous,
      taluk: value,
      village: "",
    }));

    setMessage("");
    setError("");
  };

  // ==================================================
  // VILLAGE CHANGE
  // ==================================================

  const handleVillageChange = (event) => {
    const value =
      event.target.value;

    setFormData((previous) => ({
      ...previous,
      village: value,
    }));

    setMessage("");
    setError("");
  };

  // ==================================================
  // LINK HELPERS
  // ==================================================

  const normalizeUrl = (value) => {
    const trimmed = value.trim();

    if (!trimmed) return "";

    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    return `https://${trimmed}`;
  };

  const isValidUrl = (value) => {
    if (!value.trim()) return true;

    try {
      const url = new URL(normalizeUrl(value));
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (error) {
      return false;
    }
  };

  const handleExternalLinkChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      externalLink: event.target.value,
    }));
    setMessage("");
    setError("");
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((previous) => ({
      ...previous,
      socialLinks: {
        ...previous.socialLinks,
        [platform]: value,
      },
    }));
    setMessage("");
    setError("");
  };

  // ==================================================
  // IMAGE CHANGE
  // ==================================================

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      setError(
        "ದಯವಿಟ್ಟು image file ಮಾತ್ರ ಆಯ್ಕೆಮಾಡಿ."
      );

      event.target.value = "";

      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setError(
        "ಚಿತ್ರದ ಗಾತ್ರ 10MB ಗಿಂತ ಕಡಿಮೆ ಇರಬೇಕು."
      );

      event.target.value = "";

      return;
    }

    setImage(file);

    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    const preview =
      URL.createObjectURL(file);

    setImagePreview(preview);

    setMessage("");
    setError("");
  };

  // ==================================================
  // CREATE SLUG
  // ==================================================

  const createSlug = (title) => {
    return title
      .trim()
      .toLowerCase()
      .normalize("NFKC")
      .replace(
        /[^\p{L}\p{N}\s-]/gu,
        ""
      )
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // Get Publish / Draft
    const status =
      event.nativeEvent?.submitter
        ?.value || "Draft";

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!formData.title.trim()) {
      setError(
        "ದಯವಿಟ್ಟು ಸುದ್ದಿ ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ."
      );
      return;
    }

    if (!formData.category) {
      setError(
        "ದಯವಿಟ್ಟು ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ."
      );
      return;
    }

    if (!formData.content.trim()) {
      setError(
        "ದಯವಿಟ್ಟು ಸುದ್ದಿ ವಿಷಯವನ್ನು ನಮೂದಿಸಿ."
      );
      return;
    }

    if (!isValidUrl(formData.externalLink)) {
      setError(
        "ದಯವಿಟ್ಟು ಸರಿಯಾದ ಚಿತ್ರ / Play Button ಲಿಂಕ್ ನಮೂದಿಸಿ."
      );
      return;
    }

    const socialPlatforms = [
      ["youtube", "YouTube"],
      ["facebook", "Facebook"],
      ["instagram", "Instagram"],
      ["x", "X / Twitter"],
      ["whatsapp", "WhatsApp"],
      ["telegram", "Telegram"],
    ];

    for (const [platform, label] of socialPlatforms) {
      if (!isValidUrl(formData.socialLinks[platform])) {
        setError(
          `ದಯವಿಟ್ಟು ಸರಿಯಾದ ${label} ಲಿಂಕ್ ನಮೂದಿಸಿ.`
        );
        return;
      }
    }

    if (!formData.state.trim()) {
      setError(
        "ದಯವಿಟ್ಟು ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ನಮೂದಿಸಿ."
      );
      return;
    }

    if (!formData.district.trim()) {
      setError(
        "ದಯವಿಟ್ಟು ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ನಮೂದಿಸಿ."
      );
      return;
    }

    if (!formData.taluk.trim()) {
      setError(
        "ದಯವಿಟ್ಟು ತಾಲೂಕು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ನಮೂದಿಸಿ."
      );
      return;
    }

    if (!formData.village.trim()) {
      setError(
        "ದಯವಿಟ್ಟು ಗ್ರಾಮ / ಸ್ಥಳದ ಹೆಸರು ನಮೂದಿಸಿ."
      );
      return;
    }

    try {
      setSaving(true);

      // ==================================================
      // IMAGE UPLOAD
      // ==================================================

      let imageUrl = "";
      let imagePublicId = "";

      if (image) {
        const mediaFormData =
          new FormData();

        mediaFormData.append(
          "file",
          image
        );

        const mediaResponse =
          await uploadMedia(
            mediaFormData
          );

        const uploadedMedia =
          mediaResponse?.media;

        if (!uploadedMedia) {
          throw new Error(
            "ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ ವಿಫಲವಾಗಿದೆ."
          );
        }

        imageUrl =
          uploadedMedia.url || "";

        imagePublicId =
          uploadedMedia.publicId || "";
      }

      // ==================================================
      // LOCATION
      // ==================================================

      const location = {
        state:
          formData.state.trim(),

        district:
          formData.district.trim(),

        taluk:
          formData.taluk.trim(),

        village:
          formData.village.trim(),
      };

      // ==================================================
      // NEWS DATA
      // ==================================================

      const newsData = {
        // Kannada is the only language entered by admin.
        // English translation is generated automatically on the public side.
        title:
          formData.title.trim(),

        slug:
          createSlug(
            formData.title
          ),

        description:
          formData.description.trim(),

        category:
          formData.category,

        content:
          formData.content.trim(),

        author:
          formData.author.trim() ||
          "ಸಮಾನತೆ ಧ್ವನಿ",

        status,

        featured:
          formData.featured,

        // Show this news in the breaking-news ticker
        breakingNews:
          formData.breakingNews,

        image:
          imageUrl,

        imagePublicId,

        // Link opened by clicking the news image / play button
        externalLink: normalizeUrl(
          formData.externalLink
        ),

        // All social media links
        socialLinks: {
          youtube: normalizeUrl(
            formData.socialLinks.youtube
          ),
          facebook: normalizeUrl(
            formData.socialLinks.facebook
          ),
          instagram: normalizeUrl(
            formData.socialLinks.instagram
          ),
          x: normalizeUrl(
            formData.socialLinks.x
          ),
          whatsapp: normalizeUrl(
            formData.socialLinks.whatsapp
          ),
          telegram: normalizeUrl(
            formData.socialLinks.telegram
          ),
        },

        location,
      };

      console.log(
        "Sending news data:",
        newsData
      );

      // ==================================================
      // CREATE NEWS
      // ==================================================

      const response =
        await addNews(newsData);

      console.log(
        "News created:",
        response
      );

      // ==================================================
      // SUCCESS
      // ==================================================

      setMessage(
        status === "Published"
          ? (
              formData.breakingNews
                ? "ಸುದ್ದಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ ಮತ್ತು Breaking News ಆಗಿ ಗುರುತಿಸಲಾಗಿದೆ."
                : "ಸುದ್ದಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ."
            )
          : "ಸುದ್ದಿಯನ್ನು ಕರಡಾಗಿ ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ."
      );

      setTimeout(() => {
        navigate("/admin/news");
      }, 1000);

    } catch (error) {
      console.error(
        "Create news error:",
        error
      );

      setError(
        error?.message ||
          "ಸುದ್ದಿಯನ್ನು ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
      );

    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <main className="news-add-page">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="admin-page-header">

        <div>

          <h1>
            ಹೊಸ ಸುದ್ದಿ ಸೇರಿಸಿ
          </h1>

          <p>
            ಹೊಸ ಸುದ್ದಿಯನ್ನು ರಚಿಸಿ, Kannada / English content ಸೇರಿಸಿ
            ಮತ್ತು ಪ್ರಕಟಿಸಿ.
          </p>

        </div>

        <Link
          to="/admin/news"
          className="admin-secondary-button"
        >
          ← ಸುದ್ದಿ ಪಟ್ಟಿಗೆ
        </Link>

      </div>


      {/* ==================================================
          FORM
      ================================================== */}

      <form
        className="news-add-form"
        onSubmit={handleSubmit}
      >

        <div className="news-language-banner">
          <strong>
            ಕನ್ನಡದಲ್ಲಿ ಮಾತ್ರ ಸುದ್ದಿ ಸೇರಿಸಿ
          </strong>
          <span>
            Website ನಲ್ಲಿ ಬಳಕೆದಾರರು English ಆಯ್ಕೆ ಮಾಡಿದಾಗ Kannada
            ಸುದ್ದಿಯನ್ನು English ಗೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಅನುವಾದಿಸಲಾಗುತ್ತದೆ.
          </span>
        </div>

        {/* SUCCESS */}

        {message && (
          <div className="news-form-message">
            {message}
          </div>
        )}


        {/* ERROR */}

        {error && (
          <div className="admin-error-message">
            {error}
          </div>
        )}


        <div className="news-add-layout">

          {/* ==================================================
              MAIN CONTENT
          ================================================== */}

          <div className="news-add-main">

            <section className="admin-form-card">

              <h2 className="news-form-title">
                ಸುದ್ದಿ ಮಾಹಿತಿ
              </h2>


              {/* TITLE - KANNADA ONLY */}

              <div className="admin-form-group">

                <label htmlFor="title">
                  ಕನ್ನಡ ಸುದ್ದಿ ಶೀರ್ಷಿಕೆ *
                </label>

                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="ಕನ್ನಡದಲ್ಲಿ ಸುದ್ದಿ ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ"
                  required
                  disabled={saving}
                />

                <small className="news-language-help">
                  💡 English ಶೀರ್ಷಿಕೆಯನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ಬರೆಯಬೇಕಾಗಿಲ್ಲ.
                  ಬಳಕೆದಾರರು English ಆಯ್ಕೆ ಮಾಡಿದಾಗ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಅನುವಾದಿಸಲಾಗುತ್ತದೆ.
                </small>

              </div>


              {/* DESCRIPTION - KANNADA ONLY */}

              <div className="admin-form-group">

                <label htmlFor="description">
                  ಕನ್ನಡ ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="ಕನ್ನಡದಲ್ಲಿ ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ"
                  rows="4"
                  disabled={saving}
                />

              </div>


              {/* CONTENT - KANNADA ONLY */}

              <div className="admin-form-group">

                <label htmlFor="content">
                  ಕನ್ನಡ ಸಂಪೂರ್ಣ ಸುದ್ದಿ *
                </label>

                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="ಕನ್ನಡದಲ್ಲಿ ಸುದ್ದಿಯ ಸಂಪೂರ್ಣ ವಿಷಯವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ..."
                  rows="18"
                  required
                  disabled={saving}
                />

                <small className="news-language-help">
                  🌐 English translation ಅನ್ನು website ಸ್ವಯಂಚಾಲಿತವಾಗಿ
                  ಸೃಷ್ಟಿಸುತ್ತದೆ. ನೀವು English content ಬರೆಯುವ ಅಗತ್ಯವಿಲ್ಲ.
                </small>

              </div>

            </section>

          </div>


          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="news-add-sidebar">


            {/* ==================================================
                PUBLICATION INFORMATION
            ================================================== */}

            <section className="admin-form-card">

              <h2 className="news-form-title">
                ಪ್ರಕಟಣೆ ಮಾಹಿತಿ
              </h2>


              {/* ==================================================
                  CATEGORY
              ================================================== */}

              <div className="admin-form-group">

                <label htmlFor="category">
                  ವಿಭಾಗ *
                </label>

                <select
                  id="category"
                  name="category"
                  value={
                    formData.category
                  }
                  onChange={
                    handleChange
                  }
                  required
                  disabled={saving}
                >

                  <option value="">
                    ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={
                          category.key
                        }
                        value={
                          category.name
                        }
                      >
                        {
                          category.name
                        }
                      </option>
                    )
                  )}

                </select>

              </div>


              {/* ==================================================
                  LOCATION
              ================================================== */}

              <div className="news-location-section">

                <h3>
                  ಸುದ್ದಿ ಸ್ಥಳ
                </h3>

                <p className="location-help">
                  ಆಯ್ಕೆಗಳಲ್ಲಿ ಸ್ಥಳವಿಲ್ಲದಿದ್ದರೆ
                  ನೇರವಾಗಿ ಟೈಪ್ ಮಾಡಬಹುದು.
                </p>


                {/* STATE */}

                <div className="admin-form-group">

                  <label htmlFor="state">
                    ರಾಜ್ಯ *
                  </label>

                  <input
                    list="state-options"
                    type="text"
                    id="state"
                    name="state"
                    value={
                      formData.state
                    }
                    onChange={
                      handleStateChange
                    }
                    placeholder="ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ"
                    disabled={saving}
                    autoComplete="off"
                    required
                  />

                  <datalist id="state-options">

                    {states.map(
                      (state) => (
                        <option
                          key={state}
                          value={state}
                        />
                      )
                    )}

                  </datalist>

                </div>


                {/* DISTRICT */}

                <div className="admin-form-group">

                  <label htmlFor="district">
                    ಜಿಲ್ಲೆ *
                  </label>

                  <input
                    list="district-options"
                    type="text"
                    id="district"
                    name="district"
                    value={
                      formData.district
                    }
                    onChange={
                      handleDistrictChange
                    }
                    placeholder={
                      formData.state
                        ? "ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ"
                        : "ಮೊದಲು ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ"
                    }
                    disabled={
                      saving ||
                      !formData.state
                    }
                    autoComplete="off"
                    required
                  />

                  <datalist id="district-options">

                    {districts.map(
                      (district) => (
                        <option
                          key={district}
                          value={district}
                        />
                      )
                    )}

                  </datalist>

                </div>


                {/* TALUK */}

                <div className="admin-form-group">

                  <label htmlFor="taluk">
                    ತಾಲೂಕು *
                  </label>

                  <input
                    list="taluk-options"
                    type="text"
                    id="taluk"
                    name="taluk"
                    value={
                      formData.taluk
                    }
                    onChange={
                      handleTalukChange
                    }
                    placeholder={
                      formData.district
                        ? "ತಾಲೂಕು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ"
                        : "ಮೊದಲು ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ"
                    }
                    disabled={
                      saving ||
                      !formData.district
                    }
                    autoComplete="off"
                    required
                  />

                  <datalist id="taluk-options">

                    {taluks.map(
                      (taluk) => (
                        <option
                          key={taluk}
                          value={taluk}
                        />
                      )
                    )}

                  </datalist>

                </div>


                {/* VILLAGE */}

                <div className="admin-form-group">

                  <label htmlFor="village">
                    ಗ್ರಾಮ / ಸ್ಥಳ *
                  </label>

                  <input
                    list="village-options"
                    type="text"
                    id="village"
                    name="village"
                    value={
                      formData.village
                    }
                    onChange={
                      handleVillageChange
                    }
                    placeholder={
                      formData.taluk
                        ? "ಗ್ರಾಮದ ಹೆಸರು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ"
                        : "ಮೊದಲು ತಾಲೂಕು ಆಯ್ಕೆಮಾಡಿ"
                    }
                    disabled={
                      saving ||
                      !formData.taluk
                    }
                    autoComplete="off"
                    required
                  />

                  <datalist id="village-options">

                    {villages.map(
                      (village) => (
                        <option
                          key={village}
                          value={village}
                        />
                      )
                    )}

                  </datalist>

                </div>

              </div>


              {/* AUTHOR */}

              <div className="admin-form-group">

                <label htmlFor="author">
                  ವರದಿಗಾರ / ಲೇಖಕ
                </label>

                <input
                  type="text"
                  id="author"
                  name="author"
                  value={
                    formData.author
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="ಲೇಖಕರ ಹೆಸರು"
                  disabled={saving}
                />

              </div>


              {/* FEATURED */}

              <div className="news-featured-option">

                <label>

                  <input
                    type="checkbox"
                    name="featured"
                    checked={
                      formData.featured
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                  />

                  <span>
                    ಮುಖ್ಯ ಸುದ್ದಿಯಾಗಿ
                    ತೋರಿಸಿ
                  </span>

                </label>

              </div>

              {/* ================================================
                  BREAKING NEWS
              ================================================= */}

              <div className="news-breaking-option">

                <label>

                  <input
                    type="checkbox"
                    name="breakingNews"
                    checked={formData.breakingNews}
                    onChange={handleChange}
                    disabled={saving}
                  />

                  <span>
                    🚨 Breaking News
                  </span>

                </label>

                <p className="location-help">
                  ಆಯ್ಕೆ ಮಾಡಿದರೆ ಈ ಸುದ್ದಿಯನ್ನು Home page ನ Breaking News
                  scrolling ticker ನಲ್ಲಿ ತೋರಿಸಲಾಗುತ್ತದೆ ಮತ್ತು highlight/
                  blink effect ಬಳಸಬಹುದು.
                </p>

              </div>

            </section>


            {/* ==================================================
                IMAGE / PLAY BUTTON LINK
            ================================================== */}

            <section className="admin-form-card">

              <h2 className="news-form-title">
                ಚಿತ್ರ / Play Button Link
              </h2>

              <p className="location-help">
                ಕೆಳಗಿನ ಚಿತ್ರ ಅಥವಾ ▶ Play ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿದಾಗ ಈ ಲಿಂಕ್ ತೆರೆಯುತ್ತದೆ. YouTube, Instagram, Facebook ಅಥವಾ ಯಾವುದೇ https:// ಲಿಂಕ್ ಬಳಸಬಹುದು.
              </p>

              <div className="admin-form-group">

                <label htmlFor="externalLink">
                  Link URL
                </label>

                <input
                  type="url"
                  id="externalLink"
                  name="externalLink"
                  value={formData.externalLink}
                  onChange={handleExternalLinkChange}
                  placeholder="https://youtube.com/watch?v=..."
                  disabled={saving}
                />

              </div>

              {formData.externalLink && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => {
                    if (!isValidUrl(formData.externalLink)) {
                      setError(
                        "ದಯವಿಟ್ಟು ಸರಿಯಾದ ಲಿಂಕ್ ನಮೂದಿಸಿ."
                      );
                      return;
                    }

                    window.open(
                      normalizeUrl(formData.externalLink),
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  disabled={saving}
                >
                  🔗 ಲಿಂಕ್ ಪರೀಕ್ಷಿಸಿ
                </button>
              )}

            </section>


            {/* ==================================================
                SOCIAL MEDIA LINKS
            ================================================== */}

            <section className="admin-form-card">

              <h2 className="news-form-title">
                ಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳ ಲಿಂಕ್
              </h2>

              <p className="location-help">
                ನಿಮ್ಮ website / channel / page ಗೆ ಸಂಬಂಧಿಸಿದ social media links ಅನ್ನು ಇಲ್ಲಿ ಸೇರಿಸಿ. ಅಗತ್ಯವಿಲ್ಲದವುಗಳನ್ನು ಖಾಲಿ ಬಿಡಬಹುದು.
              </p>

              <div className="admin-form-group">
                <label htmlFor="youtubeLink">▶ YouTube</label>
                <input
                  type="url"
                  id="youtubeLink"
                  value={formData.socialLinks.youtube}
                  onChange={(event) =>
                    handleSocialLinkChange(
                      "youtube",
                      event.target.value
                    )
                  }
                  placeholder="https://youtube.com/@yourchannel"
                  disabled={saving}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="facebookLink">f Facebook</label>
                <input
                  type="url"
                  id="facebookLink"
                  value={formData.socialLinks.facebook}
                  onChange={(event) =>
                    handleSocialLinkChange(
                      "facebook",
                      event.target.value
                    )
                  }
                  placeholder="https://facebook.com/yourpage"
                  disabled={saving}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="instagramLink">◎ Instagram</label>
                <input
                  type="url"
                  id="instagramLink"
                  value={formData.socialLinks.instagram}
                  onChange={(event) =>
                    handleSocialLinkChange(
                      "instagram",
                      event.target.value
                    )
                  }
                  placeholder="https://instagram.com/yourprofile"
                  disabled={saving}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="xLink">𝕏 X / Twitter</label>
                <input
                  type="url"
                  id="xLink"
                  value={formData.socialLinks.x}
                  onChange={(event) =>
                    handleSocialLinkChange(
                      "x",
                      event.target.value
                    )
                  }
                  placeholder="https://x.com/yourprofile"
                  disabled={saving}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="whatsappLink">☎ WhatsApp</label>
                <input
                  type="url"
                  id="whatsappLink"
                  value={formData.socialLinks.whatsapp}
                  onChange={(event) =>
                    handleSocialLinkChange(
                      "whatsapp",
                      event.target.value
                    )
                  }
                  placeholder="https://wa.me/91XXXXXXXXXX"
                  disabled={saving}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="telegramLink">✈ Telegram</label>
                <input
                  type="url"
                  id="telegramLink"
                  value={formData.socialLinks.telegram}
                  onChange={(event) =>
                    handleSocialLinkChange(
                      "telegram",
                      event.target.value
                    )
                  }
                  placeholder="https://t.me/yourchannel"
                  disabled={saving}
                />
              </div>

            </section>


                        {/* ==================================================
                IMAGE
            ================================================== */}

            <section className="admin-form-card">

              <h2 className="news-form-title">
                ಮುಖ್ಯ ಚಿತ್ರ
              </h2>

              <div className="news-image-upload">

                <input
                  type="file"
                  id="newsImage"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  disabled={saving}
                />

                <label htmlFor="newsImage">
                  ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ
                </label>

              </div>


              {imagePreview && (
                <div className="news-image-preview">

                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      cursor: formData.externalLink
                        ? "pointer"
                        : "default",
                    }}
                    onClick={() => {
                      if (!formData.externalLink) {
                        setError(
                          "ಮೊದಲು ಚಿತ್ರ / Play Button Link ನಮೂದಿಸಿ."
                        );
                        return;
                      }

                      if (!isValidUrl(formData.externalLink)) {
                        setError(
                          "ದಯವಿಟ್ಟು ಸರಿಯಾದ ಲಿಂಕ್ ನಮೂದಿಸಿ."
                        );
                        return;
                      }

                      window.open(
                        normalizeUrl(formData.externalLink),
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                    role="link"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.currentTarget.click();
                      }
                    }}
                    aria-label="Open linked news content"
                  >

                    <img
                      src={imagePreview}
                      alt="News preview"
                      style={{
                        display: "block",
                        width: "100%",
                      }}
                    />

                    <button
                      type="button"
                      aria-label="Open linked content"
                      title={
                        formData.externalLink
                          ? "ಲಿಂಕ್ ತೆರೆಯಿರಿ"
                          : "ಮೊದಲು ಲಿಂಕ್ ನಮೂದಿಸಿ"
                      }
                      onClick={(event) => {
                        event.stopPropagation();

                        if (!formData.externalLink) {
                          setError(
                            "ಮೊದಲು ಚಿತ್ರ / Play Button Link ನಮೂದಿಸಿ."
                          );
                          return;
                        }

                        if (!isValidUrl(formData.externalLink)) {
                          setError(
                            "ದಯವಿಟ್ಟು ಸರಿಯಾದ ಲಿಂಕ್ ನಮೂದಿಸಿ."
                          );
                          return;
                        }

                        window.open(
                          normalizeUrl(formData.externalLink),
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "64px",
                        height: "64px",
                        borderRadius: "50%",
                        border: "3px solid #ffffff",
                        background: "rgba(0, 0, 0, 0.72)",
                        color: "#ffffff",
                        fontSize: "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 2,
                      }}
                    >
                      ▶
                    </button>

                    {formData.externalLink && (
                      <span
                        style={{
                          position: "absolute",
                          left: "50%",
                          bottom: "12px",
                          transform: "translateX(-50%)",
                          background: "rgba(0, 0, 0, 0.72)",
                          color: "#ffffff",
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          whiteSpace: "nowrap",
                          pointerEvents: "none",
                        }}
                      >
                        🔗 Click to open link
                      </span>
                    )}

                  </div>

                  <p>
                    {image?.name || "ಆಯ್ಕೆ ಮಾಡಿದ ಮುಖ್ಯ ಚಿತ್ರ"}
                  </p>

                </div>
              )}

            </section>


            {/* ==================================================
                ACTION BUTTONS
            ================================================== */}

            <section className="news-form-actions">

              <button
                type="submit"
                name="submitAction"
                value="Published"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "ಉಳಿಸಲಾಗುತ್ತಿದೆ..."
                  : "ಸುದ್ದಿ ಪ್ರಕಟಿಸಿ"}
              </button>


              <button
                type="submit"
                name="submitAction"
                value="Draft"
                className="admin-secondary-button"
                disabled={saving}
              >
                {saving
                  ? "ಉಳಿಸಲಾಗುತ್ತಿದೆ..."
                  : "ಕರಡಾಗಿ ಉಳಿಸಿ"}
              </button>

            </section>

          </aside>

        </div>

      </form>

    </main>
  );
}

export default NewsAdd;