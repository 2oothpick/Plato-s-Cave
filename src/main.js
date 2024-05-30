import * as THREE from 'three';
import { PointerLockControls } from 'three-stdlib';


// console.log('three object here', THREE)

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    60, // Field of view
    window.innerWidth / window.innerHeight, // Aspect Ratio
    0.1, // near
    1000, // far
);
scene.add(camera);
camera.position.set(0, 4, 0); // moves the camera 5 units

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: false });  // for smooth edges
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0xffffff, 1) // background color
document.body.appendChild(renderer.domElement) // add renderer to html

// paintings
function createPainting(imageURL, width, height, position) {
    const textureLoader = new THREE.TextureLoader();
    const paintingTexture = textureLoader.load(imageURL)
    const paintingMaterial = new THREE.MeshBasicMaterial({
        map: paintingTexture,
    });
    const paintingGeometry = new THREE.PlaneGeometry(width, height);
    const painting = new THREE.Mesh(paintingGeometry, paintingMaterial)
    painting.position.set(position.x, position.y, position.z)
    return painting;
}

// setting up paintings
const painting1 = createPainting(
    'public/artwork/0.jpg', // the image url or path
    10, // width
    5, // height
    new THREE.Vector3(-10, 5, -19.99) // position in x, y, z coordinates
);

// Painting on the front wall at the right
const painting2 = createPainting(
    'public/artwork/1.jpg',
    10,
    5,
    new THREE.Vector3(10, 5, -19.99)
);

// Painting on the left wall
const painting3 = createPainting(
    'public/artwork/3.jpg',
    10,
    5,
    new THREE.Vector3(-19.99, 5, -10)
);
painting3.rotation.y = Math.PI / 2; // 90 degrees. If we don't rotate this, it will show up in the front of us instead of lying on the left wall

// Painting on the right wall (near the front wall)
const painting4 = createPainting(
    'public/artwork/5.jpg',
    10,
    5,
    new THREE.Vector3(19.99, 5, -10)
);
painting4.rotation.y = -Math.PI / 2; // -90 degrees. The same as above but for the right wall

// Painting on the left wall (near the back wall)
const painting5 = createPainting(
    'public/artwork/8.jpg',
    10,
    5,
    new THREE.Vector3(-19.5, 5, 10)
);
painting5.rotation.y = Math.PI / 2;

// Painting on the right wall (near the back wall)
const painting6 = createPainting(
    'public/artwork/9.jpg',
    10,
    5,
    new THREE.Vector3(19.5, 5, 10)
);
painting6.rotation.y = -Math.PI / 2;

// Painting on the back wall at the left
const painting7 = createPainting(
    'public/artwork/6.jpg',
    10,
    5,
    new THREE.Vector3(-10, 5, 19.5)
);
painting7.rotation.y = Math.PI; // 180 degrees.

// Painting on the back wall at the right
const painting8 = createPainting(
    'public/artwork/7.jpg',
    10,
    5,
    new THREE.Vector3(10, 5, 19.5)
);
painting8.rotation.y = Math.PI;

scene.add(
    painting1,
    painting2,
    painting3,
    painting4,
    painting5,
    painting6,
    painting7,
    painting8
); // add the paintings to the scene

// Ambient Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // color, intensity, distance, decay
//ambientLight.position = camera.position; // light follows camera
scene.add(ambientLight);

// Spotlights to simulate ceiling-mounted lights
function createSpotlight(x, y, z, intensity, targetPosition) {
    const spotlight = new THREE.SpotLight(0xffffff, intensity);
    spotlight.position.set(x, y, z);
    spotlight.target.position.copy(targetPosition);
    spotlight.castShadow = true;
    spotlight.angle = Math.PI / 6; // 30 degrees
    spotlight.penumbra = 1;  // soft edge of spotlight
    spotlight.decay = 1.5; // determines attenuation of light with distance
    spotlight.distance = 40; // distance of light is 40 units
    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;
    return spotlight;
}

