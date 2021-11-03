import React, { useEffect, useRef, useState, memo } from "react";
import {
  ComposableMap,
  ZoomableGroup,
  Geographies,
  Geography,
} from "react-simple-maps";
import ReactTooltip from "react-tooltip";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { CityFetcher } from "../utils/fetchCities";
import { CityExtractFetcher } from "../utils/fetchCityExtract";

import CityMarker from "./CityMarker";
import CityModal from "./CityModal";
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
  openModal,
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
                  openModal={openModal}
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
                openModal={openModal}
              />
            ))}
        </>
      );
    }
  }
};

// wrap Geographies in a memoized component to prevent re-render after other
// state changes (e.g., loading tooltip (setTooltipContent), zooming (setScale))
const MemoGeographies = memo(() => (
  <Geographies geography={GEO_JSON}>
    {({ geographies }) =>
      geographies.map((geo) => {
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
));

const WorldMap = () => {
  const [showMap, setShowMap] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [scale, setScale] = useState(1);
  const [tooltipContent, setTooltipContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCityInfo, setModalCityInfo] = useState({});
  const nodeRef = useRef(null);

  const openModal = async (cityInfo) => {
    const extractObj = await CityExtractFetcher.get(cityInfo);
    setModalCityInfo({ ...cityInfo, ...extractObj });
    setIsModalOpen(true);
  };

  useEffect(() => {
    setShowMap(true); // true for transition fade on enter

    // useEffect is synchronous, call async function within useEffect to fetch
    (async () => {
      let cities = await CityFetcher.get();
      getMarkers(setMarkers, cities);
    })();
  }, []);

  return (
    <>
      <div data-tip="" className="world-map">
        <CSSTransition
          in={showMap}
          nodeRef={nodeRef}
          classNames="world-map"
          timeout={500}
        >
          <>
            {showMap && (
              <div ref={nodeRef}>
                <ComposableMap>
                  <ZoomableGroup
                    onMoveEnd={(...args) => {
                      setScale(args[0].zoom);
                    }}
                  >
                    <MemoGeographies />
                    {renderMarkers(
                      markers,
                      scale,
                      setTooltipContent,
                      openModal
                    )}
                  </ZoomableGroup>
                </ComposableMap>
                <ReactTooltip
                  className="city-tooltip"
                  multiline={true}
                  html={true}
                >
                  {tooltipContent}
                </ReactTooltip>
              </div>
            )}
          </>
        </CSSTransition>
      </div>
      <CityModal
        cityInfo={modalCityInfo}
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default memo(WorldMap);
