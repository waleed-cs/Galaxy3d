import * as THREE from "three";
import GUI from "lil-gui";
import TWEEN from "@tweenjs/tween.js";
const textLoader = new THREE.TextureLoader();
/**
 * 0 - Sun
 * 1 - Mercury
 * 2 - Venus
 * 3 - Earth
 * 4 - Mars
 * 5 - Jupiter
 * 6 - Saturn with it's Ring
 * 7 - Uranus
 * 8 - Neptune
 */

let planets = [
  {
    texture: textLoader.load("/textures/2k_sun.jpg"),
    radius: 12,
    z: 0,
    y: 0,
    x: 0,
    speed: 0.1,
    active: false,
    name: "Sun",
    description:
      "The heart of our solar system, and it has radius of 435,000 miles (700,000KM)",
  },
  {
    texture: textLoader.load("/textures/2k_mercury.jpg"),
    radius: 0.5,
    z: 0,
    y: -0.75,
    x: 14,
    speed: 1,
    name: "Mercury",
    description:
      "Mercury is the closest planet to the Sun, and the smallest planet in our solar system",
    active: false,
  },
  {
    texture: textLoader.load("/textures/2k_venus_surface.jpg"),
    radius: 1,
    z: 0,
    y: -0.85,
    x: 16.5,
    speed: 1,
    name: "Venus",
    description:
      "Venus has thick atomsphere that traps heat, making it the hottest planet in our solar system",
    active: false,
  },
  {
    texture: textLoader.load("/textures/2k_earth_daymap.jpg"),
    radius: 1.5,
    z: 0,
    y: -0.85,
    x: 20.5,
    speed: 1,
    active: false,
    name: "EARTH",
    description:
      "Our home planet, it the only planet inhabited by living things",
  },
  {
    texture: textLoader.load("/textures/2k_mars.jpg"),
    radius: 0.75,
    z: 0,
    y: -0.85,
    x: 23.5,
    speed: 1,
    name: "Mars",
    description: "The only planet we know of inhabited entirely by robots",
    active: false,
  },
  {
    texture: textLoader.load("/textures/2k_jupiter.jpg"),
    radius: 5,
    z: 0,
    y: -0.85,
    x: 30.75,
    speed: 1,
    name: "Jupiter",
    description:
      "Jupiter is, by far, the largest planet in the solar system, more than twice as massive as all the other planets combined",
    active: false,
  },
  {
    texture: textLoader.load("/textures/2k_saturn.jpg"),
    ringTexture: textLoader.load("/textures/2k_saturn_ring_alpha.png"),
    radius: 3.5,
    z: 0,
    y: -0.85,
    x: 41.75,
    isRing: true,
    speed: 1,
    name: "Saturn",
    description:
      "Saturn is the sixth planet from the Sun and the second largest planet in our solar system",
    active: false,
  },
  {
    texture: textLoader.load("/textures/2k_uranus.jpg"),
    radius: 0.75,
    z: 0,
    y: -0.85,
    x: 49,
    speed: 1,
    name: "Uranus",
    description:
      "Uranus is a very cold and windy planet, and it has color of blue-green in color due to large amounts of methane",
    active: false,
  },
  {
    texture: textLoader.load("/textures/2k_neptune.jpg"),
    radius: 0.75,
    z: 0,
    y: -0.85,
    x: 52,
    speed: 1,
    name: "Neptune",
    description:
      "The first planet discovered with math, using predictions sent to him by French astronomer Urbain Le Verrier",
    active: false,
  },
];

/**
 * Debug
 */
