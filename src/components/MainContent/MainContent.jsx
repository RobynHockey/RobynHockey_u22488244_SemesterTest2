import React from "react";
import "./MainContent.css";
import ThreeDModel from "../Model/3DModel"; // simple import
import BaseMapToggle from "../BaseMapToggle"; // import the new buttons
import LayersToggle from "../LayersToggle";

const MainContent = () => {
  return (
    <main className="main-content">
      <h2>Interactive 3D Model</h2>
      <h3>University of Pretoria</h3>
      
      {/* Buttons outside the 3D model */}
      <BaseMapToggle />
      {/* layers toggle */}
      <LayersToggle />

      <div className="model-container">
        <ThreeDModel/>
        
      </div>
    </main>
  );
};

export default MainContent;
