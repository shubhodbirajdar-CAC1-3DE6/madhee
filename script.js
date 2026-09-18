/**
 * THE LITTLE UNIVERSE OF MADHEE 🌙🌸🌿
 * Master Nature, Flower & Moon Interactive Website Engine
 */

// ==========================================================================
// 1. GLOBAL STATE & INITIALIZATION
// ==========================================================================
let scene, camera, renderer;
let moonMesh, moonGlowMesh;
let petalsGroup, leavesGroup, firefliesGroup, starsPoints, waterMesh;
let dirLight, ambLight;
let mouseX = 0, mouseY = 0;
let targetCameraY = 0;
let currentTheme = 'moonlit';

// Audio Synthesizer State
let audioCtx = null;

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initThreeJSNature();
  initScrollListeners();
  initThemeSwitcher();
  initCursorFollower();

  // Snowbell cat interactive meow bounce
  document.querySelectorAll('.snowbell-cat-perch').forEach(cat => {
    cat.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent opening lightbox
      cat.style.transform = 'translateY(-12px) scale(1.22)';
      setTimeout(() => {
        cat.style.transform = '';
      }, 300);
    });
  });


  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onMouseMove);
});

// ==========================================================================
// 2. LOADING SCREEN
// ==========================================================================
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  const fill = document.getElementById('loading-bar-fill');
  const sub = document.getElementById('loading-sub');

  const steps = [
    { text: 'Planting wild daisies & lavender…', pct: 25, delay: 200 },
    { text: 'Illuminating celestial moonlight…', pct: 60, delay: 600 },
    { text: 'Gathering 12 cherished memories…', pct: 90, delay: 1100 },
    { text: 'Welcome, Madhee 🌙', pct: 100, delay: 1600 }
  ];

  steps.forEach(s => {
    setTimeout(() => {
      if (fill) fill.style.width = s.pct + '%';
      if (sub) sub.textContent = s.text;
    }, s.delay);
  });

  setTimeout(() => {
    if (loadingScreen) loadingScreen.classList.add('fade-out');
  }, 2100);
}

// ==========================================================================
// 3. THREE.JS NATURE, MOON & FLOWER ENGINE
// ==========================================================================
function initThreeJSNature() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030712, 0.015);

  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 24);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient & Directional Lights
  ambLight = new THREE.AmbientLight(0xffeedd, 0.85);
  scene.add(ambLight);

  dirLight = new THREE.DirectionalLight(0xffdf88, 1.3);
  dirLight.position.set(10, 15, 12);
  scene.add(dirLight);

  // Build Botanical & Celestial Elements
  buildStarfield();
  buildGlowingMoon();
  buildFloatingPetals();
  buildDriftingLeaves();
  buildDancingFireflies();
  buildMoonlitWater();

  animate();
}

function buildStarfield() {
  const count = 3000;
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    pos[i] = (Math.random() - 0.5) * 500;
    pos[i + 1] = (Math.random() - 0.5) * 400;
    pos[i + 2] = (Math.random() - 0.5) * 400 - 30;

    // Slight chromatic variety (soft gold, white, cyan, pink)
    const r = Math.random();
    if (r > 0.7) {
      colors[i] = 1.0; colors[i + 1] = 0.85; colors[i + 2] = 0.5; // gold
    } else if (r > 0.4) {
      colors[i] = 0.9; colors[i + 1] = 0.8; colors[i + 2] = 1.0; // soft violet
    } else {
      colors[i] = 0.95; colors[i + 1] = 0.95; colors[i + 2] = 1.0; // white
    }
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true
  });

  starsPoints = new THREE.Points(geo, mat);
  scene.add(starsPoints);
}

function buildGlowingMoon() {
  // 3D Procedural Moon Sphere
  const moonGeo = new THREE.SphereGeometry(4.2, 48, 48);
  const moonMat = new THREE.MeshStandardMaterial({
    color: 0xfef9e7,
    roughness: 0.85,
    metalness: 0.1,
    emissive: 0xffdf88,
    emissiveIntensity: 0.35
  });

  moonMesh = new THREE.Mesh(moonGeo, moonMat);
  moonMesh.position.set(9, 6, -10);
  scene.add(moonMesh);

  // Atmospheric Moon Glow Aura
  const glowGeo = new THREE.SphereGeometry(4.9, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xfef3c7,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide
  });

  moonGlowMesh = new THREE.Mesh(glowGeo, glowMat);
  moonMesh.add(moonGlowMesh);
}

