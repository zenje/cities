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
      let city = columns[2]; // asciiname, name of geographical point in plain ascii characters, varchar(200)
      cities[city] = columns;
    }
  }
  setCities(cities);
  return cities;
};

const getMarkers = (setMarkers, cities) => {
  let markers = [];
  if (cities) {
    let markers = Object.values(cities).filter((city) => city[14] > 1000000);
    setMarkers(markers);
  }
  return markers;
};

const renderMarkers = (markers) => {
  if (markers) {
    //console.log('MARKERS', markers);
    return markers.map((marker, index) => (
      <Marker key={index} coordinates={[marker[5], marker[4]]}>
        <circle r={3} fill="#F53" />
      </Marker>
    ));
  }
};

const WorldMap = ({ markers }) => {
  return (
    <div>
      <ComposableMap>
        <ZoomableGroup
          onMoveEnd={(...args) => {
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
          {renderMarkers(markers)}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

function App() {
  let [cities, setCities] = useState(undefined);
  let [markers, setMarkers] = useState([]);

  useEffect(() => {
    getCities(setCities);
  }, []);

  useEffect(() => {
    getMarkers(setMarkers, cities);
  }, [cities]);

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
