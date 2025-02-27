// Three.js variables
let scene, camera, renderer, light, sphere, particles, particleMaterial;
let mouseX = 0, mouseY = 0, scrollY = 0;


const sunsetMoods = {
    happy: {
        lightColor: '#F7A9A8',  
        bgColor: 0xFFF8DC,      
        particleColor: 0xFFB6C1, 
        particleSize: 1.5,
        particleCount: 500,
    },
    sad: {
        lightColor: '#D3D3D3',  
        bgColor: 0xD8BFD8,      
        particleColor: 0xC0C0C0, 
        particleSize: 0.5,
        particleCount: 200,
    },
    calm: {
        lightColor: '#B0E0E6',  
        bgColor: 0xE6E6FA,      
        particleColor: 0xB0C4DE, 
        particleSize: 0.75,
        particleCount: 300,
    },
    energetic: {
        lightColor: '#CDC7E5',  
        bgColor: 0xFFB6C1,     
        particleColor: 0x861657, 
        particleSize: 2,
        particleCount: 1000,
    }
};



function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    
    light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 10, 10);
    scene.add(light);

   
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 500; 
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = Math.random() * 100 - 50; // X position
        positions[i * 3 + 1] = Math.random() * 100 - 50; // Y position
        positions[i * 3 + 2] = Math.random() * 100 - 50; // Z position
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    particleMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 20;

    window.addEventListener('resize', onWindowResize, false);


    window.addEventListener('mousemove', onMouseMove, false);

 
    window.addEventListener('wheel', onScroll, false);

    setMoodBackground('calm');

    animate();
}

const sphereMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xFFB6C1), 
    emissive: new THREE.Color(0xFF69B4), 
    emissiveIntensity: 0.5, // Controls the intensity of the glow
    metalness: 0.2, // Gives a bit of shine
    roughness: 0.5  
});


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = - (event.clientY / window.innerHeight) * 2 + 1;
}


function onScroll(event) {
    scrollY = event.deltaY;
    adjustBackgroundOnScroll(scrollY);
}


function adjustBackgroundOnScroll(scroll) {
    const intensity = Math.min(Math.max(scroll / 1000, 0.5), 1);
    light.intensity = intensity;
    light.position.z = 10 + intensity * 10;
}
// Function to play or pause music based on button click
function playMusic(mood) {
    // Get the corresponding music element
    const music = document.getElementById(mood + '-music');

    // Check if the music is already playing
    if (music.paused) {
        // If paused, play the music
        music.play();
    } else {
        // If playing, pause the music
        music.pause();
    }

    // Stop any other music that might be playing (optional, if you want one at a time)
    const allMusic = document.querySelectorAll('audio');
    allMusic.forEach(otherMusic => {
        if (otherMusic !== music) {
            otherMusic.pause();  // Pause all other music
        }
    });
}

// Function to stop all music when double-clicked
function stopAllMusic() {
    const allMusic = document.querySelectorAll('audio');
    allMusic.forEach(music => {
        music.pause();  // Pause all audio elements
        music.currentTime = 0;  // Optionally reset the audio to the beginning
    });
}

// Function to change the background based on mood
function setMoodBackground(mood) {
    // Change the background or other settings based on the mood
    console.log('Mood:', mood);
}

// Add event listener for double-click to stop all music
document.addEventListener('dblclick', stopAllMusic);



function animate() {
    requestAnimationFrame(animate);

    
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    
    particles.rotation.x += 0.002;
    particles.rotation.y += 0.002;

    
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;

    renderer.render(scene, camera);
}


function setMoodBackground(mood) {
    const currentMood = sunsetMoods[mood];

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
    );
    gradient.addColorStop(0, `#${currentMood.bgColor.toString(16)}`);
    gradient.addColorStop(1, '#F0F8FF'); 

    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

   
    const texture = new THREE.CanvasTexture(canvas);
    scene.background = texture;

    
    light.color.set(currentMood.lightColor);

    
    particleMaterial.color.set(currentMood.particleColor);
    particles.material.size = currentMood.particleSize;

    
    const particleGeometry = new THREE.BufferGeometry();
    const newParticleCount = currentMood.particleCount;
    const newPositions = new Float32Array(newParticleCount * 3);

    for (let i = 0; i < newParticleCount; i++) {
        newPositions[i * 3] = Math.random() * 100 - 50; // X position
        newPositions[i * 3 + 1] = Math.random() * 100 - 50; // Y position
        newPositions[i * 3 + 2] = Math.random() * 100 - 50; // Z position
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3));
    particles.geometry = particleGeometry;
}


// Initialize Three.js
init();
