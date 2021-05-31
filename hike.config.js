const path = require("path");
const fs = require("fs");

const HIKES_BASE_URL = "volt-mx-tutorials";

// en-US by default
const HIKES_CONTENT_PATH = "./public/locales/en-US/categories";

const PROD_URL =
  process.env.NODE_ENV === "production" ? `/${HIKES_BASE_URL}` : "";

// get all hikes categories directory names
const getHikeDirectories = () =>
  fs
    .readdirSync(HIKES_CONTENT_PATH, { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .map((dir) => dir.name);

// initialize landing page (home and list of hikes)
const tours = {
  "/": { page: "/" },
  "/hikes": { page: "/" },
};

const checkTempDirExist = () => {
  return fs.existsSync("./temp");
};
const checkUploadDirExist = () => {
  return fs.existsSync("./uploads");
};

const createTempDir = () => {
  if (!checkTempDirExist) {
    fs.mkdirSync("./temp");
  }
};

const createUploadDirExist = () => {
  if (!checkUploadDirExist) {
    fs.mkdirSync("./uploads");
  }
};

module.exports = {
  HIKES_BASE_URL,
  tours,
  getHikeDirectories,
  checkTempDirExist,
  checkUploadDirExist,
  createTempDir,
  createUploadDirExist,
  PROD_URL,
};
