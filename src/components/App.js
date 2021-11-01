import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import WorldMap from "./WorldMap";

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="world-map">
        <WorldMap />
      </div>
    </div>
  );
}

export default App;
