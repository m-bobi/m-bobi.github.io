import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2500);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  powerPreference: "high-performance",
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 35, 70);

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Preload all textures
const texturePaths = [
  "./graphics/planet_textureAzure.jpg",
  "./graphics/planet_textureAuric.jpg",
  "./graphics/planet_textureChondrite.jpg",
  "./graphics/planet_textureBurnt.jpg",
  "./graphics/planet_textureBlueGiant.jpg",
  "./graphics/planet_textureCyanic.jpg",
  "./graphics/planet_textureChlorine.jpg",
  "./graphics/planet_textureDust.jpg",
  "./graphics/planet_textureDesertic.jpg",
  "./graphics/planet_textureFluorescent.jpg"
];

const textureLoader = new THREE.TextureLoader();
const textures = texturePaths.map(path => textureLoader.load(path));

// MATERIALS
let dodeMat = new THREE.MeshPhysicalMaterial({
  map: textures[0], // Initial texture
  displacementMap: textures[0],
  aoMap: textures[0],
  bumpMap: textures[0],
  bumpScale: .5,
});

let dode = new THREE.Mesh(
  new THREE.SphereGeometry(10, 50, 50),
  dodeMat
);

btn2.addEventListener("click", function () {
  var rgb = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];

  // Update material properties with random textures
  dodeMat.displacementMap = getRandomTexture(textures);
  dodeMat.aoMap = getRandomTexture(textures);
  dodeMat.displacementScale = Math.floor((Math.random() * 10) + 1);
  dodeMat.map = getRandomTexture(textures);
  dodeMat.bumpMap = getRandomTexture(textures);
  dodeMat.color.set('rgb(' + rgb.join(', ') + ')');
});

// Function to get a random texture from the array
function getRandomTexture(textures) {
  return textures[Math.floor(Math.random() * textures.length)];
}

// SATELLITE
const moonMat = new THREE.TextureLoader().load("/graphics/3Uq2YE8l.jpg")
const normalMoonMat = new THREE.TextureLoader().load("./normalDX.png")
var moonGeometry = new THREE.SphereGeometry(3.5, 50, 50);
var moonMaterial = new THREE.MeshPhongMaterial({
  map: moonMat,
  normalMap: normalMoonMat
});
var moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.set(50, 0, 0);

var ambientLight = new THREE.AmbientLight(0xf1f1f1);
var spotLight = new THREE.DirectionalLight(0xffffff);
spotLight.position.set(50, 50, 50);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;
controls.enableDamping = true;
controls.minPolarAngle = 0.8;
controls.maxPolarAngle = 2.4;
controls.dampingFactor = 0.07;
controls.rotateSpeed = 0.07;

// STARS
function addStar() {
  let starMatNR = new THREE.TextureLoader().load("./graphics/star_textureCustomBlue.jpg");
  starMatNR.wrapS = THREE.RepeatWrapping;
  starMatNR.wrapT = THREE.RepeatWrapping;

  const geometry = new THREE.SphereGeometry(0.5, 24, 24);
  const material = new THREE.MeshStandardMaterial({
    normalMap: starMatNR,
  });

  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(1000));
  star.position.set(x, y, z);
  scene.add(star, spotLight);
}
Array(500).fill().forEach(addStar);

// ANIMATION
var r = 35;
var theta = 0;
var dTheta = 2 * Math.PI / 1000;

function animate() {
  requestAnimationFrame(animate);
  dode.rotation.y += .0005;
  theta += dTheta;
  moon.position.x = r * Math.cos(theta);
  moon.position.z = r * Math.sin(theta);
  controls.update();
  renderer.render(scene, camera);
}
animate();

scene.add(spotLight);
scene.add(ambientLight);
scene.add(moon);
scene.add(dode);

console.log("Scene polycount:", renderer.info.render.triangles);
console.log("Active Drawcalls:", renderer.info.render.calls);
console.log("Textures in Memory", renderer.info.memory.textures);
console.log("Geometries in Memory", renderer.info.memory.geometries);
