import React, { useEffect, useState, memo } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { CityFetcher } from "../utils/fetchCities";

import CityMarker from "./CityMarker";
import GEO_JSON from "../data/world-110m.json";

const getMarkers = (setMarkers, cities) => {
  if (cities) {
    // filter out cities with population < 50000 to optimize rendering
    let markers = Object.values(cities).filter(
      (city) => city.population >= 50000
    );
    setMarkers(markers);
  }
};

const renderMarkers = (
  markers,
  scale,
  setTooltipContent,
  setIsModalOpen,
  withTransition = false
) => {
  if (markers) {
    if (withTransition) {
      // transitions are non-performant, make withTransition = false for now
      return (
        <TransitionGroup component={null}>
          {markers
            .filter((city) => city.population > 1000000 / scale)
            .map((city) => (
              <CSSTransition
                key={city.id}
                classNames="city-marker"
                timeout={500}
              >
                <CityMarker
                  key={city.id}
                  info={city}
                  scale={scale}
                  setTooltipContent={setTooltipContent}
                  setIsModalOpen={setIsModalOpen}
                />
              </CSSTransition>
            ))}
        </TransitionGroup>
      );
    } else {
      return (
        <>
          {markers
            .filter((city) => city.population > 1000000 / scale)
            .map((city) => (
              <CityMarker
                key={city.id}
                info={city}
                scale={scale}
                setTooltipContent={setTooltipContent}
                setIsModalOpen={setIsModalOpen}
              />
            ))}
        </>
      );
    }
  }
};

function MyVerticallyCenteredModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Centered Modal</h4>
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="light" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

const WorldMap = () => {
  let [markers, setMarkers] = useState([]);
  let [scale, setScale] = useState(1);
  let [tooltipContent, setTooltipContent] = useState("");
  let [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // useEffect is synchronous, call async function within useEffect to fetch
    (async () => {
      let cities = await CityFetcher.get();
      getMarkers(setMarkers, cities);
    })();
  }, []);

  return (
    <div data-tip="">
      <ComposableMap>
        <ZoomableGroup
          onMoveEnd={(...args) => {
            setScale(args[0].zoom);
          }}
        >
          <Geographies geography={GEO_JSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                console.log(geo);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="rgb(0,0,0,0)"
                    stroke="rgb(256,256,256,0.5)"
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                    tabIndex={-1}
                  />
                );
              })
            }
          </Geographies>
          {renderMarkers(markers, scale, setTooltipContent, setIsModalOpen)}
        </ZoomableGroup>
      </ComposableMap>
      <ReactTooltip className="city-tooltip" multiline={true} html={true}>
        {tooltipContent}
      </ReactTooltip>
      <MyVerticallyCenteredModal
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default memo(WorldMap);