function buildFloatingPetals() {
  petalsGroup = new THREE.Group();
  const count = 140;

  // Petal geometry: flattened teardrop shape
  const petalShape = new THREE.Shape();
  petalShape.moveTo(0, 0);
  petalShape.bezierCurveTo(0.2, 0.4, 0.4, 0.8, 0, 1.2);
  petalShape.bezierCurveTo(-0.4, 0.8, -0.2, 0.4, 0, 0);

  const petalGeo = new THREE.ShapeGeometry(petalShape);
  petalGeo.scale(0.55, 0.55, 0.55);

  const petalMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White daisies
    roughness: 0.3,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85
  });

  for (let i = 0; i < count; i++) {
    const pMesh = new THREE.Mesh(petalGeo, petalMat.clone());
    // Give some petals soft pink / gold tints
    if (Math.random() > 0.6) {
      pMesh.material.color.setHex(0xfce7f3); // cherry blossom pink
    } else if (Math.random() > 0.8) {
      pMesh.material.color.setHex(0xfef08a); // daisy yellow center
    }

    pMesh.position.set(
      (Math.random() - 0.5) * 55,
      Math.random() * 60 - 20,
      (Math.random() - 0.5) * 35
    );

    pMesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    pMesh.userData = {
      fallSpeed: 0.025 + Math.random() * 0.035,
      swaySpeed: 0.015 + Math.random() * 0.02,
      rotSpeedX: 0.01 + Math.random() * 0.02,
      rotSpeedZ: 0.01 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2
    };

    petalsGroup.add(pMesh);
  }

  scene.add(petalsGroup);
}

function buildDriftingLeaves() {
  leavesGroup = new THREE.Group();
  const count = 70;

  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, -0.6);
  leafShape.quadraticCurveTo(0.4, 0, 0, 0.8);
  leafShape.quadraticCurveTo(-0.4, 0, 0, -0.6);

  const leafGeo = new THREE.ShapeGeometry(leafShape);
  leafGeo.scale(0.5, 0.5, 0.5);

  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x4ade80, // Fresh green
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
    roughness: 0.4
  });

  for (let i = 0; i < count; i++) {
    const lMesh = new THREE.Mesh(leafGeo, leafMat.clone());
    if (Math.random() > 0.5) {
      lMesh.material.color.setHex(0x15803d); // Deep neem leaf green
    }

    lMesh.position.set(
      (Math.random() - 0.5) * 60,
      Math.random() * 60 - 20,
      (Math.random() - 0.5) * 35
    );

    lMesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    lMesh.userData = {
      fallSpeed: 0.02 + Math.random() * 0.03,
      swaySpeed: 0.01 + Math.random() * 0.02,
      rotSpeed: 0.015,
      phase: Math.random() * Math.PI * 2
    };

    leavesGroup.add(lMesh);
  }

  scene.add(leavesGroup);
}

function buildDancingFireflies() {
  firefliesGroup = new THREE.Group();
  const count = 65;
  const ffGeo = new THREE.SphereGeometry(0.12, 10, 10);

  for (let i = 0; i < count; i++) {
    const ffMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.85
    });

    const ff = new THREE.Mesh(ffGeo, ffMat);
    ff.position.set(
      (Math.random() - 0.5) * 50,
      Math.random() * 40 - 15,
      (Math.random() - 0.5) * 25
    );

    ff.userData = {
      phase: Math.random() * Math.PI * 2,
      speedX: 0.01 + Math.random() * 0.015,
      speedY: 0.01 + Math.random() * 0.015,
      baseY: ff.position.y
    };

    firefliesGroup.add(ff);
  }

  scene.add(firefliesGroup);
}

