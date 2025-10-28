
import React from "react";
import styles from "./BaseMapToggle.module.css"; // import the CSS module

const BaseMapToggle = () => {
  return (
    <div className={styles.container}>
      <span className={styles.heading}>Basemap</span>
      <button className={styles.button}>Satellite Image</button>
      <button className={styles.button}>Open Street Map</button>
    </div>
  );
};

export default BaseMapToggle;
