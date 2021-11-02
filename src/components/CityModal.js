import React from "react";
import { hasFlag } from "country-flag-icons";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import Modal from "./InfoModal";

const getHeader = (cityInfo) => {
  const { adminRegion, country, countryCode, displayName, extractTitle } =
    cityInfo;
  const url = `https://en.wikipedia.org/wiki/${extractTitle}`;
  const flag = hasFlag(countryCode) ? getUnicodeFlagIcon(countryCode) : "";
  const showAdminRegion = adminRegion && displayName !== adminRegion;
  let header = showAdminRegion ? (
    <>
      <a
        className="city-title-link"
        href="/#"
        onClick={() => openInNewTab(url)}
      >{`${displayName}, ${adminRegion}`}</a>
      <br />
      <h6>
        {flag && ` ${flag} `}
        {`${country.toUpperCase()}`}
      </h6>
    </>
  ) : (
    <>
      <a
        className="city-title-link"
        href="/#"
        onClick={() => openInNewTab(url)}
      >{`${displayName}, ${country}`}</a>
      {flag && ` ${flag}`}
    </>
  );
  return header;
};

const openInNewTab = (url) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};

const getExtractContent = (cityInfo) => {
  const { extract, extractTitle } = cityInfo;
  const url = `https://en.wikipedia.org/wiki/${extractTitle}`;
  return (
    <>
      {extract}
      <a className="read-more-link" href="/#" onClick={() => openInNewTab(url)}>
        <small>{`> read more`}</small>
      </a>
    </>
  );
};

const CityModal = (props) => {
  const { cityInfo, ...modalProps } = props;
  return (
    <Modal
      {...modalProps}
      header={getHeader(cityInfo)}
      content={getExtractContent(cityInfo)}
    />
  );
};

export default CityModal;
