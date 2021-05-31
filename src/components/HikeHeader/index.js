import React, { useState } from "react";
import PropTypes from "prop-types";
import Layout from "antd/lib/layout";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Link from "next/link";
import style from "./style.scss";
import HikeSearch from "../HikeSearch";
import { useRouter } from "next/router";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { Menu, Dropdown } from "antd";
import { Icon } from "antd";
import { defaultLanguage, langs } from "../../i18n/config";
import { getCurrentLanguage, getLanguage } from "../../lib/lang";
import { BASE_PATH_URL, isDev } from "../../config";

const { Header } = Layout;

const HikeHeader = ({ search, keyword, currentLang }) => {
  const [lang, setLang] = useState(
    getCurrentLanguage(currentLang || defaultLanguage)
  );
  const router = useRouter();

  const changeLang = (selectedLanguage) => {
    setLang(selectedLanguage.lang);
    const urlAlias = router.query.alias;
    const getProdURL = isDev ? "" : `${BASE_PATH_URL}/`;

    const refreshPath = urlAlias
      ? `/${getProdURL}${selectedLanguage.code}/hikes/tour/${urlAlias}`
      : `/${getProdURL}${selectedLanguage.code}/hikes`;

    // redirect
    router.push(refreshPath);
  };

  const menu = (
    <Menu>
      {langs.map((language) => (
        <Menu.Item onClick={() => changeLang(language)} key={language.code}>
          {language.lang}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Row className={style.headerRow}>
      <Layout className={style.headerLayout}>
        <Header className={style.header}>
          <Row type="flex" justify="space-between">
            <Col span={4} style={{ height: "inherit" }}>
              <Link href={`${publicRuntimeConfig.asset}/${currentLang}/hikes`}>
                <a title="Kony Logo" className={style.logo}>
                  <img
                    src={`${
                      publicRuntimeConfig.asset
                    }/static/dist/images/productlogo.svg`}
                    className={style.logo}
                    alt="logo"
                  />
                  <br />
                </a>
              </Link>
            </Col>
            <Col className={style.camp}>
              <img
                src={`${
                  publicRuntimeConfig.asset
                }/static/dist/images/camp-mountain.svg`}
                alt="camp mountain"
              />
            </Col>
          </Row>
        </Header>
        <div
          {...router.query.alias && { style: { justifyContent: "flex-end" } }}
          className={style.subHeader}
        >
          {search ? (
            <div className={style.search}>
              <HikeSearch keyword={keyword} />
            </div>
          ) : null}
          <div className={style.switchLang}>
            <Dropdown overlay={menu} trigger={["click"]}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <Icon type="global" /> {lang}
                <Icon type="caret-down" />
              </a>
            </Dropdown>
          </div>
        </div>
      </Layout>
    </Row>
  );
};

HikeHeader.propTypes = {
  search: PropTypes.bool,
  keyword: PropTypes.string,
};

HikeHeader.defaultProps = {
  search: true,
  keyword: "",
};

export default HikeHeader;
