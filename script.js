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
  initSixSectionsScrollSpy();

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


// ==========================================================================
// 13. SIX SECTIONS SCROLLSPY & ACTIVE TAB HIGHLIGHTING
// ==========================================================================
const SIX_SECTIONS = [
  { id: 'prologue', num: '01', title: 'Intro' },
  { id: 'memories', num: '02', title: 'Memories' },
  { id: 'chronicles', num: '03', title: 'Case' },
  { id: 'madhee-dimension', num: '04', title: 'Dimension' },
  { id: 'apology', num: '05', title: 'Letter' },
  { id: 'sanctuary', num: '06', title: 'Sanctuary' }
];


// ==========================================================================
// 6-SECTION PAGED MULTI-STEP NAVIGATION LOGIC
// ==========================================================================
let currentSitePage = 1;

function switchSitePage(pageIndex, targetId) {
  const pageNum = parseInt(pageIndex, 10);
  if (isNaN(pageNum) || pageNum < 1 || pageNum > 6) return;
  
  currentSitePage = pageNum;

  // 1. Hide all pages, show selected page
  const pages = document.querySelectorAll('.site-section-page');
  pages.forEach(page => {
    const p = parseInt(page.getAttribute('data-page'), 10);
    if (p === pageNum) {
      page.classList.add('active-page');
      page.style.display = 'block';
    } else {
      page.classList.remove('active-page');
      page.style.display = 'none';
    }
  });

  // 2. Update navbar active tabs
  const navLinks = document.querySelectorAll('#mainNavLinks .nav-link');
  navLinks.forEach((link, idx) => {
    if (idx + 1 === pageNum) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 3. Update side rail label
  const railLabel = document.getElementById('lunar-phase-label');
  if (railLabel && typeof SIX_SECTIONS !== 'undefined' && SIX_SECTIONS[pageNum - 1]) {
    const sec = SIX_SECTIONS[pageNum - 1];
    railLabel.textContent = `Section ${sec.num}: ${sec.title}`;
  }

  // 4. Scroll to target or top
  if (targetId) {
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 60);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Override scrollToRandomMemory to ensure page 2 is active
function scrollToRandomMemory() {
  switchSitePage(2);
  const rand = Math.floor(Math.random() * 12) + 1;
  const pad = rand < 10 ? '0' + rand : rand;
  setTimeout(() => {
    const target = document.getElementById('chapter-' + pad);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, 120);
}

// Replace initSixSectionsScrollSpy with Page Controller Initializer
function initSixSectionsScrollSpy() {
  // Initialize page 1 as active
  switchSitePage(1);
  
  // Handle any anchor clicks to navigate to correct page
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const targetId = href.substring(1);
      
      // Check which section this targetId belongs to
      if (targetId === 'prologue' || targetId === 'hero') {
        e.preventDefault();
        switchSitePage(1, targetId);
      } else if (targetId === 'memories' || targetId.startsWith('chapter-')) {
        e.preventDefault();
        switchSitePage(2, targetId);
      } else if (targetId === 'chronicles') {
        e.preventDefault();
        switchSitePage(3, targetId);
      } else if (targetId === 'madhee-dimension' || targetId === 'dimension' || targetId === 'trust-lotus' || targetId === 'trust-workshop') {
        e.preventDefault();
        switchSitePage(4, targetId);
      } else if (targetId === 'apology') {
        e.preventDefault();
        switchSitePage(5, targetId);
      } else if (targetId === 'sanctuary') {
        e.preventDefault();
        switchSitePage(6, targetId);
      }
    });
  });
}


window.switchSitePage = switchSitePage;

// ==========================================================================
// TRENDING DANCING BEAR SWITCHER
// ==========================================================================
function switchDancingBear(src, btn) {
  const bearImg = document.getElementById('active-dancing-bear');
  if (bearImg) {
    bearImg.style.opacity = '0.2';
    bearImg.style.transform = 'scale(0.95)';
    bearImg.style.transition = 'all 0.2s ease';
    setTimeout(() => {
      bearImg.src = src;
      bearImg.style.opacity = '1';
      bearImg.style.transform = 'scale(1)';
    }, 150);
  }
  const buttons = document.querySelectorAll('.bear-select-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) {
    btn.classList.add('active');
  }
}
window.switchDancingBear = switchDancingBear;