// Add spotlight to scene
const spotlight1 = createSpotlight(-15, 20, -10, 3, painting1.position);
const spotlight2 = createSpotlight(15, 20, -10, 3, painting2.position);
const spotlight3 = createSpotlight(-15, 20, -14, 3, painting3.position);
const spotlight4 = createSpotlight(15, 20, -14, 3, painting4.position);
const spotlight5 = createSpotlight(-15, 20, 14, 3, painting5.position);
const spotlight6 = createSpotlight(15, 20, 14, 3, painting6.position);
const spotlight7 = createSpotlight(-15, 20, 10, 3, painting7.position);
const spotlight8 = createSpotlight(15, 20, 10, 3, painting8.position);

// add the spotlights to the scene
scene.add(
    spotlight1,
    spotlight2,
    spotlight3,
    spotlight4,
    spotlight5,
    spotlight6,
    spotlight7,
    spotlight8
);

scene.add(
    // add the spotlight target to the scene
    spotlight1.target,
    spotlight2.target,
    spotlight3.target,
    spotlight4.target,
    spotlight5.target,
    spotlight6.target,
    spotlight7.target,
    spotlight8.target
);

/* // Directional Light
let sunLight = new THREE.DirectionalLight(0xddddd, 1.0); //color, intensity
sunLight.position.y = 15;
scene.add(sunLight); */


// floor texture
let textureLoader = new THREE.TextureLoader();
const floorTexture = textureLoader.load('public/img/Floortexture.jpg');
floorTexture.wrapS = THREE.RepeatWrapping; // wrapS is horizontal direction
floorTexture.wrapT = THREE.RepeatWrapping; // wrapT is vertical direction
floorTexture.repeat.set(20, 20); // Texture reptition


// floor
let planeGeometry = new THREE.PlaneGeometry(45, 45) // BoxGeometry is the shape of the object
let planeMaterial = new THREE.MeshPhongMaterial({
    map: floorTexture,
    side: THREE.DoubleSide,
});

let floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);

floorPlane.rotation.x = Math.PI / 2 // 90 degrees rotation
floorPlane.position.y = -Math.PI  // 180 degrees rotation

scene.add(floorPlane); // add floor to scene

// walls
const wallGroup = new THREE.Group();  // create group to hold the walls
scene.add(wallGroup);

// wall texture
const wallTexture = textureLoader.load('public/img/white-texture.jpg');
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(1, 1);

const wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });

// front wall
const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(85, 20, 0.001),
    new THREE.MeshLambertMaterial({ map: wallTexture }),
);

frontWall.position.z = -20; // move wall back a bit

// left wall
const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 20, 0.001),
    new THREE.MeshLambertMaterial({ map: wallTexture })
)

leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -20;

// right wall
const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(80, 20, 0.001),
    new THREE.MeshLambertMaterial({ map: wallTexture })
)

rightWall.rotation.y = Math.PI / 2;
rightWall.position.x = 20;

// back wall
const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(85, 20, 0.001),
    new THREE.MeshLambertMaterial({ map: wallTexture })
);
backWall.position.z = 20;

wallGroup.add(frontWall, backWall, leftWall, rightWall); // add walls to scene

// loop through each wall and create the bounding box
for (let i = 0; i < wallGroup.children.length; i++) {
    wallGroup.children[i].BoundingBox = new THREE.Box3();
    wallGroup.children[i].BoundingBox.setFromObject(wallGroup.children[i]);
}

// check if the player intersects with the wall
function checkCollision() {
    const playerBoundingBox = new THREE.Box3(); // create a bounding box for the player
    const cameraWorldPosition = new THREE.Vector3(); // create a vector to hold the camera position
    camera.getWorldPosition(cameraWorldPosition); // get the camera position and store it in the vector. Note: The camera represents the player's position in our case.
    playerBoundingBox.setFromCenterAndSize(
        // setFromCenterAndSize is a method that takes the center and size of the box. We set the player's bounding box size and center it on the camera's world position.
        cameraWorldPosition,
        new THREE.Vector3(1, 1, 1)
    );

    // loop through each wall
    for (let i = 0; i < wallGroup.children.length; i++) {
        const wall = wallGroup.children[i]; // get the wall
        if (playerBoundingBox.intersectsBox(wall.BoundingBox)) {
            // check if the player's bounding box intersects with any of the wall bounding boxes
            return true; // if it does, return true
        }
    }

    return false; // if it doesn't, return false
}



