import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const ThreeDModel = () => {
  const mountRef = useRef(null);
  const modelRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const spinRef = useRef(true); // track spinning state

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 80, 200);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(50, 100, 100);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.5;
    controls.minDistance = 20;
    controls.maxDistance = 500;
    controlsRef.current = controls;

    // Stop spinning on any user interaction
    const stopSpin = () => (spinRef.current = false);
    controls.addEventListener("start", stopSpin);
    renderer.domElement.addEventListener("mousedown", stopSpin);
    renderer.domElement.addEventListener("wheel", stopSpin);

    // Load model
    const loader = new GLTFLoader();
    loader.load("/FinalDashboard/Model/Model3.gltf", (gltf) => {
      scene.add(gltf.scene);
      modelRef.current = gltf.scene;

      

      // Center and scale model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.position.sub(center);

      // Shift model up slightly
      gltf.scene.position.y += 180;
      gltf.scene.position.x += 20;

      const size = box.getSize(new THREE.Vector3()).length();
      const scale = 2000 / size;
      gltf.scene.scale.setScalar(scale);

      // Fit camera
      const distance = size * 0.9;
      camera.position.set(center.x + distance, center.y + distance, center.z + distance);
      camera.lookAt(center);
      controls.target.copy(center);
      controls.update();

      
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (modelRef.current && spinRef.current) {
        modelRef.current.rotation.y += 0.005;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      controls.removeEventListener("start", stopSpin);
      renderer.domElement.removeEventListener("mousedown", stopSpin);
      renderer.domElement.removeEventListener("wheel", stopSpin);
      window.removeEventListener("resize", handleResize);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  // Rotate model
  const rotateModel = (direction) => {
    if (!modelRef.current) return;
    spinRef.current = false;
    const step = 0.1;
    switch (direction) {
      case "left":
        modelRef.current.rotation.y += step;
        break;
      case "right":
        modelRef.current.rotation.y -= step;
        break;
      case "up":
        modelRef.current.rotation.x += step;
        break;
      case "down":
        modelRef.current.rotation.x -= step;
        break;
      default:
        break;
    }
  };

  // Zoom straight in/out
  const zoomModel = (direction) => {
    if (!cameraRef.current || !controlsRef.current) return;
    spinRef.current = false;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const zoomStep = direction === "in" ? 10 : -10;
    const viewDir = new THREE.Vector3();
    camera.getWorldDirection(viewDir);
    camera.position.addScaledVector(viewDir, zoomStep);
    camera.lookAt(controls.target);
  };

  // Styles
  const arrowStyles = {
    position: "absolute",
    background: "rgba(255, 255, 255, 0.9)",
    border: "1px solid #888",
    borderRadius: "8px",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    padding: "0",
    fontSize: "25px",
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Rotate Buttons - Top Right */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "120px",
          height: "120px",
          borderRadius: "12px",
          background: "rgba(50, 50, 50, 0.1)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button onClick={() => rotateModel("up")} style={{ ...arrowStyles, top: "5px" }} title="Rotate Up">↑</button>
        <button onClick={() => rotateModel("down")} style={{ ...arrowStyles, bottom: "5px" }} title="Rotate Down">↓</button>
        <button onClick={() => rotateModel("left")} style={{ ...arrowStyles, left: "5px" }} title="Rotate Left">↺</button>
        <button onClick={() => rotateModel("right")} style={{ ...arrowStyles, right: "5px" }} title="Rotate Right">↻</button>
      </div>

      {/* Zoom Buttons - Bottom Left */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          left: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 10,
        }}
      >
        <button onClick={() => zoomModel("in")} style={{ ...arrowStyles, position: "relative" }} title="Zoom In">＋</button>
        <button onClick={() => zoomModel("out")} style={{ ...arrowStyles, position: "relative" }} title="Zoom Out">－</button>
      </div>
    </div>
  );
};

export default ThreeDModel;
