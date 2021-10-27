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

const renderMarkers = (markers, scale) => {
  const getCircle = (population) => {
    let radius = Math.sqrt(population / Math.PI) / 200;
    return <circle r={`${radius}px`} fill="#F53" fillOpacity="0.5" />;
  };

  if (markers) {
    markers = markers.filter((city) => city[14] > 1000000 / scale);
    return markers.map((marker, index) => (
      <Marker key={index} coordinates={[marker[5], marker[4]]}>
        {getCircle(marker[14])}
      </Marker>
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
                    fill={"lightblue"}
                    stroke={"white"}
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
