const webpack = require("webpack");
const withSass = require("@zeit/next-sass");
const withImages = require("next-images");
const prod = process.env.NODE_ENV === "production";
const test = process.env.NODE_ENV === "testing";
const { getHikeDirectories, tours, PROD_URL } = require("./hike.config");
const currentGitBranchName = require("current-git-branch");

module.exports = withImages(
  withSass({
    cssModules: true,
    cssLoaderOptions: {
      localIdentName: prod
        ? "[hash:base64:5]"
        : test
        ? "[path]_[local]"
        : "[path]_[local]--[hash:base64:5]",
      sourceMap: true,
    },
    env: {
      GIT_BRANCH: currentGitBranchName(),
    },
    assetPrefix: PROD_URL,
    publicRuntimeConfig: {
      asset: PROD_URL,
      hikesData: getHikeDirectories(),
    },
    exportPathMap: () => tours,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.node = {
          fs: "empty",
          net: "empty",
          tls: "empty",
        };
      }
      return config;
    },
  })
);
