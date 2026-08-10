import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getPublishedMonthlyPapers,
  getPublishedNews,
} from "../../services/api";

import { useLanguage } from "../../context/LanguageContext";

import "./MonthlyPaper.css";

function MonthlyPaper() {
  const { language } = useLanguage();

  // ======================================================
  // MAIN MODE
  // ======================================================

  const [activeMode, setActiveMode] =
    useState("news");

  // ======================================================
  // NEWS
  // ======================================================

  const [news, setNews] = useState([]);

  const [newsLoading, setNewsLoading] =
    useState(true);

  const [newsError, setNewsError] =
    useState("");

  // ======================================================
  // MONTHLY PAPERS
  // ======================================================

  const [papers, setPapers] = useState([]);

  const [papersLoading, setPapersLoading] =
    useState(true);

  const [papersError, setPapersError] =
    useState("");

  const [selectedPaper, setSelectedPaper] =
    useState(null);

  // ======================================================
  // PAYMENT
  // ======================================================

  const [paymentLoading, setPaymentLoading] =
    useState(false);

  const [paymentError, setPaymentError] =
    useState("");

  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {
    loadNews();
    loadMonthlyPapers();
  }, []);

  // ======================================================
  // LOAD ALL PUBLISHED NEWS
  // ======================================================

  const loadNews = async () => {
    try {
      setNewsLoading(true);
      setNewsError("");

      /*
        Your backend supports:

        GET /api/news/published

        and accepts limit up to 100.
      */

      const response =
        await getPublishedNews({
          page: 1,
          limit: 100,
        });

      const newsData =
        response?.news ||
        response?.data ||
        [];

      setNews(
        Array.isArray(newsData)
          ? newsData
          : []
      );
    } catch (error) {
      console.error(
        "Load newspaper news error:",
        error
      );

      setNewsError(
        error?.message ||
          (language === "kn"
            ? "ಸುದ್ದಿಗಳನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
            : "Unable to load news.")
      );
    } finally {
      setNewsLoading(false);
    }
  };

  // ======================================================
  // LOAD MONTHLY PAPERS
  // ======================================================

  const loadMonthlyPapers = async () => {
    try {
      setPapersLoading(true);
      setPapersError("");

      const response =
        await getPublishedMonthlyPapers();

      const paperData =
        response?.papers ||
        response?.monthlyPapers ||
        response?.data ||
        [];

      const normalized =
        Array.isArray(paperData)
          ? paperData
          : [];

      setPapers(normalized);

      /*
        Automatically select newest paper.
      */

      if (normalized.length > 0) {
        setSelectedPaper(
          normalized[0]
        );
      }
    } catch (error) {
      console.error(
        "Load monthly papers error:",
        error
      );

      setPapersError(
        error?.message ||
          (language === "kn"
            ? "ಮಾಸಿಕ ಪತ್ರಿಕೆಗಳನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ."
            : "Unable to load monthly papers.")
      );
    } finally {
      setPapersLoading(false);
    }
  };

  // ======================================================
  // SOCIAL MEDIA
  // ======================================================

  const socialLinks = {
    youtube:
      "https://www.youtube.com/",
    facebook:
      "https://www.facebook.com/",
    instagram:
      "https://www.instagram.com/",
    x:
      "https://x.com/",
    whatsapp:
      "https://wa.me/",
    telegram:
      "https://t.me/",
  };

  // ======================================================
  // TEXT
  // ======================================================

  const text = {
    title:
      language === "kn"
        ? "ಸಮಾನತೆಯ ಧ್ವನಿ ಪತ್ರಿಕೆ"
        : "Samanateya Dhwani Newspaper",

    subtitle:
      language === "kn"
        ? "ನಮ್ಮ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪ್ರಕಟವಾದ ಸುದ್ದಿಗಳನ್ನು ಪತ್ರಿಕೆ ವಿನ್ಯಾಸದಲ್ಲಿ ಓದಿ."
        : "Read our published news in a traditional newspaper-style layout.",

    readNews:
      language === "kn"
        ? "📰 ಪತ್ರಿಕೆ ಓದಿ"
        : "📰 Read Newspaper",

    monthlyPaper:
      language === "kn"
        ? "🗞️ ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆ"
        : "🗞️ Samara Dhwani Monthly Paper",

    latestNews:
      language === "kn"
        ? "ಇಂದಿನ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು"
        : "Today's Latest News",

    allNews:
      language === "kn"
        ? "ಎಲ್ಲಾ ಪ್ರಕಟಿತ ಸುದ್ದಿಗಳು"
        : "All Published News",

    newspaperEdition:
      language === "kn"
        ? "ಸಮಾನತೆಯ ಧ್ವನಿ"
        : "SAMANATEYA DHWANI",

    newspaperSubtitle:
      language === "kn"
        ? "ದೈನಂದಿನ ಸುದ್ದಿ ಪತ್ರಿಕೆ"
        : "DAILY NEWS PAPER",

    published:
      language === "kn"
        ? "ಪ್ರಕಟಿಸಲಾಗಿದೆ"
        : "Published",

    reportedBy:
      language === "kn"
        ? "ವರದಿ"
        : "Reported by",

    read:
      language === "kn"
        ? "ಪೂರ್ಣ ಸುದ್ದಿ ಓದಿ"
        : "Read Full Story",

    monthlyTitle:
      language === "kn"
        ? "ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆ"
        : "Samara Dhwani Monthly Newspaper",

    selectEdition:
      language === "kn"
        ? "ಸಂಚಿಕೆ ಆಯ್ಕೆಮಾಡಿ"
        : "Select Edition",

    download:
      language === "kn"
        ? "₹5 — PDF ಡೌನ್‌ಲೋಡ್"
        : "₹5 — Download PDF",

    downloadNews:
      language === "kn"
        ? "₹5 — ಪತ್ರಿಕೆ ಡೌನ್‌ಲೋಡ್"
        : "₹5 — Download Newspaper",

    payment:
      language === "kn"
        ? "₹5 ಪಾವತಿಸಿ ಮತ್ತು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"
        : "Pay ₹5 to Download",

    social:
      language === "kn"
        ? "ನಮ್ಮನ್ನು ಅನುಸರಿಸಿ"
        : "Follow Us",

    noNews:
      language === "kn"
        ? "ಯಾವುದೇ ಪ್ರಕಟಿತ ಸುದ್ದಿ ಲಭ್ಯವಿಲ್ಲ."
        : "No published news available.",

    noPapers:
      language === "kn"
        ? "ಯಾವುದೇ ಮಾಸಿಕ ಪತ್ರಿಕೆ ಲಭ್ಯವಿಲ್ಲ."
        : "No monthly paper available.",

    loading:
      language === "kn"
        ? "ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ..."
        : "Loading...",

    retry:
      language === "kn"
        ? "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ"
        : "Try Again",

    paymentUnavailable:
      language === "kn"
        ? "ಪಾವತಿ ಸೇವೆ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ."
        : "Payment service is unavailable. Please try again later.",
  };

  // ======================================================
  // GET NEWS TITLE
  // ======================================================

  const getNewsTitle = (item) => {
    /*
      Current backend stores title in `title`.

      Fallbacks are included so the page also works
      if bilingual fields are added later.
    */

    if (language === "kn") {
      return (
        item.titleKn ||
        item.title ||
        "ಸುದ್ದಿ"
      );
    }

    return (
      item.titleEn ||
      item.title ||
      "News"
    );
  };

  // ======================================================
  // GET DESCRIPTION
  // ======================================================

  const getNewsDescription = (item) => {
    if (language === "kn") {
      return (
        item.descriptionKn ||
        item.description ||
        ""
      );
    }

    return (
      item.descriptionEn ||
      item.description ||
      ""
    );
  };

  // ======================================================
  // GET CONTENT
  // ======================================================

  const getNewsContent = (item) => {
    if (language === "kn") {
      return (
        item.contentKn ||
        item.content ||
        ""
      );
    }

    return (
      item.contentEn ||
      item.content ||
      ""
    );
  };

  // ======================================================
  // GET IMAGE
  // ======================================================

  const getNewsImage = (item) => {
    return (
      item.image ||
      item.featuredImage ||
      item.imageUrl ||
      ""
    );
  };

  // ======================================================
  // GET CATEGORY
  // ======================================================

  const getNewsCategory = (item) => {
    if (
      item.category &&
      typeof item.category === "object"
    ) {
      return (
        item.category.name ||
        ""
      );
    }

    return (
      item.category ||
      ""
    );
  };

  // ======================================================
  // GET AUTHOR
  // ======================================================

  const getNewsAuthor = (item) => {
    return (
      item.author ||
      (language === "kn"
        ? "ಸಮಾನತೆಯ ಧ್ವನಿ"
        : "Samanateya Dhwani")
    );
  };

  // ======================================================
  // GET DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString(
        language === "kn"
          ? "kn-IN"
          : "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );
    } catch {
      return "";
    }
  };

  const getNewsDate = (item) => {
    return (
      formatDate(
        item.publishedAt ||
          item.publishDate ||
          item.createdAt
      )
    );
  };

  // ======================================================
  // GET PAPER DETAILS
  // ======================================================

  const getPaperTitle = (paper) => {
    if (language === "kn") {
      return (
        paper.titleKn ||
        paper.title ||
        "ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆ"
      );
    }

    return (
      paper.titleEn ||
      paper.title ||
      "Samara Dhwani Monthly Newspaper"
    );
  };

  const getPaperDescription = (
    paper
  ) => {
    if (language === "kn") {
      return (
        paper.descriptionKn ||
        paper.description ||
        "ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆಯ ಸಂಚಿಕೆ."
      );
    }

    return (
      paper.descriptionEn ||
      paper.description ||
      "Samara Dhwani Monthly Newspaper edition."
    );
  };

  const getPdfUrl = (paper) => {
    return (
      paper.pdfUrl ||
      paper.pdf ||
      paper.fileUrl ||
      paper.file ||
      ""
    );
  };

  const getCoverImage = (paper) => {
    return (
      paper.coverImage ||
      paper.coverImageUrl ||
      paper.image ||
      paper.imageUrl ||
      ""
    );
  };

  const getPaperMonthYear = (
    paper
  ) => {
    if (
      paper.month &&
      paper.year
    ) {
      return `${paper.month} ${paper.year}`;
    }

    if (paper.issueDate) {
      return formatDate(
        paper.issueDate
      );
    }

    if (paper.publishedAt) {
      return formatDate(
        paper.publishedAt
      );
    }

    if (paper.createdAt) {
      return formatDate(
        paper.createdAt
      );
    }

    return "";
  };

  // ======================================================
  // CURRENT NEWS PAPER HTML
  // Used for paid PDF/print download.
  // ======================================================

  const createNewsPaperHtml = () => {
    const issueDate =
      new Date().toLocaleDateString(
        language === "kn"
          ? "kn-IN"
          : "en-IN",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );

    const articlesHtml =
      news
        .map((item, index) => {
          const title =
            getNewsTitle(item);

          const description =
            getNewsDescription(
              item
            );

          const content =
            getNewsContent(item);

          const category =
            getNewsCategory(item);

          const author =
            getNewsAuthor(item);

          const date =
            getNewsDate(item);

          const image =
            getNewsImage(item);

          const articleText =
            content ||
            description;

          return `
            <article class="paper-article ${
              index === 0
                ? "lead-article"
                : ""
            }">

              ${
                image
                  ? `
                    <img
                      src="${image}"
                      class="paper-image"
                      alt=""
                    />
                  `
                  : ""
              }

              <div class="paper-category">
                ${category}
              </div>

              <h2>
                ${title}
              </h2>

              ${
                description
                  ? `<p class="paper-description">
                      ${description}
                    </p>`
                  : ""
              }

              <p>
                ${articleText}
              </p>

              <div class="paper-meta">
                ${date || issueDate}
                ${
                  author
                    ? ` | ${author}`
                    : ""
                }
              </div>

            </article>
          `;
        })
        .join("");

    return `
      <!DOCTYPE html>

      <html lang="${
        language === "kn"
          ? "kn"
          : "en"
      }">

      <head>

        <meta charset="UTF-8" />

        <title>
          ${text.newspaperEdition}
        </title>

        <style>

          @page {
            size: A4;
            margin: 12mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #ffffff;
            color: #111111;
            font-family:
              Georgia,
              "Noto Serif Kannada",
              "Times New Roman",
              serif;
          }

          .paper {
            width: 100%;
          }

          .paper-header {
            text-align: center;
            border-top: 5px solid #111;
            border-bottom: 3px solid #111;
            padding: 15px 0 12px;
            margin-bottom: 12px;
          }

          .paper-name {
            margin: 0;
            font-size: 38px;
            font-weight: 900;
            letter-spacing: 1px;
          }

          .paper-subtitle {
            margin-top: 4px;
            font-family: Arial, sans-serif;
            font-size: 10px;
            font-weight: bold;
            letter-spacing: 4px;
          }

          .paper-date {
            margin-top: 8px;
            padding: 5px 0;
            border-top: 1px solid #111;
            border-bottom: 1px solid #111;
            font-family: Arial, sans-serif;
            font-size: 10px;
          }

          .paper-grid {
            column-count: 3;
            column-gap: 18px;
          }

          .paper-article {
            break-inside: avoid;
            margin-bottom: 18px;
            padding-bottom: 13px;
            border-bottom: 1px solid #333;
          }

          .lead-article {
            column-span: all;
            border-bottom: 2px solid #111;
            margin-bottom: 18px;
          }

          .paper-image {
            width: 100%;
            max-height: 210px;
            object-fit: cover;
            filter: grayscale(100%);
            display: block;
            margin-bottom: 8px;
          }

          .paper-category {
            font-family: Arial, sans-serif;
            font-size: 8px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 5px;
          }

          h2 {
            margin: 0 0 6px;
            font-size: 20px;
            line-height: 1.2;
          }

          .lead-article h2 {
            font-size: 31px;
          }

          p {
            margin: 0 0 7px;
            font-size: 11px;
            line-height: 1.55;
            text-align: justify;
          }

          .paper-description {
            font-weight: bold;
          }

          .paper-meta {
            font-family: Arial, sans-serif;
            font-size: 7px;
            font-weight: bold;
            color: #444;
          }

          .paper-footer {
            margin-top: 20px;
            padding-top: 8px;
            border-top: 3px solid #111;
            text-align: center;
            font-family: Arial, sans-serif;
            font-size: 8px;
          }

        </style>

      </head>

      <body>

        <div class="paper">

          <header class="paper-header">

            <h1 class="paper-name">
              ${text.newspaperEdition}
            </h1>

            <div class="paper-subtitle">
              ${text.newspaperSubtitle}
            </div>

            <div class="paper-date">
              ${issueDate}
            </div>

          </header>

          <main class="paper-grid">

            ${articlesHtml}

          </main>

          <footer class="paper-footer">
            © ${new Date().getFullYear()}
            ${text.newspaperEdition}
            •
            ${text.newspaperSubtitle}
          </footer>

        </div>

      </body>

      </html>
    `;
  };

  // ======================================================
  // LOAD RAZORPAY SCRIPT
  // ======================================================

  const loadRazorpay = () => {
    return new Promise(
      (resolve, reject) => {
        if (
          window.Razorpay
        ) {
          resolve(true);
          return;
        }

        const script =
          document.createElement(
            "script"
          );

        script.src =
          "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () =>
          resolve(true);

        script.onerror = () =>
          reject(
            new Error(
              "Razorpay failed to load."
            )
          );

        document.body.appendChild(
          script
        );
      }
    );
  };

  // ======================================================
  // CREATE PAYMENT ORDER
  // ======================================================

  const createPaymentOrder =
    async (downloadType) => {
      const response =
        await fetch(
          "/api/payment/create-order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount: 5,
              currency: "INR",
              purpose:
                downloadType,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Unable to create payment order."
        );
      }

      return data;
    };

  // ======================================================
  // VERIFY PAYMENT
  // ======================================================

  const verifyPayment =
    async (paymentData) => {
      const response =
        await fetch(
          "/api/payment/verify",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              paymentData
            ),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Payment verification failed."
        );
      }

      return data;
    };

  // ======================================================
  // OPEN CURRENT NEWS DOWNLOAD
  // ======================================================

  const downloadCurrentNewsPaper =
    () => {
      const html =
        createNewsPaperHtml();

      const printWindow =
        window.open(
          "",
          "_blank",
          "width=1000,height=800"
        );

      if (!printWindow) {
        throw new Error(
          language === "kn"
            ? "ಪಾಪ್-ಅಪ್ ವಿಂಡೋವನ್ನು ಅನುಮತಿಸಿ."
            : "Please allow pop-ups for this website."
        );
      }

      printWindow.document.open();

      printWindow.document.write(
        html
      );

      printWindow.document.close();

      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 800);
    };

  // ======================================================
  // DOWNLOAD MONTHLY PDF
  // ======================================================

  const downloadMonthlyPdf =
    () => {
      if (!selectedPaper) {
        return;
      }

      const pdfUrl =
        getPdfUrl(
          selectedPaper
        );

      if (!pdfUrl) {
        throw new Error(
          language === "kn"
            ? "PDF ಲಭ್ಯವಿಲ್ಲ."
            : "PDF is unavailable."
        );
      }

      const link =
        document.createElement(
          "a"
        );

      link.href = pdfUrl;

      link.download =
        `${getPaperTitle(
          selectedPaper
        )}.pdf`;

      link.target =
        "_blank";

      link.rel =
        "noopener noreferrer";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();
    };

  // ======================================================
  // PAYMENT + DOWNLOAD
  // ======================================================

  const handlePaidDownload =
    async (type) => {
      try {
        setPaymentLoading(true);
        setPaymentError("");

        /*
          IMPORTANT:

          Payment must be created on
          the backend.

          Do NOT create Razorpay orders
          only from React because users
          could change the amount.
        */

        await loadRazorpay();

        const order =
          await createPaymentOrder(
            type
          );

        const razorpayKey =
          order?.key ||
          order?.keyId ||
          order?.razorpayKey;

        const orderId =
          order?.orderId ||
          order?.id ||
          order?.order?.id;

        if (!razorpayKey) {
          throw new Error(
            "Razorpay key was not returned by the server."
          );
        }

        if (!orderId) {
          throw new Error(
            "Payment order ID was not returned by the server."
          );
        }

        await new Promise(
          (
            resolve,
            reject
          ) => {
            const options = {
              key: razorpayKey,

              amount:
                order?.amount ||
                500,

              currency:
                order?.currency ||
                "INR",

              name:
                "Samanateya Dhwani",

              description:
                language === "kn"
                  ? "ಪತ್ರಿಕೆ PDF ಡೌನ್‌ಲೋಡ್"
                  : "Newspaper PDF Download",

              order_id:
                orderId,

              handler:
                async function (
                  response
                ) {
                  try {
                    const verification =
                      await verifyPayment(
                        {
                          razorpay_order_id:
                            response.razorpay_order_id,

                          razorpay_payment_id:
                            response.razorpay_payment_id,

                          razorpay_signature:
                            response.razorpay_signature,

                          purpose:
                            type,
                        }
                      );

                    if (
                      verification?.success ===
                        false
                    ) {
                      throw new Error(
                        verification?.message ||
                          "Payment verification failed."
                      );
                    }

                    /*
                      Only after backend
                      verification do we
                      allow download.
                    */

                    if (
                      type ===
                      "current-news-paper"
                    ) {
                      downloadCurrentNewsPaper();
                    } else if (
                      type ===
                      "monthly-paper"
                    ) {
                      downloadMonthlyPdf();
                    }

                    resolve();
                  } catch (error) {
                    reject(error);
                  }
                },

              modal: {
                ondismiss:
                  function () {
                    reject(
                      new Error(
                        language === "kn"
                          ? "ಪಾವತಿ ರದ್ದುಗೊಂಡಿದೆ."
                          : "Payment was cancelled."
                      )
                    );
                  },
              },

              prefill: {
                name: "",
                email: "",
                contact: "",
              },

              theme: {
                color:
                  "#111111",
              },
            };

            const razorpay =
              new window.Razorpay(
                options
              );

            razorpay.on(
              "payment.failed",
              function (
                response
              ) {
                reject(
                  new Error(
                    response?.error
                      ?.description ||
                      "Payment failed."
                  )
                );
              }
            );

            razorpay.open();
          }
        );
      } catch (error) {
        console.error(
          "Paid download error:",
          error
        );

        setPaymentError(
          error?.message ||
            text.paymentUnavailable
        );
      } finally {
        setPaymentLoading(false);
      }
    };

  // ======================================================
  // SORT NEWS
  // ======================================================

  const sortedNews =
    useMemo(() => {
      return [...news].sort(
        (a, b) => {
          const dateA =
            new Date(
              a.publishedAt ||
                a.publishDate ||
                a.createdAt ||
                0
            ).getTime();

          const dateB =
            new Date(
              b.publishedAt ||
                b.publishDate ||
                b.createdAt ||
                0
            ).getTime();

          return dateB - dateA;
        }
      );
    }, [news]);

  const leadNews =
    sortedNews[0];

  const remainingNews =
    sortedNews.slice(1);

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <main className="monthly-paper-page">

      {/* ==================================================
          NEWSPAPER HEADER
      ================================================== */}

      <section className="newspaper-top-header">

        <div className="container">

          <div className="newspaper-masthead">

            <div className="masthead-side">
              <span>
                {new Date().toLocaleDateString(
                  language === "kn"
                    ? "kn-IN"
                    : "en-IN",
                  {
                    weekday:
                      "short",
                    day: "numeric",
                    month:
                      "short",
                    year:
                      "numeric",
                  }
                )}
              </span>
            </div>

            <div className="masthead-center">

              <div className="masthead-logo">
                ಸ
              </div>

              <h1>
                ಸಮಾನತೆಯ ಧ್ವನಿ
              </h1>

              <span>
                {language === "kn"
                  ? "ಸುದ್ದಿ ವಾಹಿನಿ"
                  : "NEWS CHANNEL"}
              </span>

            </div>

            <div className="masthead-side right">
              <span>
                {language === "kn"
                  ? "ಜನರ ಧ್ವನಿ"
                  : "VOICE OF THE PEOPLE"}
              </span>
            </div>

          </div>

          <div className="masthead-rule"></div>

          <div className="newspaper-tagline">
            {language === "kn"
              ? "ನಿಖರ ಸುದ್ದಿ • ಜವಾಬ್ದಾರಿಯುತ ಪತ್ರಿಕೋದ್ಯಮ • ಜನರ ಧ್ವನಿ"
              : "Accurate News • Responsible Journalism • Voice of the People"}
          </div>

        </div>

      </section>


      {/* ==================================================
          MODE SELECTOR
      ================================================== */}

      <section className="newspaper-mode-section">

        <div className="container">

          <div className="newspaper-mode-switcher">

            <button
              type="button"
              className={
                activeMode === "news"
                  ? "mode-button active"
                  : "mode-button"
              }
              onClick={() => {
                setActiveMode(
                  "news"
                );
                setPaymentError("");
              }}
            >
              📰
              <span>
                {text.readNews}
              </span>
            </button>

            <button
              type="button"
              className={
                activeMode ===
                "monthly"
                  ? "mode-button active"
                  : "mode-button"
              }
              onClick={() => {
                setActiveMode(
                  "monthly"
                );
                setPaymentError("");
              }}
            >
              🗞️
              <span>
                {text.monthlyPaper}
              </span>
            </button>

          </div>

        </div>

      </section>


      {/* ==================================================
          CURRENT NEWS PAPER
      ================================================== */}

      {activeMode === "news" && (

        <section className="newspaper-reader-section">

          <div className="container">

            <div className="newspaper-toolbar">

              <div>
                <span className="toolbar-kicker">
                  {text.latestNews}
                </span>

                <h2>
                  {text.allNews}
                </h2>
              </div>

              <button
                type="button"
                className="newspaper-paid-button"
                onClick={() =>
                  handlePaidDownload(
                    "current-news-paper"
                  )
                }
                disabled={
                  paymentLoading ||
                  news.length === 0
                }
              >
                {paymentLoading
                  ? "..."
                  : `📄 ${text.downloadNews}`}
              </button>

            </div>


            {paymentError && (
              <div className="newspaper-payment-error">
                ⚠️ {paymentError}
              </div>
            )}


            {newsLoading && (
              <div className="newspaper-loading">
                <div className="newspaper-spinner"></div>

                <p>
                  {text.loading}
                </p>
              </div>
            )}


            {!newsLoading &&
              newsError && (
                <div className="newspaper-error">

                  <h3>
                    {newsError}
                  </h3>

                  <button
                    type="button"
                    onClick={
                      loadNews
                    }
                  >
                    {text.retry}
                  </button>

                </div>
              )}


            {!newsLoading &&
              !newsError &&
              news.length === 0 && (
                <div className="newspaper-empty">
                  📰
                  <h3>
                    {text.noNews}
                  </h3>
                </div>
              )}


            {!newsLoading &&
              !newsError &&
              news.length > 0 && (

                <article className="newspaper-sheet">

                  {/* ======================================
                      PAPER TOP
                  ====================================== */}

                  <header className="paper-sheet-header">

                    <div className="paper-edition">
                      {text.newspaperEdition}
                    </div>

                    <h1>
                      {language === "kn"
                        ? "ದಿನದ ಸುದ್ದಿ ಪತ್ರಿಕೆ"
                        : "DAILY NEWS PAPER"}
                    </h1>

                    <div className="paper-sheet-meta">
                      <span>
                        {new Date().toLocaleDateString(
                          language === "kn"
                            ? "kn-IN"
                            : "en-IN",
                          {
                            day:
                              "numeric",
                            month:
                              "long",
                            year:
                              "numeric",
                          }
                        )}
                      </span>

                      <span>
                        {sortedNews.length}{" "}
                        {language === "kn"
                          ? "ಸುದ್ದಿಗಳು"
                          : "Stories"}
                      </span>
                    </div>

                  </header>


                  {/* ======================================
                      LEAD STORY
                  ====================================== */}

                  {leadNews && (

                    <article className="paper-lead-story">

                      <div className="paper-lead-content">

                        <span className="paper-category">
                          {getNewsCategory(
                            leadNews
                          )}
                        </span>

                        <h2>
                          {getNewsTitle(
                            leadNews
                          )}
                        </h2>

                        <p className="paper-lead-description">
                          {getNewsDescription(
                            leadNews
                          )}
                        </p>

                        <p className="paper-lead-content-text">
                          {getNewsContent(
                            leadNews
                          )}
                        </p>

                        <div className="paper-byline">
                          {text.reportedBy}{" "}
                          {getNewsAuthor(
                            leadNews
                          )}
                          {getNewsDate(
                            leadNews
                          )
                            ? ` • ${getNewsDate(
                                leadNews
                              )}`
                            : ""}
                        </div>

                      </div>

                      {getNewsImage(
                        leadNews
                      ) && (
                        <img
                          src={getNewsImage(
                            leadNews
                          )}
                          alt={getNewsTitle(
                            leadNews
                          )}
                          className="paper-lead-image"
                        />
                      )}

                    </article>

                  )}


                  {/* ======================================
                      OTHER STORIES
                  ====================================== */}

                  <div className="paper-news-grid">

                    {remainingNews.map(
                      (item, index) => {

                        const content =
                          getNewsContent(
                            item
                          );

                        const description =
                          getNewsDescription(
                            item
                          );

                        return (
                          <article
                            className={
                              index <
                              2
                                ? "paper-story paper-story-featured"
                                : "paper-story"
                            }
                            key={
                              item._id ||
                              item.id ||
                              index
                            }
                          >

                            {getNewsImage(
                              item
                            ) && (
                              <img
                                src={getNewsImage(
                                  item
                                )}
                                alt={getNewsTitle(
                                  item
                                )}
                                className="paper-story-image"
                                loading="lazy"
                              />
                            )}

                            <span className="paper-category">
                              {getNewsCategory(
                                item
                              )}
                            </span>

                            <h3>
                              {getNewsTitle(
                                item
                              )}
                            </h3>

                            {description && (
                              <p className="paper-story-description">
                                {
                                  description
                                }
                              </p>
                            )}

                            {content && (
                              <p className="paper-story-content">
                                {content}
                              </p>
                            )}

                            <div className="paper-byline">
                              {getNewsDate(
                                item
                              )}
                              {" • "}
                              {getNewsAuthor(
                                item
                              )}
                            </div>

                          </article>
                        );
                      }
                    )}

                  </div>


                  {/* ======================================
                      PAPER FOOTER
                  ====================================== */}

                  <footer className="paper-sheet-footer">

                    <strong>
                      ಸಮಾನತೆಯ ಧ್ವನಿ
                    </strong>

                    <span>
                      {language === "kn"
                        ? "ನಿಮ್ಮ ಧ್ವನಿ – ನಮ್ಮ ಜವಾಬ್ದಾರಿ"
                        : "Your Voice – Our Responsibility"}
                    </span>

                  </footer>

                </article>
              )}

          </div>

        </section>
      )}


      {/* ==================================================
          MONTHLY PAPER
      ================================================== */}

      {activeMode === "monthly" && (

        <section className="monthly-reader-section">

          <div className="container">

            <div className="monthly-reader-heading">

              <div>

                <span>
                  MONTHLY PUBLICATION
                </span>

                <h2>
                  {text.monthlyTitle}
                </h2>

                <p>
                  {language === "kn"
                    ? "ಸಮರ ಧ್ವನಿ ಮಾಸಿಕ ಪತ್ರಿಕೆಯ ಸಂಚಿಕೆಯನ್ನು ಇದೇ ಪುಟದಲ್ಲಿ ಓದಿ."
                    : "Read the Samara Dhwani monthly newspaper directly on this page."}
                </p>

              </div>

            </div>


            {papersLoading && (
              <div className="newspaper-loading">

                <div className="newspaper-spinner"></div>

                <p>
                  {text.loading}
                </p>

              </div>
            )}


            {!papersLoading &&
              papersError && (
                <div className="newspaper-error">

                  <h3>
                    {papersError}
                  </h3>

                  <button
                    type="button"
                    onClick={
                      loadMonthlyPapers
                    }
                  >
                    {text.retry}
                  </button>

                </div>
              )}


            {!papersLoading &&
              !papersError &&
              papers.length === 0 && (
                <div className="newspaper-empty">

                  🗞️

                  <h3>
                    {text.noPapers}
                  </h3>

                </div>
              )}


            {!papersLoading &&
              !papersError &&
              papers.length > 0 && (

                <>

                  {/* ==================================
                      EDITION SELECTOR
                  ================================== */}

                  <div className="monthly-edition-selector">

                    <label>
                      {text.selectEdition}
                    </label>

                    <select
                      value={
                        selectedPaper?._id ||
                        selectedPaper?.id ||
                        ""
                      }
                      onChange={(event) => {

                        const selected =
                          papers.find(
                            (paper) =>
                              String(
                                paper._id ||
                                  paper.id
                              ) ===
                              event.target
                                .value
                          );

                        setSelectedPaper(
                          selected ||
                            null
                        );

                        setPaymentError(
                          ""
                        );
                      }}
                    >

                      {papers.map(
                        (
                          paper,
                          index
                        ) => (

                          <option
                            key={
                              paper._id ||
                              paper.id ||
                              index
                            }
                            value={
                              paper._id ||
                              paper.id ||
                              ""
                            }
                          >
                            {getPaperTitle(
                              paper
                            )}
                            {getPaperMonthYear(
                              paper
                            )
                              ? ` — ${getPaperMonthYear(
                                  paper
                                )}`
                              : ""}
                          </option>

                        )
                      )}

                    </select>

                  </div>


                  {selectedPaper && (

                    <article className="monthly-paper-viewer">

                      {/* ==================================
                          PDF HEADER
                      ================================== */}

                      <div className="monthly-viewer-header">

                        <div>

                          <span>
                            {getPaperMonthYear(
                              selectedPaper
                            )}
                          </span>

                          <h2>
                            {getPaperTitle(
                              selectedPaper
                            )}
                          </h2>

                        </div>

                        <button
                          type="button"
                          className="monthly-paid-download"
                          onClick={() =>
                            handlePaidDownload(
                              "monthly-paper"
                            )
                          }
                          disabled={
                            paymentLoading
                          }
                        >
                          {paymentLoading
                            ? "..."
                            : `📥 ${text.download}`}
                        </button>

                      </div>


                      {paymentError && (
                        <div className="newspaper-payment-error">
                          ⚠️ {paymentError}
                        </div>
                      )}


                      {/* ==================================
                          PDF
                      ================================== */}

                      {getPdfUrl(
                        selectedPaper
                      ) ? (

                        <div className="monthly-pdf-container">

                          <iframe
                            src={
                              getPdfUrl(
                                selectedPaper
                              )
                            }
                            title={getPaperTitle(
                              selectedPaper
                            )}
                            className="monthly-pdf-frame"
                          />

                        </div>

                      ) : (

                        <div className="monthly-pdf-empty">

                          <span>
                            📄
                          </span>

                          <h3>
                            {language ===
                            "kn"
                              ? "PDF ಲಭ್ಯವಿಲ್ಲ"
                              : "PDF unavailable"}
                          </h3>

                        </div>

                      )}


                      {/* ==================================
                          PAPER INFORMATION
                      ================================== */}

                      <div className="monthly-viewer-information">

                        {getCoverImage(
                          selectedPaper
                        ) && (

                          <img
                            src={getCoverImage(
                              selectedPaper
                            )}
                            alt={getPaperTitle(
                              selectedPaper
                            )}
                          />

                        )}

                        <div>

                          <h3>
                            {getPaperTitle(
                              selectedPaper
                            )}
                          </h3>

                          <p>
                            {getPaperDescription(
                              selectedPaper
                            )}
                          </p>

                        </div>

                      </div>

                    </article>

                  )}

                </>
              )}

          </div>

        </section>
      )}


      {/* ==================================================
          SOCIAL MEDIA
      ================================================== */}

      <section className="newspaper-social-section">

        <div className="container">

          <div className="newspaper-social-box">

            <div>

              <span>
                {text.social}
              </span>

              <h2>
                {language === "kn"
                  ? "ಸಮಾನತೆಯ ಧ್ವನಿಯೊಂದಿಗೆ ಸಂಪರ್ಕದಲ್ಲಿರಿ"
                  : "Stay Connected with Samanateya Dhwani"}
              </h2>

            </div>

            <div className="newspaper-social-links">

              <a
                href={
                  socialLinks.youtube
                }
                target="_blank"
                rel="noopener noreferrer"
                className="social-youtube"
              >
                ▶ YouTube
              </a>

              <a
                href={
                  socialLinks.facebook
                }
                target="_blank"
                rel="noopener noreferrer"
                className="social-facebook"
              >
                f Facebook
              </a>

              <a
                href={
                  socialLinks.instagram
                }
                target="_blank"
                rel="noopener noreferrer"
                className="social-instagram"
              >
                ◎ Instagram
              </a>

              <a
                href={
                  socialLinks.x
                }
                target="_blank"
                rel="noopener noreferrer"
                className="social-x"
              >
                X
              </a>

              <a
                href={
                  socialLinks.whatsapp
                }
                target="_blank"
                rel="noopener noreferrer"
                className="social-whatsapp"
              >
                ☎ WhatsApp
              </a>

              <a
                href={
                  socialLinks.telegram
                }
                target="_blank"
                rel="noopener noreferrer"
                className="social-telegram"
              >
                ➤ Telegram
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* ==================================================
          FINAL FOOTER NOTE
      ================================================== */}

      <section className="newspaper-final-note">

        <div className="container">

          <strong>
            ಸಮಾನತೆಯ ಧ್ವನಿ
          </strong>

          <span>
            {language === "kn"
              ? "ನಿಮ್ಮ ಧ್ವನಿ – ನಮ್ಮ ಜವಾಬ್ದಾರಿ"
              : "Your Voice – Our Responsibility"}
          </span>

        </div>

      </section>

    </main>
  );
}

export default MonthlyPaper;