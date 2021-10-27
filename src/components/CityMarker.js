import React, { useState } from "react";
import { Marker } from "react-simple-maps";

const CityMarker = ({ coordinates, name, population, scale }) => {
  const getRadius = (population) => Math.sqrt(population / Math.PI) / 200;
  const getColor = (population) => {
    const colors = [
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
    return colors[index];
  };

  const initialRadius = getRadius(population);
  const hoveredRadius = initialRadius * 2;
  let [radius, setRadius] = useState(initialRadius);
  const isVisible = population > 1000000 / scale;
  const opacity = isVisible ? "0.7" : "0";
  const color = getColor(population);
  return (
    <Marker coordinates={coordinates}>
      <circle
        r={`${radius}px`}
        fill={color}
        fillOpacity={opacity}
        style={{ transition: "0.2s ease-in-out" }}
        onMouseEnter={() => {
          setRadius(hoveredRadius);
          console.log(name + " " + population);
        }}
        onMouseLeave={() => {
          setRadius(initialRadius);
        }}
      />
    </Marker>
  );
};

export default CityMarker;
