import React, { useEffect, useState } from "react";

import {
  getNewsById,
  getCategories,
  updateNews,
  uploadMedia,
} from "../../services/api";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import "./NewsAdd.css";

function NewsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

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

    // Location
    state: "",
    district: "",
    taluk: "",
    village: "",
  });

  // ==================================================
  // IMAGE
  // ==================================================

  const [image, setImage] = useState(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [
    currentImagePublicId,
    setCurrentImagePublicId,
  ] = useState("");

  // ==================================================
  // CATEGORIES
  // ==================================================

  const [categories, setCategories] =
    useState([]);

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
  // FALLBACK CATEGORIES
  // ==================================================

  const defaultCategories = [
    {
      id: "karnataka",
      name: "ಕರ್ನಾಟಕ",
    },
    {
      id: "india",
      name: "ಭಾರತ",
    },
    {
      id: "world",
      name: "ವಿಶ್ವ",
    },
    {
      id: "politics",
      name: "ರಾಜಕೀಯ",
    },
    {
      id: "crime",
      name: "ಅಪರಾಧ",
    },
    {
      id: "sports",
      name: "ಕ್ರೀಡೆ",
    },
    {
      id: "cinema",
      name: "ಸಿನಿಮಾ",
    },
    {
      id: "business",
      name: "ವ್ಯಾಪಾರ",
    },
    {
      id: "education",
      name: "ಶಿಕ್ಷಣ",
    },
  ];

  // ==================================================
  // STATES
  // ==================================================

  const states = Object.keys(locationData);

  const districts =
    formData.state &&
    locationData[formData.state]
      ? Object.keys(
          locationData[formData.state]
        )
      : [];

  const taluks =
    formData.state &&
    formData.district &&
    locationData[formData.state]?.[
      formData.district
    ]
      ? Object.keys(
          locationData[
            formData.state
          ][formData.district]
        )
      : [];

  const villages =
    formData.state &&
    formData.district &&
    formData.taluk &&
    locationData[formData.state]?.[
      formData.district
    ]?.[formData.taluk]
      ? locationData[
          formData.state
        ][formData.district][
          formData.taluk
        ]
      : [];

  // ==================================================
  // PAGE STATE
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
  // LOAD NEWS + CATEGORIES
  // ==================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // Load news
        const newsResponse =
          await getNewsById(id);

        // Load categories separately
        let categoryResponse = null;

        try {
          categoryResponse =
            await getCategories();
        } catch (categoryError) {
          console.warn(
            "Could not load categories from API:",
            categoryError
          );
        }

        // ==================================================
        // NEWS
        // ==================================================

        const news =
          newsResponse?.news;

        if (!news) {
          throw new Error(
            "ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ."
          );
        }

        // ==================================================
        // GET LOCATION FROM BACKEND
        // ==================================================

        const location =
          news.location || {};

        /*
          Backend may store location in different
          naming formats. We support all common formats.
        */

        const state =
          location.state ||
          news.state ||
          "";

        const district =
          location.district ||
          news.district ||
          "";

        const taluk =
          location.taluk ||
          news.taluk ||
          "";

        const village =
          location.village ||
          location.city ||
          news.village ||
          news.city ||
          "";

        // ==================================================
        // SET FORM
        // ==================================================

        setFormData({
          title:
            news.title || "",

          description:
            news.description || "",

          category:
            news.category || "",

          content:
            news.content || "",

          author:
            news.author ||
            "ಸಮಾನತೆ ಧ್ವನಿ",

          status:
            news.status || "Draft",

          featured:
            Boolean(news.featured),

          breakingNews:
            Boolean(news.breakingNews),

          state,
          district,
          taluk,
          village,
        });

        // ==================================================
        // IMAGE
        // ==================================================

        setImagePreview(
          news.image || ""
        );

        setCurrentImagePublicId(
          news.imagePublicId || ""
        );

        // ==================================================
        // CATEGORIES
        // ==================================================

        const apiCategories =
          categoryResponse?.categories;

        if (
          Array.isArray(apiCategories) &&
          apiCategories.length > 0
        ) {
          setCategories(
            apiCategories
          );
        } else {
          setCategories(
            defaultCategories
          );
        }
      } catch (error) {
        console.error(
          "Load news edit data error:",
          error
        );

        setError(
          error?.message ||
            "ಸುದ್ದಿಯ ಮಾಹಿತಿಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

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

    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          type === "checkbox"
            ? checked
            : value,
      })
    );

    setMessage("");
    setError("");
  };

  // ==================================================
  // STATE CHANGE
  // ==================================================

  const handleStateChange = (
    event
  ) => {
    const value =
      event.target.value;

    setFormData(
      (previous) => ({
        ...previous,

        state: value,

        /*
          Reset child locations only
          when selecting a known state.
        */
        district: "",
        taluk: "",
        village: "",
      })
    );

    setMessage("");
    setError("");
  };

  // ==================================================
  // DISTRICT CHANGE
  // ==================================================

  const handleDistrictChange = (
    event
  ) => {
    const value =
      event.target.value;

    setFormData(
      (previous) => ({
        ...previous,

        district: value,
        taluk: "",
        village: "",
      })
    );

    setMessage("");
    setError("");
  };

  // ==================================================
  // TALUK CHANGE
  // ==================================================

  const handleTalukChange = (
    event
  ) => {
    const value =
      event.target.value;

    setFormData(
      (previous) => ({
        ...previous,

        taluk: value,
        village: "",
      })
    );

    setMessage("");
    setError("");
  };

  // ==================================================
  // VILLAGE CHANGE
  // ==================================================

  const handleVillageChange = (
    event
  ) => {
    const value =
      event.target.value;

    setFormData(
      (previous) => ({
        ...previous,

        village: value,
      })
    );

    setMessage("");
    setError("");
  };

  // ==================================================
  // IMAGE CHANGE
  // ==================================================

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // Check image
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

    // 10MB limit
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

    /*
      If previous preview is a local
      blob URL, release it.
    */

    if (
      imagePreview &&
      imagePreview.startsWith(
        "blob:"
      )
    ) {
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

  const createSlug = (
    title
  ) => {
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
  // SAVE CHANGES
  // ==================================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !formData.title.trim()
    ) {
      setError(
        "ದಯವಿಟ್ಟು ಸುದ್ದಿ ಶೀರ್ಷಿಕೆ ನಮೂದಿಸಿ."
      );

      return;
    }

    if (
      !formData.category
    ) {
      setError(
        "ದಯವಿಟ್ಟು ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ."
      );

      return;
    }

    if (
      !formData.content.trim()
    ) {
      setError(
        "ದಯವಿಟ್ಟು ಸುದ್ದಿ ವಿಷಯವನ್ನು ನಮೂದಿಸಿ."
      );

      return;
    }

    if (
      !formData.state.trim()
    ) {
      setError(
        "ದಯವಿಟ್ಟು ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ನಮೂದಿಸಿ."
      );

      return;
    }

    if (
      !formData.district.trim()
    ) {
      setError(
        "ದಯವಿಟ್ಟು ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ನಮೂದಿಸಿ."
      );

      return;
    }

    if (
      !formData.taluk.trim()
    ) {
      setError(
        "ದಯವಿಟ್ಟು ತಾಲೂಕು ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ನಮೂದಿಸಿ."
      );

      return;
    }

    if (
      !formData.village.trim()
    ) {
      setError(
        "ದಯವಿಟ್ಟು ಗ್ರಾಮ / ಸ್ಥಳದ ಹೆಸರು ನಮೂದಿಸಿ."
      );

      return;
    }

    try {
      setSaving(true);

      // ==================================================
      // IMAGE
      // ==================================================

      let imageUrl =
        imagePreview || "";

      let imagePublicId =
        currentImagePublicId || "";

      // ==================================================
      // NEW IMAGE
      // ==================================================

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
            "ಹೊಸ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
          );
        }

        imageUrl =
          uploadedMedia.url || "";

        imagePublicId =
          uploadedMedia.publicId ||
          "";
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
      // UPDATED NEWS
      // ==================================================

      const updatedNews = {
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

        status:
          formData.status,

        featured:
          Boolean(
            formData.featured
          ),

        breakingNews:
          Boolean(
            formData.breakingNews
          ),

        image:
          imageUrl,

        imagePublicId:
          imagePublicId,

        location,

        // Also send these directly
        // for backend compatibility.
        state:
          formData.state.trim(),

        district:
          formData.district.trim(),

        taluk:
          formData.taluk.trim(),

        village:
          formData.village.trim(),
      };

      console.log(
        "Updating news:",
        updatedNews
      );

      // ==================================================
      // API UPDATE
      // ==================================================

      await updateNews(
        id,
        updatedNews
      );

      // ==================================================
      // SUCCESS
      // ==================================================

      setMessage(
        "ಸುದ್ದಿಯ ಬದಲಾವಣೆಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ."
      );

      // ==================================================
      // NAVIGATE
      // ==================================================

      setTimeout(() => {
        navigate(
          "/admin/news"
        );
      }, 1000);
    } catch (error) {
      console.error(
        "Update news error:",
        error
      );

      setError(
        error?.message ||
          "ಸುದ್ದಿಯ ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
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
      <main className="news-add-page">

        <div className="admin-page-header">

          <div>

            <h1>
              ಸುದ್ದಿ ಬದಲಾಯಿಸಿ
            </h1>

            <p>
              ಸುದ್ದಿ ಮಾಹಿತಿಯನ್ನು
              ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
            </p>

          </div>

        </div>

        <div className="admin-form-card">

          <div className="admin-empty">
            ಸುದ್ದಿ ಮಾಹಿತಿಯನ್ನು
            ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...
          </div>

        </div>

      </main>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="news-add-page">

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="admin-page-header">

        <div>

          <h1>
            ಸುದ್ದಿ ಬದಲಾಯಿಸಿ
          </h1>

          <p>
            ಸುದ್ದಿ ID: {id}
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
        onSubmit={
          handleSubmit
        }
      >

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="news-form-message">
            {message}
          </div>
        )}


        {/* ERROR MESSAGE */}

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


              {/* TITLE */}

              <div className="admin-form-group">

                <label htmlFor="title">
                  ಸುದ್ದಿ ಶೀರ್ಷಿಕೆ *
                </label>

                <input
                  type="text"
                  id="title"
                  name="title"
                  value={
                    formData.title
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="ಸುದ್ದಿಯ ಶೀರ್ಷಿಕೆ"
                  required
                  disabled={saving}
                />

              </div>


              {/* DESCRIPTION */}

              <div className="admin-form-group">

                <label htmlFor="description">
                  ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="ಸುದ್ದಿಯ ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ"
                  rows="4"
                  disabled={saving}
                />

              </div>


              {/* CONTENT */}

              <div className="admin-form-group">

                <label htmlFor="content">
                  ಸಂಪೂರ್ಣ ಸುದ್ದಿ *
                </label>

                <textarea
                  id="content"
                  name="content"
                  value={
                    formData.content
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="ಸುದ್ದಿಯ ಸಂಪೂರ್ಣ ವಿಷಯ"
                  rows="18"
                  required
                  disabled={saving}
                />

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
                    (category) => {

                      const categoryId =
                        category._id ||
                        category.id ||
                        category.key ||
                        category.name;

                      return (
                        <option
                          key={
                            categoryId
                          }
                          value={
                            category.name
                          }
                        >
                          {
                            category.name
                          }
                        </option>
                      );
                    }
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
                  ಪಟ್ಟಿಯಲ್ಲಿ ಸ್ಥಳವಿಲ್ಲದಿದ್ದರೆ
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
                    autoComplete="off"
                    required
                    disabled={saving}
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
                    autoComplete="off"
                    required
                    disabled={
                      saving ||
                      !formData.state
                    }
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
                    autoComplete="off"
                    required
                    disabled={
                      saving ||
                      !formData.district
                    }
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
                        ? "ಗ್ರಾಮ / ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ"
                        : "ಮೊದಲು ತಾಲೂಕು ಆಯ್ಕೆಮಾಡಿ"
                    }
                    autoComplete="off"
                    required
                    disabled={
                      saving ||
                      !formData.taluk
                    }
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


              {/* ==================================================
                  AUTHOR
              ================================================== */}

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


              {/* ==================================================
                  STATUS
              ================================================== */}

              <div className="admin-form-group">

                <label htmlFor="status">
                  ಸ್ಥಿತಿ
                </label>

                <select
                  id="status"
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                  disabled={saving}
                >

                  <option value="Draft">
                    ಕರಡು
                  </option>

                  <option value="Published">
                    ಪ್ರಕಟಿತ
                  </option>

                </select>

              </div>


              {/* ==================================================
                  FEATURED
              ================================================== */}

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


              {/* ==================================================
                  BREAKING NEWS
              ================================================== */}

              <div className="news-breaking-option">

                <label>

                  <input
                    type="checkbox"
                    name="breakingNews"
                    checked={
                      formData.breakingNews
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                  />

                  <span>
                    ತಾಜಾ / ಬ್ರೇಕಿಂಗ್ ಸುದ್ದಿಯಾಗಿ
                    ತೋರಿಸಿ
                  </span>

                </label>

                <p className="breaking-help-text">
                  ಆಯ್ಕೆ ಮಾಡಿದರೆ ಈ ಸುದ್ದಿ
                  ವೆಬ್‌ಸೈಟ್‌ನ Breaking News
                  ticker ನಲ್ಲಿ ತೋರಿಸಲಾಗುತ್ತದೆ.
                </p>

              </div>

            </section>


            {/* ==================================================
                MAIN IMAGE
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
                  ಹೊಸ ಚಿತ್ರ ಆಯ್ಕೆಮಾಡಿ
                </label>

              </div>


              {imagePreview && (
                <div className="news-image-preview">

                  <img
                    src={
                      imagePreview
                    }
                    alt="News preview"
                  />

                  <p>
                    {image
                      ? image.name
                      : "ಪ್ರಸ್ತುತ ಮುಖ್ಯ ಚಿತ್ರ"}
                  </p>

                </div>
              )}

            </section>


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <section className="news-form-actions">

              <button
                type="submit"
                className="admin-primary-button"
                disabled={saving}
              >
                {saving
                  ? "ಉಳಿಸಲಾಗುತ್ತಿದೆ..."
                  : "ಬದಲಾವಣೆ ಉಳಿಸಿ"}
              </button>

              <Link
                to="/admin/news"
                className="admin-secondary-button"
              >
                ರದ್ದುಪಡಿಸಿ
              </Link>

            </section>

          </aside>

        </div>

      </form>

    </main>
  );
}

export default NewsEdit;