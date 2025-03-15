import React, { useState, useEffect } from "react";
import { geoCentroid } from "d3-geo";
import "./style.css";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
  ZoomableGroup,
} from "react-simple-maps";

import StateModal from "./components/StateModal";
import allStates from "./data/allstates.json";
import universities from "./data/universities.json";
import text from "./data/text.json";
import cities from "./data/cities.json";
import logos from "./data/logos.json";
import icons from "./data/icons.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// List of states that have PDF content
const statesWithContent = [
  "Alabama", "Arizona", "Arkansas", "California", "Colorado", 
  "Connecticut", "Florida", "Georgia", "Illinois", "Indiana", 
  "Iowa", "Kansas", "Kentucky", "Louisiana", "Maryland", 
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
  "Missouri", "Nebraska", "New Hampshire", "New Jersey", 
  "New Mexico", "New York", "North Carolina", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "South Carolina", 
  "Tennessee", "Utah", "Virginia", "Washington"
];

const offsets = {
  VT: [-10, -90],
  NH: [100, -70],
  MA: [100, -50],
  RI: [130, 2],
  CT: [60, 7],
  NJ: [170, 1],
  DE: [50, -15],
  MD: [140, 20],
  DC: [49, 50],
};

const getCorrectLogoPath = (logoPath) => {
  // Split the path into parts
  const pathParts = logoPath.split('/');
  
  // Find the index of 'logos' or 'icons'
  const folderIndex = pathParts.findIndex(part => 
    part.toLowerCase() === 'logos' || part.toLowerCase() === 'icons'
  );
  
  if (folderIndex >= 0) {
    // Ensure the folder name is lowercase (logos or icons)
    pathParts[folderIndex] = pathParts[folderIndex].toLowerCase();
    
    // Capitalize the state name (if it exists)
    if (folderIndex + 1 < pathParts.length) {
      const stateName = pathParts[folderIndex + 1];
      pathParts[folderIndex + 1] = stateName.charAt(0).toUpperCase() + stateName.slice(1);
      
      // Capitalize the logo name (if it exists)
      if (folderIndex + 2 < pathParts.length) {
        const logoName = pathParts[folderIndex + 2];
        pathParts[folderIndex + 2] = logoName.charAt(0).toUpperCase() + logoName.slice(1);
      }
    }
    
    return pathParts.join('/');
  }
  
  return logoPath;
};

const MapChart = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [stateModalShow, setStateModalShow] = React.useState(false);
  const [stateContent, setStateContent] = useState({});
  const [clickableStates, setClickableStates] = useState({});

  // Initialize clickable states on component mount
  useEffect(() => {
    const clickableStateMap = {};
    allStates.forEach(state => {
      clickableStateMap[state.val] = statesWithContent.includes(state.name);
    });
    setClickableStates(clickableStateMap);
  }, []);

  const openStateModal = (stateId) => {
    const stateData = allStates.find(state => state.id === stateId);
    if (stateData && statesWithContent.includes(stateData.name)) {
      setStateContent(stateData);
      setStateModalShow(true);
    }
  };

  const closeStateModal = () => {
    setStateModalShow(false);
    setStateContent({});
  };

  const handleStateHover = (geo) => {
    setHoveredState(geo.id);
  };

  const handleStateHoverEnd = () => {
    setHoveredState(null);
  };

  const handleStateClick = (geo) => {
    // Only open modal if state has content
    if (clickableStates[geo.id]) {
      const stateId = allStates.find(s => s.val === geo.id)?.id;
      if (stateId) {
        openStateModal(stateId);
      }
    }
  };

  return (
    <div className={`map-container ${stateModalShow ? "blurred" : ""}`}>
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          rotate: [58, 20, 3],
          scale: 1250,
        }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) => (
              <>
                {geographies.map((geo) => (
                  <Geography
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none" },
                      pressed: { outline: "none" },
                    }}
                    key={geo.rsmKey}
                    geography={geo}
                    className={`geography ${
                      geo.id === hoveredState ? (clickableStates[geo.id] ? "hovered" : "hovered-disabled") : ""
                    }`}
                    onMouseEnter={() => handleStateHover(geo)}
                    onMouseLeave={handleStateHoverEnd}
                    onClick={() => handleStateClick(geo)}
                    cursor={clickableStates[geo.id] ? "pointer" : "default"}
                  />
                ))}
                {geographies.map((geo) => {
                  const centroid = geoCentroid(geo);
                  const cur = allStates.find((s) => s.val === geo.id);
                  return (
                    <g key={geo.rsmKey + "-name"}>
                      {cur &&
                        centroid[0] > -160 &&
                        centroid[0] < -67 &&
                        (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                          <>
                            <Marker coordinates={centroid}>
                              <text
                                y="2"
                                fontSize={5}
                                fontWeight={700}
                                textAnchor="middle"
                              >
                                {cur.name}
                              </text>
                            </Marker>
                          </>
                        ) : (
                          <Annotation
                            subject={centroid}
                            dx={offsets[cur.id][0]}
                            dy={offsets[cur.id][1]}
                          >
                            <text
                              x={0}
                              y={-5}
                              fontSize={5}
                              fontWeight={700}
                              alignmentBaseline="middle"
                            >
                              {cur.name}
                            </text>
                          </Annotation>
                        ))}
                    </g>
                  );
                })}
              </>
            )}
          </Geographies>
          {universities.map((item, index) => (
            <Marker key={index} coordinates={[item.lon, item.lat]}>
              <text
                textAnchor="middle"
                style={{ fill: item.colour }}
                fontWeight={530}
                className="marker"
                cursor="pointer"
                onClick={() =>
                  window.open(process.env.PUBLIC_URL + item.link, "_blank")
                }
              >
                {item.name.split("\n").map((line, idx) => (
                  <tspan x={0} dy={idx === 0 ? 0 : 5} key={idx}>
                    {line}
                  </tspan>
                ))}
              </text>
            </Marker>
          ))}
          {cities.map((item, index) => (
            <Marker key={index} coordinates={[item.lon, item.lat]}>
              <text
                textAnchor="middle"
                style={{ fill: "black" }}
                fontFamily=""
                fontWeight={700}
                fontSize={5}
                className="marker"
              >
                {item.name}
              </text>
            </Marker>
          ))}
          {text.map((item, index) => (
            <Marker key={index} coordinates={[item.lon, item.lat]}>
              <text
                textAnchor="middle"
                style={{ fill: "black" }}
                fontWeight={500}
                fontSize={5}
                className="marker"
              >
                {item.name.split("\n").map((line, idx) => (
                  <tspan x={0} dy={idx === 0 ? 0 : 5} key={idx}>
                    {line}
                  </tspan>
                ))}
              </text>
            </Marker>
          ))}
          {logos.map((item, index) => (
            <Marker key={index} coordinates={[item.lon, item.lat]}>
              <image
                href={process.env.PUBLIC_URL + getCorrectLogoPath(item.logo)}
                width="15"
                height="15"
                className="marker"
              />
            </Marker>
          ))}
          {icons.map((item, index) => (
            <Marker key={index} coordinates={[item.lon, item.lat]}>
              <image
                href={process.env.PUBLIC_URL + getCorrectLogoPath(item.logo)}
                width="15"
                height="15"
                className="marker"
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      <StateModal show={stateModalShow} onHide={closeStateModal} content={stateContent} />
    </div>
  );
};

export default MapChart;
