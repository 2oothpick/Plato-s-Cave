//import * as THREE from 'three.module';
//console.log('three object here',THREE)

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect Ratio
    0.1, // near
    1000, // far
);
scene.add(camera);
camera.position.z = 5; // moves the camera 5 units

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });  // for smooth edges
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor('#72ada9', 1) // background color
document.body.appendChild(renderer.domElement) // add renderer to html


// Ambient Lights
let ambientLight = new THREE.AmbientLight(0x101010, 1.0); // color, intensity, distance, decay
ambientLight.position = camera.position; // light follows camera
scene.add(ambientLight);

// Directional Light
let sunLight = new THREE.DirectionalLight(0xddddd, 1.0); //color, intensity
sunLight.position.y = 15;
scene.add(sunLight);

let geometry = new THREE.BoxGeometry(1, 1, 1);  // Shape of object
let material = new THREE.MeshBasicMaterial({ color: 'black' }); // Object's color

const cube = new THREE.Mesh(geometry, material);
scene.add(cube)

// Controls
// Event Listenter for movement
document.addEventListener('keydown', onKeyDown, false);

// function for key presses
function onKeyDown(event) {
    let keycode = event.which;

    // right arrow key
    if (keycode === 39) {
        camera.translateX(-0.05)
    }

    // left arrow key
    else if (keycode === 37) {
        camera.translateX(0.05)
    }

    // up arrow key
    else if (keycode === 38) {
        camera.translateY(-0.05)
    }

    // down arrow key
    else if (keycode === 40) {
        camera.translateY(0.05)
    }
}


let render = function () {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera) // Renders the scene
    requestAnimationFrame(render)
}

render();
