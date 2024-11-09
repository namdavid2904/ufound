// client/src/components/ARPinPlacement.js
import React, { useEffect, useState } from 'react';
import * as AFRAME from 'aframe';
import 'aframe-look-at-component';
import { ARjs } from 'ar.js';

// Custom A-Frame component for pin placement
AFRAME.registerComponent('pin-placement', {
  init: function() {
    this.el.addEventListener('click', (event) => {
      // Get camera position and rotation
      const camera = document.querySelector('[camera]');
      const position = camera.getAttribute('position');
      const rotation = camera.getAttribute('rotation');
      
      // Create pin marker
      const marker = document.createElement('a-box');
      marker.setAttribute('position', position);
      marker.setAttribute('rotation', rotation);
      marker.setAttribute('color', 'red');
      marker.setAttribute('scale', '0.2 0.2 0.2');
      
      this.el.sceneEl.appendChild(marker);
      
      // Save location data
      const locationData = {
        position: {
          x: position.x,
          y: position.y,
          z: position.z
        },
        rotation: {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z
        }
      };
      
      // Emit event with location data
      this.el.emit('pin-placed', locationData);
    });
  }
});

const ARPinPlacement = ({ onLocationSaved }) => {
  const [isARSupported, setIsARSupported] = useState(true);
  const [locationData, setLocationData] = useState(null);
  const [indoorPosition, setIndoorPosition] = useState(null);

  useEffect(() => {
    // Check for WebXR support
    if (!navigator.xr && !window.WebXRPolyfill) {
      setIsARSupported(false);
      return;
    }

    // Initialize indoor positioning if available
    initializeIndoorPositioning();
  }, []);

  const initializeIndoorPositioning = async () => {
    try {
      // Try to get indoor position using available sensors
      if (window.DeviceMotionEvent && window.DeviceOrientationEvent) {
        // Request permissions for sensors
        await Promise.all([
          DeviceMotionEvent.requestPermission(),
          DeviceOrientationEvent.requestPermission()
        ]);

        // Initialize indoor positioning system
        window.addEventListener('devicemotion', handleDeviceMotion);
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    } catch (error) {
      console.log('Indoor positioning not available:', error);
    }
  };

  const handleDeviceMotion = (event) => {
    // Process accelerometer data for indoor positioning
    const acceleration = event.accelerationIncludingGravity;
    // Use acceleration data to estimate position changes
    // This is a simplified version - you'd need more complex algorithms for accurate indoor positioning
    setIndoorPosition(prevPosition => {
      if (!prevPosition) return { x: 0, y: 0, z: 0 };
      return {
        x: prevPosition.x + acceleration.x * 0.01,
        y: prevPosition.y + acceleration.y * 0.01,
        z: prevPosition.z + acceleration.z * 0.01
      };
    });
  };

  const handleDeviceOrientation = (event) => {
    // Process compass/orientation data
    const { alpha, beta, gamma } = event;
    // Use orientation data to determine device direction
  };

  const handlePinPlaced = async (locationData) => {
    try {
      // Get GPS coordinates if outdoors
      const gpsPosition = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          }),
          error => reject(error),
          { enableHighAccuracy: true }
        );
      });

      // Combine GPS, indoor positioning, and AR placement data
      const combinedLocation = {
        gps: gpsPosition,
        indoor: indoorPosition,
        arPlacement: locationData,
        timestamp: new Date().toISOString()
      };

      // Save to backend
      const response = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedLocation)
      });

      if (response.ok) {
        const savedLocation = await response.json();
        onLocationSaved(savedLocation);
      }
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  if (!isARSupported) {
    return <div>AR is not supported on your device</div>;
  }

  return (
    <a-scene
      embedded
      arjs="sourceType: webcam; debugUIEnabled: false;"
      renderer="antialias: true; alpha: true"
      vr-mode-ui="enabled: false"
    >
      {/* Camera */}
      <a-entity camera position="0 1.6 0">
        <a-cursor></a-cursor>
      </a-entity>

      {/* Scene content */}
      <a-entity pin-placement>
        {/* Placement guide */}
        <a-ring
          position="0 0 -1"
          radius-inner="0.1"
          radius-outer="0.15"
          color="#fff"
          opacity="0.5"
        ></a-ring>
      </a-entity>

      {/* Instructions */}
      <a-text
        value="Tap to place pin"
        position="0 0.5 -1"
        scale="0.5 0.5 0.5"
        align="center"
        color="#fff"
      ></a-text>
    </a-scene>
  );
};

export default ARPinPlacement;