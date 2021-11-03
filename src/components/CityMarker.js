import React, { useState } from "react";
import { Marker } from "react-simple-maps";
import { nFormatter } from "../utils/nFormatter";
import { MARKER_PROPERTIES } from "../constants";

const getRadius = (population) => Math.sqrt(population / Math.PI) / 200;
const getColor = (population) => {
  const populationBreakpoints = [
    10000000, 5000000, 2000000, 1000000, 500000, 100000,
  ];
  let i = 0;
  for (; i < populationBreakpoints.length; i++) {
    if (population >= populationBreakpoints[i]) {
      break;
    }
  }
  return MARKER_PROPERTIES.COLORS[i];
};

const CityMarker = ({ info, setTooltipContent, openModal }) => {
  const { coordinates, country, displayName, population } = info;
  const initialRadius = getRadius(population);
  const hoveredRadius = initialRadius * 2;
  let [radius, setRadius] = useState(initialRadius);
  const color = getColor(population);
  return (
    <Marker coordinates={coordinates}>
      <circle
        className={MARKER_PROPERTIES.CLASS_NAME}
        r={`${radius}px`}
        fill={color}
        fillOpacity={MARKER_PROPERTIES.FILL_OPACITY}
        stroke={color}
        strokeWidth={MARKER_PROPERTIES.STROKE_WIDTH}
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
        onClick={() => {
          openModal(info);
        }}
      />
    </Marker>
  );
};

export default CityMarker;
