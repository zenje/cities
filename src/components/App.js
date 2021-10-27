import React from "react";
import "./App.css";
import WorldMap from "./WorldMap";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: "100%", height: "100wh" }}>
          <WorldMap />
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