// Ceiling
const ceilingTexture = textureLoader.load('public/img/white-texture.jpg')
const ceilingGeometry = new THREE.PlaneGeometry(45, 40)
const ceilingMaterial = new THREE.MeshLambertMaterial({ map: ceilingTexture });
const ceilingPlane = new THREE.Mesh(ceilingGeometry, ceilingMaterial);

ceilingPlane.rotation.x = Math.PI / 2;
ceilingPlane.position.y = 10;
scene.add(ceilingPlane);

// optimize lights and shadows
renderer.shadowMap.enabled = true; // enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// receive shadows
floorPlane.receiveShadow = true; 
ceilingPlane.receiveShadow = true;
frontWall.castShadow = true;
frontWall.receiveShadow = true;
leftWall.castShadow = true; // cast shadows
leftWall.receiveShadow = true;
rightWall.castShadow = true;
rightWall.receiveShadow = true;
backWall.castShadow = true;
backWall.receiveShadow = true;
painting1.castShadow = true;
painting1.receiveShadow = true;
painting2.castShadow = true;
painting2.receiveShadow = true;

// controls
const controls = new PointerLockControls(camera, document.body);

// Lock the pointer (controls are activated) and hide menu when tour starts
function startExperience() {
    // reset clock
    clock.start();
    // Lock pointer
    controls.lock()
    // Hide menu
    hideMenu();
}

const playButton = document.getElementById('play_button')
playButton.addEventListener('click', startExperience);

// hide menu
function hideMenu() {
    const menu = document.getElementById('menu')
    menu.style.display = 'none'
}

// show menu
function showMenu() {
    const menu = document.getElementById('menu')
    menu.style.display = 'block'
}

// Controls
// Event Listenter for movement
//document.addEventListener('keydown', onKeyDown, false);
controls.addEventListener('unlock', showMenu);

// object to hold the keys pressed
const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false,
};

// Event Listener for when we press the keys
document.addEventListener(
    'keydown', // `keydown` is an event that fires when a key is pressed
    (event) => {
        if (event.key in keysPressed) {
            // check if the key pressed is in the keysPressed object
            keysPressed[event.key] = true; // if it is, set the value to true
        }
    },
    false
);

// Event Listener for when we release the keys
document.addEventListener(
    'keyup', // `keyup` is an event that fires when a key is released
    (event) => {
        if (event.key in keysPressed) {
            // check if the key released is in the keysPressed object
            keysPressed[event.key] = false; // if it is, set the value to false
        }
    },
    false
);

// Add the movement (left/right/forward/backward) to the scene. Press the arrow keys or WASD to move
const clock = new THREE.Clock(); // create a clock to keep track of the time between frames

function updateMovement(delta) {
    const moveSpeed = 5 * delta; // moveSpeed is the distance the camera will move in one second. We multiply by delta to make the movement framerate independent. This means that the movement will be the same regardless of the framerate. This is important because if the framerate is low, the movement will be slow and if the framerate is high, the movement will be fast. This is not what we want. We want the movement to be the same regardless of the framerate.
    const previousPosition = camera.position.clone(); // clone the camera position before the movement

    if (keysPressed.ArrowRight || keysPressed.d) {
        controls.moveRight(moveSpeed);
    }
    if (keysPressed.ArrowLeft || keysPressed.a) {
        controls.moveRight(-moveSpeed);
    }
    if (keysPressed.ArrowUp || keysPressed.w) {
        controls.moveForward(moveSpeed);
    }
    if (keysPressed.ArrowDown || keysPressed.s) {
        controls.moveForward(-moveSpeed);
    }

    // After the movement is applied, we check for collisions by calling the checkCollision function. If a collision is detected, we revert the camera's position to its previous position, effectively preventing the player from moving through walls.
    if (checkCollision()) {
        camera.position.copy(previousPosition); // reset the camera position to the previous position. The `previousPosition` variable is a clone of the camera position before the movement.
    }
}

