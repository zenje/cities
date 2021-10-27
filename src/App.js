import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import raw from "./data/cities15000.txt";
import logo from "./logo.svg";
import "./App.css";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const getCities = async (setCities) => {
  let cityLines = await fetch(raw)
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

const CityMarker = ({ coordinates, name, population, scale }) => {
  const getRadius = (population) => Math.sqrt(population / Math.PI) / 200;
  const getColor = (population) => {
    const colors = [
      "#10497E",
      "#1D7387",
      "#2A9D8F",
      "#F4A261",
      "#E76F51",
      "#E64C70",
      "#EE8959",
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
    } else if (population >= 200000) {
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

const WorldMap = ({ markers }) => {
  let [scale, setScale] = useState(1);
  return (
    <div>
      <ComposableMap>
        <ZoomableGroup
          onMoveEnd={(...args) => {
            console.log("ARGS", args);
            setScale(args[0].zoom);
            //console.log("ARGS", args);
          }}
        >
          <Geographies geography={geoUrl}>
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

function App() {
  let [markers, setMarkers] = useState([]);

  useEffect(() => {
    // useEffect is synchronous, call async function within useEffect to fetch data
    (async () => {
      let cities = await getCities();
      getMarkers(setMarkers, cities);
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: "100%", height: "100wh" }}>
          <WorldMap markers={markers} />
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
