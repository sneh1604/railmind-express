// src/components/map/RouteOverlay.jsx

import React from 'react';
import { Polyline, Marker, InfoWindow } from '@react-google-maps/api';

/**
 * Draws the train route and station markers on the map.
 * @param {object} props - The component props.
 * @param {Array<object>} props.path - Array of {lat, lng} objects for the polyline.
 * @param {Array<object>} props.stations - Array of station objects with name and position.
 */
const RouteOverlay = ({ path, stations }) => {
  const [activeMarker, setActiveMarker] = React.useState(null);

  const handleMarkerClick = (marker) => {
    setActiveMarker(marker);
  };

  return (
    <>
      {/* The train route line */}
      <Polyline
        path={path}
        options={{
          strokeColor: '#4A90E2',
          strokeOpacity: 0.8,
          strokeWeight: 6,
          icons: [{
            icon: {
              path: 'M 0,-1 0,1', // A dash symbol
              strokeOpacity: 1,
              scale: 4
            },
            offset: '0',
            repeat: '20px'
          }],
        }}
      />

      {/* Markers for each station */}
      {stations.map((station) => (
        <Marker
          key={station.name}
          position={station.position}
          onClick={() => handleMarkerClick(station)}
          icon={{
            url: 'https://maps.google.com/mapfiles/kml/shapes/rail.png',
            scaledSize: new window.google.maps.Size(40, 40),
            anchor: new window.google.maps.Point(20, 20),
          }}
        />
      ))}

      {/* Info window for the clicked marker */}
      {activeMarker && (
        <InfoWindow
          position={activeMarker.position}
          onCloseClick={() => setActiveMarker(null)}
        >
          <div className="station-info-window">
            <h4>{activeMarker.name}</h4>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default RouteOverlay;