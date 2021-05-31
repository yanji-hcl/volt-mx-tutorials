import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import XHR from "i18next-http-backend";
import { languages, defaultLanguage } from "./config";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const getTranslations = (languageIndex) => {
  return require("../../public/locales/" +
    languages[languageIndex] +
    "/translations.json");
};

const getcategories = (language) => {
  const { hikesData } = publicRuntimeConfig;

  const categories = hikesData.map((categoryFolderName) => {
    const category = require("../../public/locales/" +
      language +
      `/categories/${categoryFolderName}/tours.json`);

    return category;
  });

  return categories;
};

const locales = Object.assign(
  {},
  ...Object.keys(languages).map((index) => {
    const categoryDetails = getTranslations(index);

    const translations = {
      ...categoryDetails,
      categories: getcategories(languages[index]),
    };
    return {
      [languages[index]]: {
        translations,
      },
    };
  })
);

const detection = {
  // order and from where user language should be detected
  order: ["navigator"],
};

i18next
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: detection,
    fallbackLng: defaultLanguage,
    resources: locales,
    ns: ["translations"],
    defaultNS: "translations",
    returnObjects: true,
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
  });

export default i18next;
