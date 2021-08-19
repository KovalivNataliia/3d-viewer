import { GLTFLoader } from './js/GLTFLoader.js';
import { CanvasUI } from '../../js/CanvasUI.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

// Rerender
const renderer = new THREE.WebGLRenderer();
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z = 4;
camera.position.x = 3;

// Objects
const loader = new GLTFLoader();

loader.load('scene.gltf', function (gltf) {
  let model = gltf.scene;
  model.traverse(n => {
    if (n.isMesh) {
      n.castShadow = true;
      n.receiveShadow = true;
    }
  });
  scene.add(model);
})

const planeGeometry = new THREE.PlaneGeometry(5, 5);
planeGeometry.rotateX(- Math.PI / 2);

const circleGeometry = new THREE.CircleGeometry( 0.12, 32 );

// Materials
const planeMaterial = new THREE.ShadowMaterial();
planeMaterial.opacity = 0.5;

const circleMaterial = new THREE.MeshBasicMaterial( {map: new THREE.TextureLoader().load('./UI/circle.png'), side: THREE.DoubleSide} );

// Mesh
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.y = -1.2;
plane.position.z = -1.7;
plane.position.x = -2.1;
plane.receiveShadow = true;
scene.add(plane);

const circle1 = new THREE.Mesh(circleGeometry, circleMaterial);
circle1.position.set(0.97, 0.71, 0.26);
circle1.rotation.set(0, 0.8, 0);
scene.add( circle1 );

const circle2 = new THREE.Mesh(circleGeometry, circleMaterial);
circle2.position.set(0.15, 0, 1.1);
circle2.rotation.set(0, 0.8, 0);
scene.add( circle2 );

const circle3 = new THREE.Mesh(circleGeometry, circleMaterial);
circle3.position.set(0.82, -0.2, 0.39);
circle3.rotation.set(0, 0.8, 0);
scene.add( circle3 );

// Lights
let light = new THREE.SpotLight(0xffffff, 2);
light.castShadow = true;
light.shadow.bias = -0.0001;
light.shadow.mapSize.width = 1024 * 4;
light.shadow.mapSize.height = 1024 * 4;
scene.add(light);

let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 2);
scene.add(hemiLight);

// UI

let config = {
  number1: { type: "text", position: { left: 295, top: 35 } },
  number2: { type: "text", position: { left: -5, top: 220 } },
  number3: { type: "text", position: { left: 245, top: 270 } },
  panelSize: { width: 2, height: 2},
  opacity: 1,
  body: {backgroundColor: '#fff0', fontColor: '#000', fontSize: 40},
}

let content = {
  number1: "1",
  number2: "2",
  number3: "3",
}

let ui = new CanvasUI( content, config );
ui.update();
ui.mesh.position.set(0.78, -0.05, 0.46);
ui.mesh.rotation.set(0, 0.8, 0);
scene.add(ui.mesh)

//DOM Events
const domEvents = new THREEx.DomEvents(camera, renderer.domElement);

let textPanels = document.querySelectorAll('.text-panel');
let closeButtons = document.querySelectorAll('.close-button');

function setActiveTextPanel(id) {
  textPanels.forEach(panel => panel.classList.remove('active'))

  textPanels[id].classList.add('active')
}

domEvents.addEventListener(circle1, 'click', () => {
  let id = 0;
  setActiveTextPanel(id)
})

domEvents.addEventListener(circle2, 'click', () => {
  let id = 1;
  setActiveTextPanel(id)
})

domEvents.addEventListener(circle3, 'click', () => {
  let id = 2;
  setActiveTextPanel(id)
})

closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    textPanels.forEach(panel => panel.classList.remove('active'));
  })
})


// Sizes
window.addEventListener('resize', () => {
  let width = window.innerWidth;
  let height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

// Constrols
const controls = new THREE.OrbitControls(camera, renderer.domElement);


// Animate
function animate() {
  requestAnimationFrame(animate);
  light.position.set(
    camera.position.x + 10,
    camera.position.y + 10,
    camera.position.z + 10,
  );
  renderer.render(scene, camera);
}

animate();