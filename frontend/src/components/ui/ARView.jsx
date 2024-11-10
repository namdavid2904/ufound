import React, { useEffect } from 'react';

const ARView = () => {
  // Define static coordinates for the AR object
  const latitude = 0.0001;  // Very small value close to zero
    const longitude = 0.0001;

  useEffect(() => {
    // Log the coordinates to verify they are being set
    console.log("Rendering AR object at:", latitude, longitude);
  }, []);

  return (
    <a-scene
      vr-mode-ui="enabled: false"
      embedded
      arjs="sourceType: webcam; debugUIEnabled: false;"
    >
      <a-camera gps-camera rotation-reader></a-camera>
      <a-entity
        gps-entity-place={`latitude: ${latitude}; longitude: ${longitude};`}
        geometry="primitive: box"
        material="color: blue;"
        scale="5 5 5"  // Increase scale
        ></a-entity>
    </a-scene>
  );
};

export default ARView;