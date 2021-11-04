import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Button from "react-bootstrap/Button";
import WorldMap from "./WorldMap";

const renderModeButtons = (
  isCityMode,
  setIsCityMode,
  showOnlyCapitals,
  setshowOnlyCapitals
) => (
  <div className="toggle-buttons-container">
    <Button
      className={`toggle-button ${
        isCityMode ? `show-capitals-button` : `show-capitals-button-hidden`
      }`}
      onClick={() => setshowOnlyCapitals(!showOnlyCapitals)}
    >
      {showOnlyCapitals ? `✓` : `☐`}
      {` only capitals`}
    </Button>
    <Button
      className="toggle-button country-city-mode-button"
      onClick={() => setIsCityMode(!isCityMode)}
    >
      {isCityMode ? `country mode` : `city mode`}
    </Button>
  </div>
);

function App() {
  const [isCityMode, setIsCityMode] = useState(true);
  const [showOnlyCapitals, setshowOnlyCapitals] = useState(false);

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="world-map-container">
        {renderModeButtons(
          isCityMode,
          setIsCityMode,
          showOnlyCapitals,
          setshowOnlyCapitals
        )}
        <WorldMap isCityMode={isCityMode} showOnlyCapitals={showOnlyCapitals} />
      </div>
    </div>
  );
}

export default App;
