import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Button from "react-bootstrap/Button";
import WorldMap from "./WorldMap";

const renderModeButton = (isCityMode, setIsCityMode) => (
  <Button className="toggle-button" onClick={() => setIsCityMode(!isCityMode)}>
    {isCityMode ? `country mode` : `city mode`}
  </Button>
);

function App() {
  const [isCityMode, setIsCityMode] = useState(true);

  return (
    <div className="App">
      <header className="App-header"></header>
      <div className="world-map-container">
        {renderModeButton(isCityMode, setIsCityMode)}
        <WorldMap isCityMode={isCityMode} />
      </div>
    </div>
  );
}

export default App;
