import React, { Component, useEffect, useState } from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import styles from "../../../style.scss";
import { isDev, BASE_PATH_URL } from "../../../../src/config";
import HikeHeader from "../../../../src/components/HikeHeader";
import HikeBreadCrumb from "../../../../src/components/HikeBreadCrumb";
import KonyButton from "../../../../src/components/KonyButton";
import i18next from "i18next";
import {
  getAllStaticTourSlugs,
  getAllTourSlugs,
  getLanguage,
  getTourData,
} from "../../../../src/lib/lang";
import { getZipDownloadUrl } from "../../../../src/utils/request";

export default function TourPage({ language, paths, url }) {
  const [tourDetails, setTourDetails] = useState(null);
  const [categoryAlias, setcategoryAlias] = useState(null);

  const fetchTourDetails = async () => {
    const { tourData, categoryAlias } = await getTourData(url, language);
    setcategoryAlias(categoryAlias);
    setTourDetails(tourData);
  };

  useEffect(
    () => {
      fetchTourDetails();
      return () => {};
    },
    [language]
  );

  const getPostMessage = () => {
    const date = new Date();

    const fileURL = getZipDownloadUrl(
      tourDetails?.fileName,
      categoryAlias,
      language
    );

    console.log(fileURL);

    return {
      namespace: "hike",
      msg_id: `id_${date.getTime()}`,
      msg_type: "POST",
      request: {
        context: "tour",
        category: tourDetails?.category,
        title: tourDetails?.title,
        checksum: tourDetails?.checksum,
        download_url: fileURL,
        version: tourDetails?.hikeVersion,
        filename: tourDetails?.fileName,
        kuid: tourDetails?.kuid,
        id: `${date.getTime()}`,
      },
    };
  };

  const sendPostMessage = (e) => {
    e.preventDefault();
    e.message = getPostMessage();

    if (typeof e.message !== "undefined") {
      getVizSource().postMessage(e.message, "*");
    }

    return false;
  };

  const defaultImage = "default/hike-default.png";

  const tourImage = isDev
    ? `/${defaultImage}`
    : `/${BASE_PATH_URL}/${defaultImage}`;

  return (
    <div className={styles.hikeBody}>
      <HikeHeader currentLang={language} search={null} />
      <div className={styles.tourContainer}>
        <HikeBreadCrumb title={tourDetails?.title} search={null} />
        <div className={styles.tourInfo}>
          <div className={styles.tourThumb}>
            <img src={tourImage} alt="Hike Thumbnail" />
          </div>
          <div className={styles.tourDesc}>
            <h2 className={styles.tourTitle}>{tourDetails?.title}</h2>
            <h3 className={styles.tourVersion}>{`${i18next.t("hike_version")} ${
              tourDetails?.hikeVersion
            }`}</h3>
            <div
              className={styles.tourBody}
              dangerouslySetInnerHTML={{ __html: tourDetails?.description }}
            />
            <Row className={styles.metaData}>
              <Col
                span={6}
                sm={24}
                xs={24}
                md={6}
                lg={6}
                className={styles.innerTabWrapper}
              >
                <h3 className={styles.tourHeader}>
                  {i18next.t("platform_version")}
                </h3>
                <div className={styles.tourContent}>
                  {tourDetails?.platformVersion}
                </div>
              </Col>
              <Col
                span={6}
                sm={24}
                xs={24}
                md={6}
                lg={6}
                className={styles.innerTabWrapper}
              >
                <h3 className={styles.tourHeader}>
                  {i18next.t("tourCategories")}
                </h3>
                <ul className={styles.tourContent}>
                  {tourDetails?.category?.map((cat) => <li>{cat}</li>)}
                </ul>
              </Col>
            </Row>
            <h3 className={styles.tourTime}>
              {`${tourDetails?.cards} ${i18next.t(`steps`)} - ${
                tourDetails?.time
              }`}
            </h3>
            <div
              className={styles.tourDetails}
              dangerouslySetInnerHTML={{ __html: tourDetails?.details }}
            />
          </div>
          <div className={styles.startBtn}>
            <KonyButton
              title={i18next.t("start")}
              type="blue"
              onClick={(e) => sendPostMessage(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    fallback: false,
    paths: getAllStaticTourSlugs(),
  };
}

export async function getStaticProps({ params }) {
  const language = getLanguage(params.lang);

  return {
    props: {
      language,
      paths: getAllTourSlugs(),
      url: params.alias,
    },
  };
}
