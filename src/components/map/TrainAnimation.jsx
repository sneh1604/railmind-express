// src/components/map/TrainAnimation.jsx

import React, { useState, useEffect } from 'react';
import { Marker } from '@react-google-maps/api';
import { FaTrain } from 'react-icons/fa';

/**
 * Animates a train icon along a given map path.
 * @param {object} props - The component props.
 * @param {Array<object>} props.path - Array of {lat, lng} objects for the animation path.
 * @param {number} [props.duration=15000] - Total duration of the animation in milliseconds.
 * @param {function} [props.onJourneyComplete] - Callback function when train reaches destination.
 */
const TrainAnimation = ({ path, duration = 15000, onJourneyComplete }) => {
  const [position, setPosition] = useState(path[0]);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrameId;

    const animate = (timestamp) => {
      if (startTime === undefined) {
        startTime = timestamp;
      }
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Calculate total distance of the route
      let totalDistance = 0;
      for (let i = 0; i < path.length - 1; i++) {
        totalDistance += window.google.maps.geometry.spherical.computeDistanceBetween(
          path[i],
          path[i + 1]
        );
      }

      // Find the segment and position based on progress
      const distanceCovered = progress * totalDistance;
      let cumulativeDistance = 0;

      for (let i = 0; i < path.length - 1; i++) {
        const segmentStart = path[i];
        const segmentEnd = path[i + 1];
        const segmentDistance = window.google.maps.geometry.spherical.computeDistanceBetween(
          segmentStart,
          segmentEnd
        );

        if (cumulativeDistance + segmentDistance >= distanceCovered) {
          const distanceIntoSegment = distanceCovered - cumulativeDistance;
          const fraction = distanceIntoSegment / segmentDistance;
          
          const newPos = window.google.maps.geometry.spherical.interpolate(
            segmentStart,
            segmentEnd,
            fraction
          );

          const newHeading = window.google.maps.geometry.spherical.computeHeading(
            segmentStart,
            segmentEnd
          );

          setPosition(newPos);
          setRotation(newHeading);
          break;
        }
        cumulativeDistance += segmentDistance;
      }
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Journey complete - trigger callback
        if (onJourneyComplete) {
          onJourneyComplete();
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [path, duration, onJourneyComplete]);

  // SVG icon for the train for better rotation control
  const trainIcon = {
    path: 'M 2.5,2.5 C 2.5,2.5 2.5,2.5 2.5,2.5 H 17.5 C 17.5,2.5 17.5,2.5 17.5,2.5 V 13.5 H 2.5 Z M 5,16.5 a 2.5,2.5 0 1 0 0,-5 2.5,2.5 0 1 0 0,5 z m 10,0 a 2.5,2.5 0 1 0 0,-5 2.5,2.5 0 1 0 0,5 z',
    fillColor: '#E67E22',
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: '#2C3E50',
    rotation: rotation,
    scale: 1.5,
    anchor: new window.google.maps.Point(10, 10),
  };

  return (
    <Marker
      position={position}
      icon={trainIcon}
      zIndex={100} // Ensure train is on top of the route
    />
  );
};

export default TrainAnimation;