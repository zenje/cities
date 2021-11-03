import React from "react";
import { hasFlag } from "country-flag-icons";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import Modal from "./InfoModal";
import { RESPONSE_ERROR } from "../constants";

const getHeader = (cityInfo) => {
  const { adminRegion, country, countryCode, displayName, extractTitle } =
    cityInfo;
  const url = extractTitle
    ? `https://en.wikipedia.org/wiki/${extractTitle}`
    : undefined;
  const flag = hasFlag(countryCode) ? getUnicodeFlagIcon(countryCode) : "";
  const showAdminRegion = adminRegion && displayName !== adminRegion;
  let header = showAdminRegion ? (
    <>
      <a
        className="city-title-link"
        href="/#"
        onClick={url ? () => openInNewTab(url) : null}
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
        onClick={url ? () => openInNewTab(url) : null}
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
  const { extract, extractTitle, response } = cityInfo;
  if (response === RESPONSE_ERROR) {
    return <>Error: Failed to fetch city info.</>;
  }

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
