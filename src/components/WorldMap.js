import React, { useEffect, useState, memo } from "react";
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
));

const WorldMap = () => {
  let [markers, setMarkers] = useState([]);
  let [scale, setScale] = useState(1);
  let [tooltipContent, setTooltipContent] = useState("");
  let [isModalOpen, setIsModalOpen] = useState(false);
  let [modalContent, setModalContent] = useState({});

  const openModal = async (cityInfo) => {
    const extract = await CityExtractFetcher.get(cityInfo);
    setModalContent({ header: cityInfo.displayName, extract });
    setIsModalOpen(true);
  };

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
          <MemoGeographies />
          {renderMarkers(markers, scale, setTooltipContent, openModal)}
        </ZoomableGroup>
      </ComposableMap>
      <ReactTooltip className="city-tooltip" multiline={true} html={true}>
        {tooltipContent}
      </ReactTooltip>
      <CityModal
        header={modalContent.header}
        extract={modalContent.extract}
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default memo(WorldMap);
