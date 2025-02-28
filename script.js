// Three.js Globe
let scene, camera, renderer, globe;

function initGlobe() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('globe-container').appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg'),
    });
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    camera.position.z = 10;

    function animate() {
        requestAnimationFrame(animate);
        globe.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();
}

// Weather Data
const API_KEY = '16d6bd877c81080309ddf407e4407bf6';

function getWeatherData(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            updateWeatherInfo(data);
        })
        .catch(error => console.error('Error:', error));
}

function updateWeatherInfo(data) {
    gsap.to('#weather-info', { opacity: 0, duration: 0.5, onComplete: () => {
        document.getElementById('location').textContent = data.name;
        document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('description').textContent = data.weather[0].description;
        document.getElementById('weather-icon').innerHTML = `<img class="weather-icon" src="<http://openweathermap.org/img/wn/${data.weather>[0].icon}@2x.png" alt="Weather icon">`;
        gsap.to('#weather-info', { opacity: 1, duration: 0.5 });
    }});
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => getWeatherData(position.coords.latitude, position.coords.longitude),
            error => console.error("Error: ", error)
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

window.onload = () => {
    initGlobe();
    getLocation();
};

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
