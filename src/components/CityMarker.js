import React, { useState } from "react";
import { Marker } from "react-simple-maps";

const FILL_OPACITY = 0.3;
const STROKE_WIDTH = "0.5";
const getRadius = (population) => Math.sqrt(population / Math.PI) / 200;
const getColor = (population) => {
  const COLORS = [
    "#10497E",
    "#1D7387",
    "#2A9D8F",
    "#EE8959",
    "#E76F51",
    "#E64C70",
    "#E52457",
  ];
  let index = 0;
  if (population >= 10000000) {
    index = 0;
  } else if (population >= 5000000) {
    index = 1;
  } else if (population >= 2000000) {
    index = 2;
  } else if (population >= 1000000) {
    index = 3;
  } else if (population >= 500000) {
    index = 4;
  } else if (population >= 100000) {
    index = 5;
  } else {
    index = 6;
  }
  return COLORS[index];
};

const nFormatter = (num, digits) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};

const CityMarker = ({ info, setTooltipContent }) => {
  const { coordinates, country, displayName, name, population } = info;
  const initialRadius = getRadius(population);
  const hoveredRadius = initialRadius * 2;
  let [radius, setRadius] = useState(initialRadius);
  const color = getColor(population);
  return (
    <Marker coordinates={coordinates}>
      <circle
        r={`${radius}px`}
        fill={color}
        fillOpacity={FILL_OPACITY}
        stroke={color}
        strokeWidth={STROKE_WIDTH}
        style={{ transition: "0.2s ease-in-out" }}
        onMouseEnter={() => {
          setTooltipContent(
            `${displayName}, ${country}<br />${nFormatter(population, 1)}`
          );
          setRadius(hoveredRadius);
        }}
        onMouseLeave={() => {
          setTooltipContent("");
          setRadius(initialRadius);
        }}
      />
    </Marker>
  );
};

export default CityMarker;
