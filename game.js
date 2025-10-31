// REAL 3D RACING GAME
console.log("🚗 Starting 3D Racing Game...");

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB); // Sky blue
document.body.appendChild(renderer.domElement);

// Add some lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 5);
scene.add(directionalLight);

// Create car
const carGeometry = new THREE.BoxGeometry(2, 1, 4);
const carMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.y = 1;
scene.add(car);

// Create road
const roadGeometry = new THREE.PlaneGeometry(20, 200);
const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
scene.add(road);

// Add road markings
for(let i = -90; i <= 90; i += 10) {
    const lineGeometry = new THREE.PlaneGeometry(0.5, 2);
    const lineMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.rotation.x = -Math.PI / 2;
    line.position.z = i;
    scene.add(line);
}

// Add some obstacles
const obstacles = [];
for(let i = 0; i < 5; i++) {
    const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
    const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set(
        (Math.random() - 0.5) * 10,
        0.5,
        -20 - i * 15
    );
    scene.add(obstacle);
    obstacles.push(obstacle);
}

// Game state
const keys = {};
let speed = 0;
let position = { x: 0, z: 0 };
let rotation = 0;

// Camera follows car
camera.position.set(0, 5, 8);
camera.lookAt(car.position);

// Controls
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    e.preventDefault();
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Game loop
function gameLoop() {
    // Input handling
    const acceleration = 0.2;
    const braking = 0.3;
    const steering = 0.03;
    
    if (keys['ArrowUp'] || keys['w']) {
        speed += acceleration;
    }
    if (keys['ArrowDown'] || keys['s']) {
        speed -= braking;
    }
    if (keys['ArrowLeft'] || keys['a']) {
        rotation += steering;
    }
    if (keys['ArrowRight'] || keys['d']) {
        rotation -= steering;
    }
    
    // Apply physics
    speed *= 0.95; // friction
    speed = Math.max(-5, Math.min(10, speed)); // speed limits
    
    // Update position
    position.x -= Math.sin(rotation) * speed;
    position.z -= Math.cos(rotation) * speed;
    
    // Update car
    car.position.x = position.x;
    car.position.z = position.z;
    car.rotation.y = rotation;
    
    // Update camera to follow car
    camera.position.x = position.x;
    camera.position.z = position.z + 8;
    camera.position.y = 5;
    camera.lookAt(car.position);
    
    // Update UI
    document.getElementById('speed').textContent = Math.abs(Math.round(speed * 20));
    document.getElementById('position').textContent = `${Math.round(position.x)},${Math.round(position.z)}`;
    
    // Render
    renderer.render(scene, camera);
    requestAnimationFrame(gameLoop);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the game
console.log("🎮 Game starting! Use arrow keys to drive!");
gameLoop();
