import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let isPaused = false;

Object.defineProperty(window, "isPaused", {
  get: () => isPaused,
  set: (val) => { isPaused = val; }
});


// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030303);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer (optimized)
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.getElementById("canvas-target").appendChild(renderer.domElement);

// --- Lighting (bright, reflective environment) ---
scene.add(new THREE.AmbientLight(0xffffff, 5.0));

const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 4.0);
hemi.position.set(0, 20, 0);
scene.add(hemi);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 10.0);
dirLight1.position.set(10, 15, 10);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffffff, 10.0);
dirLight2.position.set(-10, 15, -10);
scene.add(dirLight2);

const dirLight3 = new THREE.DirectionalLight(0xffffff, 6.0);
dirLight3.position.set(0, -10, 0);
scene.add(dirLight3);

// Add a few point lights for extra reflections
const point1 = new THREE.PointLight(0xffffff, 8.0, 50);
point1.position.set(5, 5, 5);
scene.add(point1);

const point2 = new THREE.PointLight(0xffffff, 8.0, 50);
point2.position.set(-5, 5, -5);
scene.add(point2);

// --- Model holder ---
let model = null;

// Preload model with promise
async function loadModel() {
  return new Promise((resolve, reject) => {
    new GLTFLoader().load(
      './content/models/cybersigil.glb',
      (gltf) => resolve(gltf.scene),
      undefined,
      (error) => reject(error)
    );
  });
}

(async () => {
  try {
    model = await loadModel();

    // Center and scale camera
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();

    model.position.sub(center);
    scene.add(model);

    camera.position.set(0, size / 3, size);
    camera.lookAt(0, 0, 0);
  } catch (err) {
    console.error('Error loading model:', err);
  }
})();

// --- Lenis setup ---
let scrollPercent = 0;
let lenis;
if (window.Lenis) {
  lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  lenis.on('scroll', ({ scroll, limit }) => {
    scrollPercent = scroll / limit; // 0 → 1
  });
} else {
  window.addEventListener('scroll', () => {
    const doc = document.documentElement;
    scrollPercent = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
  });
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    if (model) {
      const fullRotations = 1;
      model.rotation.y = scrollPercent * Math.PI * 2 * fullRotations;
    }
    renderer.render(scene, camera);
  }
}
animate();


// --- Navbar observer for .black ---
const nav = document.querySelector("nav");
const observer = new MutationObserver(() => {
  if (nav.classList.contains("black")) {
    isPaused = true;
  } else {
    isPaused = false;
  }
});

observer.observe(nav, { attributes: true, attributeFilter: ["class"] });

// --- Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