function buildMoonlitWater() {
  const waterGeo = new THREE.PlaneGeometry(120, 60, 32, 32);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x051329,
    roughness: 0.2,
    metalness: 0.85,
    transparent: true,
    opacity: 0.45
  });

  waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.rotation.x = -Math.PI / 2.3;
  waterMesh.position.set(0, -18, -10);
  scene.add(waterMesh);
}

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Smooth camera parallax based on mouse and scroll
  camera.position.x += (mouseX * 1.8 - camera.position.x) * 0.05;
  camera.position.y += (targetCameraY - mouseY * 1.2 - camera.position.y) * 0.05;

  // Slowly rotate starfield
  if (starsPoints) starsPoints.rotation.y = time * 0.005;

  // Moon slow orbital rotation & subtle breathing glow
  if (moonMesh) {
    moonMesh.rotation.y = time * 0.02;
    if (moonGlowMesh) {
      const scale = 1 + Math.sin(time * 1.8) * 0.05;
      moonGlowMesh.scale.set(scale, scale, scale);
    }
  }

  // Animate Falling White Daisy & Blossom Petals
  if (petalsGroup) {
    petalsGroup.children.forEach(p => {
      p.position.y -= p.userData.fallSpeed;
      p.position.x += Math.sin(time * 1.5 + p.userData.phase) * p.userData.swaySpeed;
      p.rotation.x += p.userData.rotSpeedX;
      p.rotation.z += p.userData.rotSpeedZ;

      if (p.position.y < -25) {
        p.position.y = 35;
        p.position.x = (Math.random() - 0.5) * 55;
      }
    });
  }

  // Animate Drifting Leaves
  if (leavesGroup) {
    leavesGroup.children.forEach(l => {
      l.position.y -= l.userData.fallSpeed;
      l.position.x += Math.cos(time * 1.2 + l.userData.phase) * l.userData.swaySpeed;
      l.rotation.y += l.userData.rotSpeed;

      if (l.position.y < -25) {
        l.position.y = 35;
        l.position.x = (Math.random() - 0.5) * 60;
      }
    });
  }

  // Animate Dancing Fireflies
  if (firefliesGroup) {
    firefliesGroup.children.forEach(f => {
      f.position.x += Math.cos(time * 1.4 + f.userData.phase) * f.userData.speedX;
      f.position.y = f.userData.baseY + Math.sin(time * 2.0 + f.userData.phase) * 1.8;
      f.material.opacity = 0.4 + Math.sin(time * 3 + f.userData.phase) * 0.45;
    });
  }

  // Undulate water ripples
  if (waterMesh) {
    waterMesh.position.y = -18 + Math.sin(time * 0.8) * 0.2;
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;

  const glow = document.getElementById('cursor-glow');
  if (glow) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }
}

function initCursorFollower() {
  const glow = document.getElementById('cursor-glow');
  if (glow) glow.style.display = 'block';
}

// ==========================================================================
// 4. SCROLL & LUNAR PHASE TRACKING
// ==========================================================================
function initScrollListeners() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

    // Update Three.js camera target slightly
    targetCameraY = -progress * 6;

    // Move 3D Moon position gracefully across the journey
    if (moonMesh) {
      moonMesh.position.x = 9 - progress * 16;
      moonMesh.position.y = 6 - progress * 3;
    }

    // Update Lunar Progress Rail
    const railFill = document.getElementById('lunar-rail-fill');
    const phaseIcon = document.getElementById('lunar-phase-icon');
    const phaseLabel = document.getElementById('lunar-phase-label');

    if (railFill) railFill.style.height = (progress * 100) + '%';

    // Update Lunar Phase
    if (phaseIcon && phaseLabel) {
      if (progress < 0.2) {
        phaseIcon.textContent = '🌑';
        phaseLabel.textContent = 'New Moon';
      } else if (progress < 0.4) {
        phaseIcon.textContent = '🌒';
        phaseLabel.textContent = 'Crescent';
      } else if (progress < 0.6) {
        phaseIcon.textContent = '🌓';
        phaseLabel.textContent = 'First Quarter';
      } else if (progress < 0.8) {
        phaseIcon.textContent = '🌔';
        phaseLabel.textContent = 'Gibbous';
      } else {
        phaseIcon.textContent = '🌕';
        phaseLabel.textContent = 'Full Moon';
      }
    }
  }, { passive: true });
}

// ==========================================================================
// 5. DYNAMIC THEME SWITCHER
// ==========================================================================
function initThemeSwitcher() {
  const btns = document.querySelectorAll('.theme-btn');
  btns.forEach(b => {
    b.addEventListener('click', () => {
      const theme = b.getAttribute('data-theme');
      applyTheme(theme);
    });
  });
}

