import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Qgis2threejs.css";

const ThreeDViewer = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    // Initialize Qgis2threejs app
    const app = window.Q3D.application;
    app.init(container);

    // Sun and ambient light
    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 500;
    sun.shadow.bias = -0.0005;
    app.scene.add(sun);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    app.scene.add(ambientLight);

    // Load scene
    app.loadSceneFile("/data/index/scene.js", function () {
      app.start();
    });

    // Sun slider
    const sunSlider = document.getElementById("sunSlider");
    const sunTimeLabel = document.getElementById("sunTimeLabel");

    const updateSun = (hour) => {
      const displayHour = Math.floor(hour % 12) || 12;
      const period = hour < 12 ? "AM" : "PM";
      sunTimeLabel.textContent = `${displayHour}:00 ${period}`;

      const theta = ((hour - 6) / 12) * Math.PI;
      const radius = 100;
      sun.position.set(radius * Math.cos(theta), radius * Math.sin(theta), 50);
      sun.lookAt(0, 0, 0);

      sun.intensity = 0.8;
      ambientLight.intensity = 0.3 + 0.2 * Math.sin(theta);

      app.renderer.render(app.scene, app.camera);
    };

    sunSlider.addEventListener("input", (e) => updateSun(parseFloat(e.target.value)));

    // Initialize sun at default
    updateSun(parseFloat(sunSlider.value));

    return () => {
      // Cleanup if component unmounts
      container.innerHTML = "";
    };
  }, []);

  return (
    <div>
      <div id="header">
        <h1>University of Pretoria 3D Model</h1>
        <input type="range" id="sunSlider" min="6" max="18" step="0.1" defaultValue="12" />
        <span id="sunTimeLabel">12:00 PM</span>
      </div>
      <div id="view" ref={containerRef} style={{ width: "100%", height: "600px" }}></div>
    </div>
  );
};

export default ThreeDViewer;
