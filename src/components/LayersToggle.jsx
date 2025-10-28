
import React, { useState } from "react";
import styles from "./LayersToggle.module.css";

const LayersToggle = () => {
  const [layers, setLayers] = useState({
    lamps: true,
    benches: true,
    turnstiles: true,
    pavegenTiles: true,
    paths: true,
    sunnySpots: true,
  });

  const handleChange = (layer) => {
    setLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
    // Later: Add code here to toggle the layer visibility in your 3D model
  };

  return (
    <div className={styles.container}>
      <span className={styles.heading}>Layers</span>

      {Object.keys(layers).map((layerKey) => (
        <label key={layerKey} className={styles.label}>
          <input
            type="checkbox"
            checked={layers[layerKey]}
            onChange={() => handleChange(layerKey)}
            className={styles.checkbox}
          />
          {layerKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} {/* Nicely formats camelCase */}
        </label>
      ))}
    </div>
  );
};

export default LayersToggle;
