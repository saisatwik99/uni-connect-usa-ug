import React, { useState } from "react";
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

import allStates from "./data/allstates.json";
import universities from "./data/universities.json";
import text from "./data/text.json";
import cities from "./data/cities.json";
import logos from "./data/logos.json";
import icons from "./data/icons.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

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

const MapChart = () => {
  const [hoveredState, setHoveredState] = useState(null);

  const handleStateHover = (geo) => {
    setHoveredState(geo.id);
  };

  const handleStateHoverEnd = () => {
    setHoveredState(null);
  };

  return (
    <div className={`map-container`}>
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
                      geo.id === hoveredState ? "hovered" : ""
                    }`}
                    onMouseEnter={() => handleStateHover(geo)}
                    onMouseLeave={handleStateHoverEnd}
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
                href={process.env.PUBLIC_URL + item.logo}
                width="15"
                height="15"
                className="marker"
              />
            </Marker>
          ))}
          {icons.map((item, index) => (
            <Marker key={index} coordinates={[item.lon, item.lat]}>
              <image
                href={process.env.PUBLIC_URL + item.logo}
                width="15"
                height="15"
                className="marker"
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default MapChart;