function applyTheme(theme) {
  document.body.className = `theme-${theme}`;
  currentTheme = theme;

  document.querySelectorAll('.theme-btn').forEach(btn => {
    if (btn.getAttribute('data-theme') === theme) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  // Update Three.js Colors
  if (theme === 'moonlit') {
    ambLight.color.setHex(0xffeedd);
    dirLight.color.setHex(0xffdf88);
    if (scene.fog) scene.fog.color.setHex(0x030712);
  } else if (theme === 'sunset') {
    ambLight.color.setHex(0xffaa88);
    dirLight.color.setHex(0xf97316);
    if (scene.fog) scene.fog.color.setHex(0x140509);
  } else if (theme === 'blossom') {
    ambLight.color.setHex(0xfce7f3);
    dirLight.color.setHex(0xf472b6);
    if (scene.fog) scene.fog.color.setHex(0x160818);
  } else if (theme === 'forest') {
    ambLight.color.setHex(0xbbf7d0);
    dirLight.color.setHex(0x4ade80);
    if (scene.fog) scene.fog.color.setHex(0x03140c);
  }
}

// ==========================================================================
// 6. PROCEDURAL NATURE SOUNDSCAPE (WEB AUDIO API)
// ==========================================================================
function initAudioControls() {
  const btn = document.getElementById('soundtrack-btn');
  if (btn) {
    btn.addEventListener('click', toggleAudio);
  }
}

function toggleAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const icon = document.getElementById('sound-icon');
  const label = document.getElementById('sound-label');

  if (isAudioPlaying) {
    isAudioPlaying = false;
    if (icon) icon.textContent = '🔈';
    if (label) label.textContent = 'Music';
    clearInterval(audioInterval);
  } else {
    isAudioPlaying = true;
    if (icon) icon.textContent = '🔊';
    if (label) label.textContent = 'Playing';
    playPentatonicChime();
    audioInterval = setInterval(playPentatonicChime, 3800);
  }
}

function playPentatonicChime() {
  if (!audioCtx || !isAudioPlaying) return;

  const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 659.25]; // C Major Pentatonic
  const freq = notes[Math.floor(Math.random() * notes.length)];

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.2);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 3.4);
}

function playSingleChime(freq = 523.25) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 1.3);
}

// ==========================================================================
// 7. INTERACTIVE EASTER EGGS & CREATURES
// ==========================================================================
function triggerNickname(type) {
  const toast = document.getElementById('nickname-toast');
  if (!toast) return;

  playSingleChime(587.33);

  const quotes = {
    madhee: '“The real, brilliant, irreplaceable best friend.” ✨',
    madoo: '“The soft, cute, goofy nickname that always brings a smile.” 🌸',
    cr: '“WARNING: Authority level extremely dangerous. Keep calm and do not talk in class! 📋”',
    dumbbell: '“Proof that even the smartest people can have an utterly hilarious nickname! 🏋️‍♀️”'
  };

  toast.textContent = quotes[type] || '✨ Madhee';
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0.9';
  }, 2500);
}

function pokeCreature(type) {
  if (type === 'monkey') {
    playSingleChime(440);
    const speech = document.getElementById('monkey-speech');
    const lines = [
      '“Madam CR, he really is an idiot, but he respects you.”',
      '“I inspected his brain. It is 10% thoughts, 90% bad jokes 😂”',
      '“He promised to bring snacks next time if you forgive him 🍌”'
    ];
    if (speech) speech.textContent = lines[Math.floor(Math.random() * lines.length)];
  } else if (type === 'puppy') {
    playSingleChime(659.25);
    const speech = document.getElementById('puppy-speech');
    const lines = [
      '“Please forgive him! (Disclaimer: I am a puppy, I have zero legal authority 😂)”',
      '“*tail wags violently in support of Madhee* 🐾”',
      '“He is genuinely sorry. I gave him a gentle bark of approval 🐶”'
    ];
    if (speech) speech.textContent = lines[Math.floor(Math.random() * lines.length)];
  }
}

function activatePetal(btn, title, promise) {
  playSingleChime(698.46);

  document.querySelectorAll('.lotus-petal').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');

  const display = document.getElementById('petal-detail-display');
  if (display) {
    display.innerHTML = `<span class="active-detail-text">✦ ${title}: ${promise}</span>`;
  }
}

function sendWishToMoon() {
  playSingleChime(783.99);

  const fb = document.getElementById('wish-feedback');
  if (fb) {
    fb.textContent = '✨ Your wish has flown to the moon. May your skies always be bright and calm 🌙🌸';
  }

  // Trigger floating particle burst in Three.js
  if (firefliesGroup) {
    firefliesGroup.children.forEach(f => {
      f.position.y += 8;
    });
  }
}

function scrollToRandomMemory() {
  const rand = Math.floor(Math.random() * 12) + 1;
  const pad = rand < 10 ? '0' + rand : rand;
  const target = document.getElementById(`chapter-${pad}`);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

// ==========================================================================
// 8. PHOTO LIGHTBOX MODAL
// ==========================================================================
function openLightbox(src, caption) {
  const modal = document.getElementById('photo-lightbox');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');

  if (modal && img && cap) {
    img.src = src;
    cap.textContent = caption;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeLightbox() {
  const modal = document.getElementById('photo-lightbox');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});


// ==========================================================================

// ==========================================================================
