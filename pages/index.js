import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { BASE_PATH_URL, isDev } from "../src/config";
import i18next from "i18next";

const MpLanding = () => {
  const router = useRouter();

  useEffect(() => {
    const { pathname } = router;
    const getProdURL = isDev ? "" : `${BASE_PATH_URL}`;

    if (pathname === "/" || pathname === "/hikes") {
      router.push(`/${getProdURL}/${i18next.language}/hikes`);
    }
  });

  return null;
};

export default MpLanding;