painting1.userData = {
    type: 'painting',
    info: {
        title: 'Painting 1',
        artist: 'Artist 1',
        year: 'Year 1',
    },
};

painting2.userData = {
    type: 'painting',
    info: {
        title: 'Painting 2',
        artist: 'Artist 2',
        year: 'Year 2',
    },
};

painting3.userData = {
    type: 'painting',
    info: {
        title: 'Painting 3',
        artist: 'Artist 3',
        year: 'Year 3',
    },
};

painting4.userData = {
    type: 'painting',
    info: {
        title: 'Painting 4',
        artist: 'Artist 4',
        year: 'Year 4',
    },
};

painting5.userData = {
    type: 'painting',
    info: {
        title: 'Painting 5',
        artist: 'Artist 5',
        year: 'Year 5',
    },
};

painting6.userData = {
    type: 'painting',
    info: {
        title: 'Painting 6',
        artist: 'Artist 6',
        year: 'Year 6',
    },
};

painting7.userData = {
    type: 'painting',
    info: {
        title: 'Painting 7',
        artist: 'Artist 7',
        year: 'Year 7',
    },
};

painting8.userData = {
    type: 'painting',
    info: {
        title: 'Painting 8',
        artist: 'Artist 8',
        year: 'Year 8',
    },
};

// painting info
function displayPaintingInfo(info) {
    const infoElement = document.getElementById('painting-info');
    infoElement.innerHTML = `
      <h3>${info.title}</h3>
      <p>Artist: ${info.artist}</p>
      <p>Year: ${info.year}</p>
    `;
    infoElement.style.display = 'block';
}

function hidePaintingInfo() {
    const infoElement = document.getElementById('painting-info');
    infoElement.style.display = 'none';
}

// Used to render the scene
let render = function () {
    const delta = clock.getDelta(); // get the time between frames
    updateMovement(delta); // update the movement with the time between frames

    // Check the distance between the camera and the paintings
    const distanceThreshold = 8; // Set the distance threshold for displaying the painting information
    const distanceToPainting1 = camera.position.distanceTo(painting1.position);
    const distanceToPainting2 = camera.position.distanceTo(painting2.position);
    const distanceToPainting3 = camera.position.distanceTo(painting3.position);
    const distanceToPainting4 = camera.position.distanceTo(painting4.position);
    const distanceToPainting5 = camera.position.distanceTo(painting5.position);
    const distanceToPainting6 = camera.position.distanceTo(painting6.position);
    const distanceToPainting7 = camera.position.distanceTo(painting7.position);
    const distanceToPainting8 = camera.position.distanceTo(painting8.position);

    if (distanceToPainting1 < distanceThreshold) {
        displayPaintingInfo(painting1.userData.info);
    } else if (distanceToPainting2 < distanceThreshold) {
        displayPaintingInfo(painting2.userData.info);
    } else if (distanceToPainting3 < distanceThreshold) {
        displayPaintingInfo(painting3.userData.info);
    } else if (distanceToPainting4 < distanceThreshold) {
        displayPaintingInfo(painting4.userData.info);
    } else if (distanceToPainting5 < distanceThreshold) {
        displayPaintingInfo(painting5.userData.info);
    } else if (distanceToPainting6 < distanceThreshold) {
        displayPaintingInfo(painting6.userData.info);
    } else if (distanceToPainting7 < distanceThreshold) {
        displayPaintingInfo(painting7.userData.info);
    } else if (distanceToPainting8 < distanceThreshold) {
        displayPaintingInfo(painting8.userData.info);
    } else {
        hidePaintingInfo();
    }

    renderer.render(scene, camera); // render the scene
    requestAnimationFrame(render); // requestAnimationFrame is a method that calls the render function before the next repaint. This is used to render the scene at 60 frames per second and is more efficient than using setInterval because it only renders when the browser is ready to repaint.
};

render();