// const gui = new GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//stars
const starTexture = textLoader.load("/textures/star.png");
const starsGeometry = new THREE.BufferGeometry();
const count = 10000;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 200;
}
starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const starsMatrial = new THREE.PointsMaterial({
  size: 0.1,
  alphaMap: starTexture,
  sizeAttenuation: true,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

const stars = new THREE.Points(starsGeometry, starsMatrial);
scene.add(stars);
let planetsGeometry = [];

const createPlanet = (planetData, index) => {
  //upload texture
  const texture = planetData.texture;
  //create sphere with planet texture
  const sphere = new THREE.SphereGeometry(planetData.radius, 32, 32);
  const sphereMateral = new THREE.MeshStandardMaterial({ map: texture });
  const planet = new THREE.Mesh(sphere, sphereMateral);
  if (!planetData.isRing) {
    planet.position.set(planetData.x, planetData.y, planetData.z);
    planet.scale.set(0, 0, 0);
  }
  planets[index].mesh = planet;

  return planet;
};

const generatePlantes = () => {
  planetsGeometry = planets.map((planetData, index) => {
    const planet = createPlanet(planetData, index);
    if (planetData.isRing) {
      const ringTexture = planetData.ringTexture;
      const ringGeometry = new THREE.RingGeometry(4, 4.8, 50, 50);
      const ringMaterial = new THREE.MeshStandardMaterial({
        map: ringTexture,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = 5;
      const planetGroup = new THREE.Group();
      planetGroup.add(planet);
      planetGroup.add(ring);
      planetGroup.position.set(planetData.x, planetData.y, planetData.z);
      planetGroup.scale.set(0, 0, 0);
      scene.add(planetGroup);
      new TWEEN.Tween(planetGroup.scale)
        .to({ x: 1, y: 1, z: 1 }, 1000)
        .delay(200 * index)
        .start();
      return { planet: planetGroup, speed: planetData.speed };
    } else {
      new TWEEN.Tween(planet.scale)
        .to({ x: 1, y: 1, z: 1 }, 1000)
        .delay(200 * index)
        .start();
      scene.add(planet);
      return { planet, speed: planetData.speed };
    }
  });
};

generatePlantes();
//show info
const title = document.querySelector(".info__title");
const description = document.querySelector(".info__description");
const updateInfo = () => {
  for (let i = 0; i < planets.length; i++) {
    if (planets[i].active === true) {
      title.textContent = planets[i].name;
      description.textContent = planets[i].description;
    }
  }
};
updateInfo();

const sunLight = new THREE.DirectionalLight(0xffffff, 2);
sunLight.castShadow = true;
sunLight.position.z = 0.5;
sunLight.position.y = 0;
scene.add(sunLight);

const helper = new THREE.DirectionalLightHelper(sunLight, 0.2);
scene.add(helper);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
//handle on click for the planets
const onClickHandler = (e) => {
  let minDistance = 70;
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(
    planetsGeometry.map((pg) => pg.planet),
    true
  );
  if (intersects.length > 0) {
    camera.position.z = 150;
    const selectedPlanet = intersects[0].object;
    let selectedPlanetRadius = selectedPlanet.geometry.parameters.radius;
    if (selectedPlanet.parent.type === "Group") {
      if (selectedPlanetRadius === undefined) {
        selectedPlanetRadius =
          selectedPlanet.parent.children[0].geometry.parameters.radius;
      }

      let cameraTween = new TWEEN.Tween(camera.position)
        .to(selectedPlanet.parent.position, 2000)
        .onUpdate(() => {
          let distance = camera.position.distanceTo(
            selectedPlanet.parent.position
          );
          if (distance < minDistance + selectedPlanetRadius) {
            cameraTween.stop();
          }
        })
        .start();
    } else {
      let cameraTween = new TWEEN.Tween(camera.position)
        .to(selectedPlanet.position, 2000)
        .onUpdate(() => {
          let distance = camera.position.distanceTo(selectedPlanet.position);
          if (distance < minDistance + selectedPlanetRadius) {
            cameraTween.stop();
          }
        })
        .start();
    }
    // camera.position.z = 90;
    const updatedPlantsStatus = planets.map((planetData) => {
      if (
        planetData.isRing &&
        selectedPlanet.parent.uuid === planetData.mesh.uuid
      ) {
        if (selectedPlanet.parent.uuid === planetData.mesh.uuid) {
          return { ...planetData, active: true };
        }
      } else if (planetData.mesh === selectedPlanet) {
        return { ...planetData, active: true };
      } else {
        return { ...planetData, active: false };
      }
    });
    planets = updatedPlantsStatus;
    updateInfo();
  }
};

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  210
);
camera.position.z = 150;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.domElement.addEventListener("click", onClickHandler, false);
/**
 * Animate
 */
const clock = new THREE.Clock();
const exploreButton = document.querySelector("button");
const zoomInAnimation = () => {
  if (exploreButton.textContent === "ZOOM IN") {
    new TWEEN.Tween(camera.position)
      .to({ z: 90, x: 0 }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {})
      .start();
    exploreButton.textContent = "ZOOM OUT";
  } else {
    new TWEEN.Tween(camera.position)
      .to({ z: 150 }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {})
      .start();
    exploreButton.textContent = "ZOOM IN";
  }
};
exploreButton.addEventListener("click", () => {
  zoomInAnimation();
});
console.log(planetsGeometry);
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  for (let i = 0; i < planetsGeometry.length; i++) {
    if (planetsGeometry[i].planet.type === "Group") {
      let planet = planetsGeometry[i].planet.children[0];
      planet.rotation.y += planetsGeometry[i].speed * 0.001;
    } else {
      planetsGeometry[i].planet.rotation.y += planetsGeometry[i].speed * 0.001;
    }
  }

  starsMatrial.size = 0.2 + Math.sin(Date.now() * 0.001) * 0.1;

  TWEEN.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
