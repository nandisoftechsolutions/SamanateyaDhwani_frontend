import React from "react";

import { useLanguage } from "../context/LanguageContext";

import "./Loading.css";

function Loading() {
  const { t } = useLanguage();

  return (
    <div className="loading-container">

      <div className="loading-spinner"></div>

      <p>
        {t.loading}
      </p>

    </div>
  );
}

export default Loading;