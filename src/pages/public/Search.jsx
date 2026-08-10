import React, {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import NewsCard from "../../components/NewsCard";

import {
  getPublishedNews,
} from "../../services/api";

import {
  useLanguage,
} from "../../context/LanguageContext";

import "./Search.css";

function Search() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const {
    language,
  } = useLanguage();

  const initialSearch =
    searchParams.get("q") || "";

  const [
    searchText,
    setSearchText,
  ] = useState(
    initialSearch
  );

  const [
    searchResults,
    setSearchResults,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  // ==================================================
  // SEARCH BACKEND
  // ==================================================

  useEffect(() => {
    const query =
      initialSearch.trim();

    if (!query) {
      setSearchResults([]);
      setError("");
      setLoading(false);
      return;
    }

    const searchNews =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await getPublishedNews({
              search: query,
              page: 1,
              limit: 50,
            });

          setSearchResults(
            response.news || []
          );
        } catch (error) {
          console.error(
            "Search error:",
            error
          );

          setError(
            error.message ||
              (
                language === "kn"
                  ? "ಸುದ್ದಿಗಳನ್ನು ಹುಡುಕಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
                  : "Unable to search news."
              )
          );

          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      };

    searchNews();
  }, [
    initialSearch,
    language,
  ]);

  // ==================================================
  // HANDLE SEARCH
  // ==================================================

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    const trimmedText =
      searchText.trim();

    if (!trimmedText) {
      setSearchParams({});
      return;
    }

    setSearchParams({
      q: trimmedText,
    });
  };

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleDateString(
      language === "kn"
        ? "kn-IN"
        : "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==================================================
  // CATEGORY NAME
  // ==================================================

  const getCategoryName = (
    category
  ) => {
    const categoryMap = {
      karnataka:
        "ಕರ್ನಾಟಕ",

      india:
        "ಭಾರತ",

      world:
        "ವಿಶ್ವ",

      politics:
        "ರಾಜಕೀಯ",

      crime:
        "ಅಪರಾಧ",

      sports:
        "ಕ್ರೀಡೆ",

      cinema:
        "ಸಿನಿಮಾ",

      business:
        "ವ್ಯಾಪಾರ",

      education:
        "ಶಿಕ್ಷಣ",
    };

    return (
      categoryMap[
        category
      ] || category
    );
  };

  // ==================================================
  // PREPARE NEWS
  // ==================================================

  const preparedResults =
    searchResults.map(
      (news) => ({
        ...news,

        id:
          news._id ||
          news.id,

        category:
          getCategoryName(
            news.category
          ),

        date:
          formatDate(
            news.publishedAt ||
              news.createdAt
          ),
      })
    );

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="search-page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <section className="page-header">

        <div className="container">

          <h1>
            ಸುದ್ದಿ ಹುಡುಕಿ
          </h1>

          <p>
            ನಿಮಗೆ ಬೇಕಾದ ಸುದ್ದಿಯನ್ನು ಹುಡುಕಿ
          </p>

        </div>

      </section>

      {/* =================================
          SEARCH BOX
      ================================= */}

      <section className="search-section">

        <div className="container">

          <form
            className="search-form"
            onSubmit={
              handleSubmit
            }
          >

            <input
              type="search"
              value={
                searchText
              }
              onChange={(
                event
              ) =>
                setSearchText(
                  event.target
                    .value
                )
              }
              placeholder="ಸುದ್ದಿ ಹುಡುಕಿ..."
              aria-label="ಸುದ್ದಿ ಹುಡುಕಿ"
            />

            <button
              type="submit"
              disabled={
                loading
              }
            >
              ಹುಡುಕಿ
            </button>

          </form>

        </div>

      </section>

      {/* =================================
          RESULTS
      ================================= */}

      <section className="search-results-section">

        <div className="container">

          {/* =================================
              SEARCH RESULT HEADING
          ================================= */}

          {initialSearch && (
            <div className="search-result-heading">

              <h2>
                "{initialSearch}"
                {" "}
                ಹುಡುಕಾಟದ ಫಲಿತಾಂಶಗಳು
              </h2>

              {!loading && (
                <span>
                  {
                    preparedResults.length
                  }{" "}
                  ಸುದ್ದಿ
                </span>
              )}

            </div>
          )}

          {/* =================================
              EMPTY SEARCH
          ================================= */}

          {!initialSearch ? (
            <div className="search-empty">

              <h3>
                ಸುದ್ದಿ ಹುಡುಕಿ
              </h3>

              <p>
                ಮೇಲಿನ ಹುಡುಕಾಟ ಪೆಟ್ಟಿಗೆಯಲ್ಲಿ
                ವಿಷಯವನ್ನು ನಮೂದಿಸಿ.
              </p>

            </div>
          ) : loading ? (
            /* =================================
                LOADING
            ================================= */

            <div className="search-empty">

              <h3>
                ಸುದ್ದಿಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...
              </h3>

              <p>
                ದಯವಿಟ್ಟು ಕಾಯಿರಿ.
              </p>

            </div>
          ) : error ? (
            /* =================================
                ERROR
            ================================= */

            <div className="search-empty">

              <h3>
                ಹುಡುಕಾಟ ವಿಫಲವಾಗಿದೆ
              </h3>

              <p>
                {error}
              </p>

            </div>
          ) : preparedResults.length ===
            0 ? (
            /* =================================
                NO RESULTS
            ================================= */

            <div className="search-empty">

              <h3>
                ಯಾವುದೇ ಸುದ್ದಿ ಕಂಡುಬಂದಿಲ್ಲ
              </h3>

              <p>
                ಬೇರೆ ಪದ ಬಳಸಿ ಮತ್ತೆ ಹುಡುಕಿ.
              </p>

            </div>
          ) : (
            /* =================================
                RESULTS GRID
            ================================= */

            <div className="search-grid">

              {preparedResults.map(
                (news) => (
                  <NewsCard
                    key={
                      news.id
                    }
                    news={
                      news
                    }
                  />
                )
              )}

            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default Search;