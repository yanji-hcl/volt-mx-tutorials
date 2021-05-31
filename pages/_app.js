import Router, { useRouter } from "next/router";
import { Container } from "next/app";
import NProgress from "nprogress";
import Head from "next/head";
import Layout from "../src/components/Layout";
import { gtmId } from "../src/config/settings";
import GoogleTagManager from "../src/components/GoogleTagManager";
import getConfig from "next/config";
import { useEffect } from "react";
import "../src/i18n/init";
import i18next from "i18next";
const { publicRuntimeConfig } = getConfig();

NProgress.configure({ showSpinner: false, minimum: 0.1 });
Router.events.on("beforeHistoryChange", () => NProgress.inc(0.5));
Router.events.on("routeChangeComplete", () => NProgress.done(true));
Router.events.on("routeChangeError", () => NProgress.done(true));
Router.events.on("routeChangeStart", () => {
  NProgress.inc(0.5);
  window.dataLayer.push({
    event: "gtm.dom",
    timeOnPage: Math.abs(
      new Date().getTime() - localStorage.getItem("startTime")
    ),
    prevPath: window.location.pathname,
  });
});

const App = function({ Component, pageProps, store }) {
  i18next.changeLanguage(pageProps.language);
  const router = useRouter();

  useEffect(() => {
    const { pathname } = router;
    if (pathname === "/") {
      router.push("/" + i18next.language + "/hikes");
    }
    return () => {};
  }, []);

  return (
    <html lang="en">
      <Container>
        <Head>
          <title>HCL Volt MX Tutorials</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="stylesheet"
            href={`${publicRuntimeConfig.asset}/static/dist/css/kony.css`}
            type="text/css"
          />
          <script
            src={`${publicRuntimeConfig.asset}/static/dist/js/visualizer.js`}
            className="next-head"
          />
        </Head>
        <GoogleTagManager gtmId={gtmId} />

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Container>
    </html>
  );
};

export default App;
