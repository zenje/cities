import React, { useEffect, useState, memo } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import { CSSTransition, TransitionGroup } from "react-transition-group";

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
    // filter out cities with population < 50000 to optimize rendering
    let markers = Object.values(cities).filter((marker) => marker[14] >= 50000);
    setMarkers(markers);
  }
};

const renderMarkers = (markers, scale, setTooltipContent) => {
  if (markers) {
    return (
      <TransitionGroup component={null}>
        {markers
          .filter((marker) => marker[14] > 1000000 / scale)
          .map((marker) => (
            <CSSTransition
              key={marker[0]}
              classNames="city-marker"
              timeout={500}
            >
              <CityMarker
                key={marker[0]}
                name={marker[2]}
                population={marker[14]}
                coordinates={[marker[5], marker[4]]}
                scale={scale}
                setTooltipContent={setTooltipContent}
              />
            </CSSTransition>
          ))}
      </TransitionGroup>
    );
  }
};

const WorldMap = () => {
  let [markers, setMarkers] = useState([]);
  let [scale, setScale] = useState(1);
  let [tooltipContent, setTooltipContent] = useState("");

  useEffect(() => {
    // useEffect is synchronous, call async function within useEffect to fetch data
    (async () => {
      let cities = await getCities();
      getMarkers(setMarkers, cities);
    })();
  }, []);

  return (
    <div>
      <ComposableMap data-tip="">
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
          {renderMarkers(markers, scale, setTooltipContent)}
        </ZoomableGroup>
      </ComposableMap>
      <ReactTooltip>{tooltipContent}</ReactTooltip>
    </div>
  );
};

export default memo(WorldMap);
