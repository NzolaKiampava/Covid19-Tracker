import React from "react";
import { MapContainer as LeafletMap, TileLayer, useMap } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "./util";

function ChangeMapView({ coords }) {
  console.log(coords);
  const map = useMap();
  map.setView([coords.lat, coords.lng], map.getZoom());

  return null;
}

function Map({ casesType, center, zoom, countries }) {
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <ChangeMapView coords={center} />
        {/* Loop through all country and draw circles on screen */}
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map;
