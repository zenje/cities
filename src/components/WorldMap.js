import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";
import CityMarker from "./CityMarker";
import GEO_JSON from "../data/world-110m.json";
import CITY_DATA from "../data/cities15000.txt";

const getCities = async (setCities) => {
  let cityLines = await fetch(CITY_DATA)
    .then((r) => r.text())
    .then((text) => text.split(/\n/));

  let cities = {};
  for (let line of cityLines) {
    let columns = line.split("\t");
    if (columns) {
      // asciiname, name of geographical point in plain ascii characters
      let city = columns[2];
      cities[city] = columns;
    }
  }
  return cities;
};

const getMarkers = (setMarkers, cities) => {
  if (cities) {
    setMarkers(Object.values(cities));
  }
};

const renderMarkers = (markers, scale) => {
  if (markers) {
    return markers
      .filter((marker) => marker[14] >= 50000)
      .map((marker, index) => (
        <CityMarker
          key={index}
          name={marker[2]}
          population={marker[14]}
          coordinates={[marker[5], marker[4]]}
          scale={scale}
        />
      ));
  }
};

const WorldMap = () => {
  let [markers, setMarkers] = useState([]);
  let [scale, setScale] = useState(1);

  useEffect(() => {
    // useEffect is synchronous, call async function within useEffect to fetch data
    (async () => {
      let cities = await getCities();
      getMarkers(setMarkers, cities);
    })();
  }, []);

  return (
    <div>
      <ComposableMap>
        <ZoomableGroup
          onMoveEnd={(...args) => {
            setScale(args[0].zoom);
            //console.log("ARGS", args);
          }}
        >
          <Geographies geography={GEO_JSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="lightblue"
                    stroke="white"
                    strokeWidth="1px"
                    strokeLinecap="round"
                  />
                );
              })
            }
          </Geographies>
          {renderMarkers(markers, scale)}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
