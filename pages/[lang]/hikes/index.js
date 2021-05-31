import React, { Component, useEffect, useState } from "react";
import styles from "./../../style.scss";
import HikeHeader from "../../../src/components/HikeHeader";
import ToursList from "../../../src/components/ToursList";
import i18next from "i18next";
import { getAllLanguageSlugs, getLanguage } from "../../../src/lib/lang";

export default function HikesLandingPage({ language, paths }) {
  const categories = () => {
    const hikesCatgories = [
      {
        categoryName: i18next.t("categoryName"),
        categoryDescription: i18next.t("categoryDescription"),
        categoryAlias: "alias",
        categories: i18next.t("categories"),
      },
    ];

    return hikesCatgories[0].categories;
  };

  return (
    <div className={styles.hikeBody}>
      <HikeHeader currentLang={language} />
      <div className={styles.hikeContainer}>
        {categories().map((item) =>
          item.categoryTours !== null ? (
            <ToursList
              key={item.categoryName}
              language={language}
              title={item.categoryName}
              desc={item.categoryDescription}
              alias={item.categoryAlias || item.categoryName}
              tours={item.categoryTours}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getAllLanguageSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const language = getLanguage(params.lang);
  const paths = getAllLanguageSlugs();
  return {
    props: {
      language,
      paths,
    },
  };
}
