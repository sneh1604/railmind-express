// src/components/map/GoogleMapView.jsx

import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import LoadingSpinner from '../common/LoadingSpinner';
import RouteOverlay from './RouteOverlay';
import TrainAnimation from './TrainAnimation';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px',
};

// Example route data from Mumbai to Delhi
const exampleRoute = {
  path: [
    { lat: 19.0760, lng: 72.8777 }, // Mumbai
    { lat: 21.1458, lng: 79.0882 }, // Nagpur
    { lat: 26.2183, lng: 78.1828 }, // Gwalior
    { lat: 28.7041, lng: 77.1025 }  // Delhi
  ],
  stations: [
    { name: 'Mumbai CST', position: { lat: 19.0760, lng: 72.8777 } },
    { name: 'Nagpur Junction', position: { lat: 21.1458, lng: 79.0882 } },
    { name: 'Gwalior Junction', position: { lat: 26.2183, lng: 78.1828 } },
    { name: 'New Delhi', position: { lat: 28.7041, lng: 77.1025 } },
  ]
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  styles: [ // Custom map styles for a clean look
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
  ],
};


/**
 * The main Google Map view container.
 * @param {object} props - The component props.
 * @param {object} [props.route=exampleRoute] - The route data to display.
 */
const GoogleMapView = ({ route = exampleRoute }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_Maps_API_KEY,
    libraries: ['geometry'], // Important: Load the geometry library for calculations
  });

  if (!isLoaded) return <LoadingSpinner />;

  return (
    <div className="map-view-wrapper">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={route.path[0]} // Center map on the starting point
        zoom={5}
        options={mapOptions}
      >
        {/* Children components receive the map instance automatically */}
        <RouteOverlay path={route.path} stations={route.stations} />
        <TrainAnimation path={route.path} />
      </GoogleMap>
    </div>
  );
};

export default GoogleMapView;