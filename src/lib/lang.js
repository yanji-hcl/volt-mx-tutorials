import { languages, defaultLanguage, langs } from "../i18n/config";
import getConfig from "next/config";
import { getHikesData } from "../utils/populate";
const { publicRuntimeConfig } = getConfig();

export function getSortedLangsData() {
  return languages;
}

export function getAllLanguageSlugs() {
  return languages.map((lang) => {
    return { params: { lang: lang } };
  });
}

export function getLanguage(lang) {
  return languages.includes(lang) ? lang : defaultLanguage;
}

export const getCurrentLanguage = (currLang) => {
  const res = langs.find((lang) => lang.code === currLang);
  return res.lang;
};

export const getAllTourSlugs = () => {
  const paths = [];
  languages.forEach((lang) => {
    const { hikesData } = publicRuntimeConfig;

    hikesData.forEach((categoryFolderNAme) => {
      const category = require(`../../public/locales/${lang}/categories/${categoryFolderNAme}/tours.json`);

      const { categoryTours } = category;

      const toursAlias = categoryTours.map((tour) => tour.alias);

      toursAlias.forEach((alias) => {
        paths.push({ params: { lang, alias } });
      });
    });
  });

  return paths;
};

export const getAllStaticTourSlugs = () => {
  const paths = [];
  languages.forEach((lang) => {
    const { hikesData } = publicRuntimeConfig;

    hikesData.forEach((categoryFolderNAme) => {
      const category = require(`../../public/locales/${lang}/categories/${categoryFolderNAme}/tours.json`);

      const { categoryTours } = category;

      const toursAlias = categoryTours.map((tour) => tour.alias);

      toursAlias.forEach((alias) => {
        paths.push({ params: { lang, alias } });
      });
    });
  });

  return paths;
};

export const getTourData = async (alias, lang) => {
  const { hikesData } = publicRuntimeConfig;

  const categories = await getHikesData(hikesData, lang);

  const tour = categories.find((element) =>
    element.categoryTours.some((subElement) => subElement.alias === alias)
  );

  const tourData = tour.categoryTours.find(
    (subElement) => subElement.alias === alias
  );

  return {
    categoryAlias: tour.categoryAlias,
    tourData,
  };
};