// ==========================================================================
// THE MADHEE DIMENSION: 3D MULTIVERSE & THE 5 WORLDS (THREE.JS + GSAP)
// ==========================================================================
(function() {
  let dimensionInitialized = false;
  let dimensionRunning = false;
  let animationFrameId = null;
  let scene, camera, renderer;
  let coreSphere, coreOrbitRings = [];
  let worldMeshes = [];
  let spaceDust;
  let raycaster, mouse;
  let activeWorldIndex = null;
  let visitedWorlds = new Set();
  let universeRotation = { x: 0, y: 0 };
  let targetRotation = { x: 0, y: 0 };
  let isDragging = false;
  let prevPointer = { x: 0, y: 0 };

  const WORLDS_DATA = [
    {
      id: 'calm',
      title: 'HER CALM SIDE 🌙',
      badge: 'WORLD 01 • MOONLIT SERENITY',
      quote: '“Some moments don\'t need noise.<br>Sometimes your quiet side is the prettiest one.”',
      color: 0x7ec8e3,
      emissive: 0x112233,
      pos: { x: -4.8, y: 2.2, z: 0.8 },
      buildWorld: function() {
        const group = new THREE.Group();
        // Moon sphere
        const geo = new THREE.SphereGeometry(0.85, 24, 24);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xa4d4e6,
          roughness: 0.6,
          metalness: 0.1,
          emissive: 0x182c3f
        });
        const moon = new THREE.Mesh(geo, mat);
        group.add(moon);

        // Soft celestial halo ring
        const ringGeo = new THREE.RingGeometry(1.1, 1.25, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xc4e5f2, side: THREE.DoubleSide, transparent: true, opacity: 0.45 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.5;
        group.add(ring);

        // Orbiting mini moon
        const subMoonGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const subMoonMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const subMoon = new THREE.Mesh(subMoonGeo, subMoonMat);
        subMoon.position.set(1.5, 0.4, 0);
        group.add(subMoon);
        group.userData.subOrbiter = subMoon;

        return group;
      }
    },
    {
      id: 'happy',
      title: 'HER HAPPY SIDE ☀️',
      badge: 'WORLD 02 • RADIANT SUNRISE',
      quote: '“That smile should honestly come with a warning.<br>Too much happiness detected. 😭”',
      color: 0xffb703,
      emissive: 0x663d00,
      pos: { x: 4.8, y: 2.4, z: 0.5 },
      buildWorld: function() {
        const group = new THREE.Group();
        // Glowing sun core
        const geo = new THREE.SphereGeometry(0.88, 24, 24);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xffb703,
          roughness: 0.3,
          metalness: 0.2,
          emissive: 0xff8c00,
          emissiveIntensity: 0.6
        });
        const sun = new THREE.Mesh(geo, mat);
        group.add(sun);

        // Corona spikes / corona ring
        const coronaGeo = new THREE.TorusGeometry(1.2, 0.05, 12, 32);
        const coronaMat = new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.7 });
        const corona1 = new THREE.Mesh(coronaGeo, coronaMat);
        group.add(corona1);
        const corona2 = new THREE.Mesh(coronaGeo, coronaMat);
        corona2.rotation.x = Math.PI / 2;
        group.add(corona2);

        group.userData.sunMesh = sun;
        return group;
      }
    },
    {
      id: 'chaos',
      title: 'HER CHAOS SIDE 😂',
      badge: 'WORLD 03 • UNPREDICTABLE HAZARD ZONE',
      quote: '“WARNING.<br>Madhee has entered chaos mode.<br>Please remain calm.”',
      hasHazardButton: true,
      color: 0xff4757,
      emissive: 0x4a0e14,
      pos: { x: -4.4, y: -2.0, z: 1.2 },
      buildWorld: function() {
        const group = new THREE.Group();
        // Asteroid / chaos sphere
        const geo = new THREE.DodecahedronGeometry(0.85, 1);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xff4757,
          roughness: 0.4,
          metalness: 0.3,
          emissive: 0x800c19
        });
        const asteroid = new THREE.Mesh(geo, mat);
        group.add(asteroid);

        // Spinning hazard warning ring
        const ringGeo = new THREE.TorusGeometry(1.2, 0.06, 8, 24);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xfeca57, emissive: 0xb37400 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 3;
        group.add(ring);
        group.userData.chaosRing = ring;

        return group;
      }
    },
    {
      id: 'main-character',
      title: 'MAIN CHARACTER ENERGY ✨',
      badge: 'WORLD 04 • CINEMATIC CENTERSTAGE',
      quote: '“Some people enter a room.<br>You somehow become the scene.”<br><span style="color:#ffd875;font-weight:600;">“Unfair, honestly. 😭”</span>',
      color: 0xf1c40f,
      emissive: 0x544000,
      pos: { x: 4.4, y: -1.9, z: 1.0 },
      buildWorld: function() {
        const group = new THREE.Group();
        // Faceted diamond / gem sphere
        const geo = new THREE.IcosahedronGeometry(0.85, 0);
        const mat = new THREE.MeshPhysicalMaterial({
          color: 0xfff0b3,
          roughness: 0.1,
          metalness: 0.3,
          transmission: 0.65,
          transparent: true,
          clearcoat: 1.0,
          emissive: 0x473800
        });
        const gem = new THREE.Mesh(geo, mat);
        group.add(gem);

        // Stage Pedestal ring below
        const pedestalGeo = new THREE.CylinderGeometry(1.1, 1.2, 0.1, 16);
        const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, metalness: 0.8, roughness: 0.2 });
        const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
        pedestal.position.y = -0.95;
        group.add(pedestal);

        return group;
      }
    },
    {
      id: 'maam',
      title: 'HER MA\'AM SIDE 👑',
      badge: 'WORLD 05 • CLASS CR HEADQUARTERS',
      quote: '<strong>CLASS REPRESENTATIVE OFFICE</strong><br><span style="color:#38ef7d;font-family:Cinzel,monospace;font-size:0.85rem;">STATUS: “MA\'AM IS IN CHARGE.”</span>',
      hasMaamFiles: true,
      color: 0x8e44ad,
      emissive: 0x3b1154,
      pos: { x: 0.0, y: -3.8, z: 1.4 },
      buildWorld: function() {
        const group = new THREE.Group();
        // High-tech holographic sphere
        const geo = new THREE.SphereGeometry(0.85, 20, 20);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x9b59b6,
          metalness: 0.6,
          roughness: 0.25,
          emissive: 0x3d1752
        });
        const sphere = new THREE.Mesh(geo, mat);
        group.add(sphere);

        // Floating holographic document tablets around it
        for (let i = 0; i < 3; i++) {
          const tabGeo = new THREE.BoxGeometry(0.35, 0.45, 0.02);
          const tabMat = new THREE.MeshBasicMaterial({ color: 0xe056fd, wireframe: true });
          const tab = new THREE.Mesh(tabGeo, tabMat);
          const ang = (i / 3) * Math.PI * 2;
          tab.position.set(Math.cos(ang) * 1.3, (i - 1) * 0.3, Math.sin(ang) * 1.3);
          tab.rotation.y = ang;
          group.add(tab);
        }
        return group;
      }
    }
  ];

  function enterMadheeDimension() {
    const gate = document.getElementById('dimension-portal-gate');
    const stage = document.getElementById('dimension-universe-stage');
    
    if (gate && stage) {
      gate.style.opacity = '0';
      gate.style.transform = 'scale(1.1)';
      setTimeout(() => {
        gate.style.display = 'none';
        stage.style.display = 'block';
        initMadheeDimension();
        startDimensionRenderLoop();

        // Warp Camera Effect with GSAP
        if (typeof gsap !== 'undefined' && camera) {
          camera.position.set(0, 0, 24);
          gsap.to(camera.position, {
            x: 0,
            y: 0.5,
            z: 9.8,
            duration: 1.8,
            ease: 'power3.out'
          });
        }
      }, 400);
    }
  }

  function initMadheeDimension() {
    if (dimensionInitialized) return;
    const container = document.getElementById('madhee-dimension-canvas-container');
    if (!container) return;

    dimensionInitialized = true;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 9.8);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Cosmic Lighting
    const ambientLight = new THREE.AmbientLight(0x182440, 1.6);
    scene.add(ambientLight);

    const centralSunLight = new THREE.PointLight(0xfff5dd, 2.5, 25);
    centralSunLight.position.set(0, 0, 0);
    scene.add(centralSunLight);

    const topFill = new THREE.PointLight(0x7352c7, 1.8, 30);
    topFill.position.set(2, 6, 4);
    scene.add(topFill);

    const bottomGlow = new THREE.PointLight(0x00d2d3, 1.2, 25);
    bottomGlow.position.set(-2, -5, 3);
    scene.add(bottomGlow);

    // Space Dust Field
    const dustCount = 180;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 22;
      dustPos[i + 1] = (Math.random() - 0.5) * 16;
      dustPos[i + 2] = (Math.random() - 0.5) * 16;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.048,
      transparent: true,
      opacity: 0.7
    });
    spaceDust = new THREE.Points(dustGeo, dustMat);
    scene.add(spaceDust);

    // Central Sphere: "MADHEE"
    const coreGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0xfff4d9,
      emissive: 0x47300c,
      emissiveIntensity: 0.5,
      metalness: 0.15,
      roughness: 0.12,
      transmission: 0.5,
      transparent: true,
      ior: 1.45,
      clearcoat: 0.9
    });
    coreSphere = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreSphere);

    // Orbit Rings around Central Core
    const ring1Geo = new THREE.TorusGeometry(2.3, 0.022, 12, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xe8c547, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);
    coreOrbitRings.push(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.8, 0.018, 12, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xa29bfe, transparent: true, opacity: 0.45 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = Math.PI / 6;
    scene.add(ring2);
    coreOrbitRings.push(ring2);

    // Build the 5 Orbiting Worlds
    worldMeshes = [];
    WORLDS_DATA.forEach((wData, idx) => {
      const worldGroup = wData.buildWorld();
      worldGroup.position.set(wData.pos.x, wData.pos.y, wData.pos.z);
      worldGroup.userData = {
        index: idx,
        config: wData,
        basePos: { ...wData.pos },
        floatOffset: idx * 1.3
      };
      scene.add(worldGroup);
      worldMeshes.push(worldGroup);
    });

    // Pointer Drag & Click
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const getPointerCoords = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1
      };
    };

    container.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevPointer = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevPointer.x;
      const dy = e.clientY - prevPointer.y;
      targetRotation.y += dx * 0.005;
      targetRotation.x += dy * 0.005;
      prevPointer = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
    });

    container.addEventListener('click', (e) => {
      const p = getPointerCoords(e);
      mouse.x = p.x;
      mouse.y = p.y;
      raycaster.setFromCamera(mouse, camera);

      // Check intersect with central core
      const coreHit = raycaster.intersectObject(coreSphere);
      if (coreHit.length > 0) {
        focusDimensionCore();
        return;
      }

      // Check intersect with worlds
      const hits = raycaster.intersectObjects(worldMeshes, true);
      if (hits.length > 0) {
        let parent = hits[0].object;
        while (parent.parent && !parent.userData.config) {
          parent = parent.parent;
        }
        if (parent && parent.userData && parent.userData.config) {
          enterWorld(parent.userData.index);
        }
      }
    });

    // Responsive Resize
    window.addEventListener('resize', () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  function startDimensionRenderLoop() {
    if (dimensionRunning) return;
    dimensionRunning = true;
    let clock = 0;

    function animate() {
      if (!dimensionRunning) return;
      animationFrameId = requestAnimationFrame(animate);
      clock += 0.016;

      // Rotate Universe based on drag
      universeRotation.x += (targetRotation.x - universeRotation.x) * 0.06;
      universeRotation.y += (targetRotation.y - universeRotation.y) * 0.06;

      // Central core gentle rotation
      if (coreSphere) {
        coreSphere.rotation.y = clock * 0.15 + universeRotation.y;
        coreSphere.rotation.x = universeRotation.x;
        coreSphere.position.y = Math.sin(clock * 0.8) * 0.08;
      }

      // Orbit rings spin
      coreOrbitRings.forEach((r, idx) => {
        r.rotation.z = clock * (idx === 0 ? 0.2 : -0.15);
      });

      // Orbiting worlds idle floating & spinning
      worldMeshes.forEach((w) => {
        const p = w.userData.floatOffset;
        if (activeWorldIndex !== w.userData.index) {
          w.position.y = w.userData.basePos.y + Math.sin(clock * 1.1 + p) * 0.14;
          w.rotation.y += 0.008;
        }

        // Sub-elements rotation
        if (w.userData.subOrbiter) {
          w.userData.subOrbiter.position.x = Math.cos(clock * 2) * 1.5;
          w.userData.subOrbiter.position.z = Math.sin(clock * 2) * 1.5;
        }
        if (w.userData.chaosRing) {
          w.userData.chaosRing.rotation.z += 0.02;
        }
      });

      // Space dust drift
      if (spaceDust) {
        spaceDust.rotation.y += 0.0006;
      }

      renderer.render(scene, camera);
    }
    animate();
  }

  function stopDimensionRenderLoop() {
    dimensionRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function enterWorld(index) {
    if (index < 0 || index >= WORLDS_DATA.length) return;
    activeWorldIndex = index;
    visitedWorlds.add(index);
    const wData = WORLDS_DATA[index];
    const wMesh = worldMeshes[index];

    // Highlight pill button
    const pills = document.querySelectorAll('.world-pill');
    pills.forEach((p, idx) => {
      if (idx === index) p.classList.add('active');
      else p.classList.remove('active');
    });

    // Build World Modal Content
    const modal = document.getElementById('dimension-world-modal');
    const content = document.getElementById('world-modal-content');
    if (content) {
      let extraHTML = '';
      if (wData.hasHazardButton) {
        extraHTML = `
          <div class="w-extra-action">
            <button type="button" class="btn-hazard-press" onclick="triggerChaosMonkey()">
              <span>⚠️ DO NOT PRESS ⚠️</span>
            </button>
          </div>
        `;
      } else if (wData.hasMaamFiles) {
        extraHTML = `
          <div class="w-extra-action" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
            <span class="w-badge" style="cursor:default;">ATTENDANCE</span>
            <span class="w-badge" style="cursor:default;">COMPLAINTS</span>
            <span class="w-badge" style="cursor:default;">RULES</span>
            <button type="button" class="w-badge" style="background:#e74c3c;border-color:#ff7675;color:#fff;cursor:pointer;" onclick="openMaamDossier()">
              SHUBHOD\'S FILE 😭
            </button>
          </div>
        `;
      }

      content.innerHTML = `
        <span class="w-badge">${wData.badge}</span>
        <h3 class="w-title">${wData.title}</h3>
        <div class="w-quote-block">${wData.quote}</div>
        ${extraHTML}
      `;
    }

    if (modal) {
      modal.classList.add('show');
    }

    // Camera fly smoothly towards the world
    if (typeof gsap !== 'undefined' && camera) {
      gsap.to(camera.position, {
        x: wData.pos.x * 0.72,
        y: wData.pos.y * 0.72,
        z: 4.8,
        duration: 1.2,
        ease: 'power2.out'
      });
    }

    // Check if user has explored all 5 worlds
    if (visitedWorlds.size === 5) {
      setTimeout(() => {
        showDimensionFinale();
      }, 2500);
    }
  }

  function exitWorldView() {
    activeWorldIndex = null;
    const modal = document.getElementById('dimension-world-modal');
    if (modal) modal.classList.remove('show');

    // Camera return to overview
    if (typeof gsap !== 'undefined' && camera) {
      gsap.to(camera.position, {
        x: 0,
        y: 0.5,
        z: 9.8,
        duration: 1.2,
        ease: 'power2.inOut'
      });
    }

    const pills = document.querySelectorAll('.world-pill');
    pills.forEach(p => p.classList.remove('active'));
  }

  function focusDimensionCore() {
    exitWorldView();
    if (typeof gsap !== 'undefined' && camera) {
      gsap.to(camera.position, {
        x: 0,
        y: 0.2,
        z: 5.5,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: () => {
          showDimensionFinale();
        }
      });
    }
  }

  function triggerChaosMonkey() {
    const popup = document.getElementById('chaos-monkey-popup');
    if (popup) {
      popup.classList.add('show');
    }
  }

  function dismissChaosMonkey() {
    const popup = document.getElementById('chaos-monkey-popup');
    if (popup) {
      popup.classList.remove('show');
    }
  }

  function openMaamDossier() {
    const modal = document.getElementById('maam-dossier-modal');
    if (modal) {
      modal.classList.add('show');
    }
  }

  function closeMaamDossier() {
    const modal = document.getElementById('maam-dossier-modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  function showDimensionFinale() {
    const finale = document.getElementById('dimension-universe-finale');
    if (finale) {
      finale.style.display = 'block';
      setTimeout(() => {
        finale.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }

  // Global Exports
  window.enterMadheeDimension = enterMadheeDimension;
  window.initMadheeDimension = initMadheeDimension;
  window.resumeMadheeDimension = startDimensionRenderLoop;
  window.pauseMadheeDimension = stopDimensionRenderLoop;
  window.enterWorld = enterWorld;
  window.exitWorldView = exitWorldView;
  window.focusDimensionCore = focusDimensionCore;
  window.triggerChaosMonkey = triggerChaosMonkey;
  window.dismissChaosMonkey = dismissChaosMonkey;
  window.openMaamDossier = openMaamDossier;
  window.closeMaamDossier = closeMaamDossier;
})();

// ==========================================================================
// CUTU BUBU BEAR INTERACTION
// ==========================================================================
function wiggleBubu() {
  const bearImg = document.getElementById('active-dancing-bear');
  const whisper = document.querySelector('.bubu-whisper');
  if (bearImg) {
    bearImg.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    bearImg.style.transform = 'scale(1.2) rotate(-7deg)';
    setTimeout(function() {
      bearImg.style.transform = 'scale(1.2) rotate(7deg)';
      setTimeout(function() {
        bearImg.style.transform = 'scale(1) rotate(0deg)';
      }, 250);
    }, 250);
  }

  if (whisper) {
    const funnyLines = [
      '“Cutu Bubu is wiggling at MAXIMUM HAPPINESS for Madhee! 😭😂❤️”',
      '“Look at those little bear ears moving! Mission: Make Madhee smile! 🐻🌸”',
      '“Bubu says: No sad faces allowed in this sanctuary! 🥺✨”',
      '“Wiggle level: OVER 9000! Smile guaranteed, Ma\\\'am! 🐻💃”'
    ];
    whisper.innerHTML = funnyLines[Math.floor(Math.random() * funnyLines.length)];
  }

  const stage = document.querySelector('.bubu-glow-frame');
  if (stage) {
    const emojis = ['🌸', '✨', '❤️', '🐻', '💫'];
    for (let i = 0; i < 5; i++) {
      const sp = document.createElement('span');
      sp.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      sp.style.position = 'absolute';
      sp.style.left = (20 + Math.random() * 60) + '%';
      sp.style.top = (20 + Math.random() * 60) + '%';
      sp.style.fontSize = '1.3rem';
      sp.style.pointerEvents = 'none';
      sp.style.transition = 'all 0.9s ease-out';
      sp.style.zIndex = '100';
      stage.appendChild(sp);
      setTimeout(function() {
        sp.style.transform = 'translateY(-45px) scale(1.3)';
        sp.style.opacity = '0';
      }, 50);
      setTimeout(function() { sp.remove(); }, 1000);
    }
  }
}
window.wiggleBubu = wiggleBubu;

// ==========================================================================
// CUTU BUBU LETTER REGRET & REQUESTING SWITCHER
// ==========================================================================
function switchBubuLetter(mode, btn) {
  const img = document.getElementById('bubu-letter-img');
  const speech = document.querySelector('.bubu-speech-quote');
  if (!img) return;

  document.querySelectorAll('.bubu-letter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  if (mode === 'regret') {
    img.src = 'images/bears/bubu-regret-sorry.gif';
    if (speech) speech.textContent = '“Bachaaa… Bubu knows he made a huge mistake. He feels so deeply guilty & has so much regret for what he did… please listen to him once? 🥺🤍”';
  } else if (mode === 'plead') {
    img.src = 'images/bears/bubu-plead-forgive.gif';
    if (speech) speech.textContent = '“Bubu is bowing all the way down… please maaf kardo na? He won\'t ever make you feel bad again, promise! 🙇‍♂️🤍”';
  } else if (mode === 'crying') {
    img.src = 'images/bears/bubu-crying-tears.gif';
    if (speech) speech.textContent = '“Bubu has heavy tears in his eyes… he never ever wanted to hurt you. Dil se sorry Madhee… 😢🐾”';
  }
}
window.switchBubuLetter = switchBubuLetter;
