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
  { id: 'prologue', num: '01', title: 'Prologue' },
  { id: 'memories', num: '02', title: '12 Memories' },
  { id: 'chronicles', num: '03', title: 'Case File' },
  { id: 'trust-workshop', num: '04', title: 'Trust Workshop' },
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
      } else if (targetId === 'trust-workshop' || targetId === 'trust-lotus') {
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
// THE TRUST WORKSHOP: 3D CINEMATIC RESTORATION LOGIC (THREE.JS + GSAP)
// ==========================================================================
(function() {
  let workshopInitialized = false;
  let workshopRunning = false;
  let animationFrameId = null;
  let scene, camera, renderer, crystalGroup, crystalMesh;
  let seamMeshes = [];
  let componentObjects = [];
  let dustParticles;
  let raycaster, mouse;
  let isInteracting = false;
  let assembledCount = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let isDragging = false;
  let prevMousePos = { x: 0, y: 0 };

  const WORKSHOP_COMPONENTS = [
    {
      id: 'listen',
      num: '01',
      name: 'LISTEN',
      title: 'COMPONENT 01 • LISTEN',
      quote: '“Sometimes you don\'t need someone to explain themselves.<br>You just need them to actually listen.”',
      color: 0xd4af37,
      pos: { x: -3.8, y: 1.7, z: 1.0 },
      targetOffset: { x: -0.85, y: 0.65, z: 0.75 },
      buildMesh: function() {
        const group = new THREE.Group();
        const geom = new THREE.BoxGeometry(0.85, 1.15, 0.08);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          metalness: 0.85,
          roughness: 0.25
        });
        const plate = new THREE.Mesh(geom, mat);
        group.add(plate);

        const wire = new THREE.LineSegments(
          new THREE.EdgesGeometry(geom),
          new THREE.LineBasicMaterial({ color: 0xfff0b3 })
        );
        group.add(wire);

        const ringMat = new THREE.MeshBasicMaterial({ color: 0xfffae0, side: THREE.DoubleSide });
        const ring1 = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.18, 24), ringMat);
        ring1.position.z = 0.045;
        group.add(ring1);
        const ring2 = new THREE.Mesh(new THREE.RingGeometry(0.24, 0.3, 24), ringMat);
        ring2.position.z = 0.045;
        group.add(ring2);

        return group;
      }
    },
    {
      id: 'understand',
      num: '02',
      name: 'UNDERSTAND',
      title: 'COMPONENT 02 • UNDERSTAND',
      quote: '“Understanding doesn\'t mean agreeing with everything.<br>It means trying to understand why it hurt.”',
      color: 0x9d71ea,
      pos: { x: 3.8, y: 1.9, z: 0.8 },
      targetOffset: { x: 0.85, y: 0.65, z: 0.75 },
      buildMesh: function() {
        const group = new THREE.Group();
        const geom = new THREE.ConeGeometry(0.6, 1.25, 4);
        geom.rotateX(Math.PI / 4);
        const mat = new THREE.MeshPhysicalMaterial({
          color: 0x9d71ea,
          transmission: 0.75,
          opacity: 0.85,
          transparent: true,
          roughness: 0.08,
          metalness: 0.1,
          ior: 1.52,
          clearcoat: 0.8
        });
        const mesh = new THREE.Mesh(geom, mat);
        group.add(mesh);

        const wire = new THREE.LineSegments(
          new THREE.EdgesGeometry(geom),
          new THREE.LineBasicMaterial({ color: 0xe0c3fc })
        );
        group.add(wire);
        return group;
      }
    },
    {
      id: 'respect',
      num: '03',
      name: 'RESPECT',
      title: 'COMPONENT 03 • RESPECT',
      quote: '“Your feelings don\'t need permission to matter.<br>I should have respected that sooner.”',
      color: 0x00b4d8,
      pos: { x: -3.5, y: -1.7, z: 1.2 },
      targetOffset: { x: -0.75, y: -0.65, z: 0.75 },
      buildMesh: function() {
        const group = new THREE.Group();
        const geom = new THREE.CylinderGeometry(0.7, 0.7, 0.08, 8);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x0a3d62,
          metalness: 0.65,
          roughness: 0.3,
          emissive: 0x002233
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.rotation.x = Math.PI / 2;
        group.add(mesh);

        const grid = new THREE.GridHelper(1.1, 6, 0x00f2fe, 0x0077b6);
        grid.rotation.x = Math.PI / 2;
        grid.position.z = 0.045;
        group.add(grid);
        return group;
      }
    },
    {
      id: 'consistency',
      num: '04',
      name: 'CONSISTENCY',
      title: 'COMPONENT 04 • CONSISTENCY',
      quote: '“Trust doesn\'t come back because someone says sorry.<br>It comes back when actions stay consistent.”',
      color: 0xd9822b,
      pos: { x: 3.5, y: -1.6, z: 1.1 },
      targetOffset: { x: 0.75, y: -0.65, z: 0.7 },
      buildMesh: function() {
        const group = new THREE.Group();
        const geom = new THREE.TorusGeometry(0.55, 0.12, 12, 24);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xd9822b,
          metalness: 0.88,
          roughness: 0.22
        });
        const torus = new THREE.Mesh(geom, mat);
        group.add(torus);

        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.12), mat);
          tooth.position.set(Math.cos(angle) * 0.65, Math.sin(angle) * 0.65, 0);
          tooth.rotation.z = angle;
          group.add(tooth);
        }
        return group;
      }
    },
    {
      id: 'actions',
      num: '05',
      name: 'ACTIONS',
      title: 'COMPONENT 05 • ACTIONS',
      quote: '“Words can explain.<br>Actions are what prove.”',
      color: 0xffffff,
      pos: { x: 0.0, y: -3.2, z: 1.5 },
      targetOffset: { x: 0.0, y: -1.05, z: 0.85 },
      buildMesh: function() {
        const group = new THREE.Group();
        const geom = new THREE.CylinderGeometry(0.2, 0.45, 1.3, 6);
        const mat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transmission: 0.85,
          opacity: 0.9,
          transparent: true,
          roughness: 0.06,
          metalness: 0.05,
          ior: 1.55,
          clearcoat: 1.0,
          emissive: 0x332800
        });
        const shard = new THREE.Mesh(geom, mat);
        shard.rotation.z = Math.PI / 6;
        group.add(shard);

        const wire = new THREE.LineSegments(
          new THREE.EdgesGeometry(geom),
          new THREE.LineBasicMaterial({ color: 0xffe680 })
        );
        wire.rotation.z = Math.PI / 6;
        group.add(wire);
        return group;
      }
    }
  ];

  function initTrustWorkshop() {
    if (workshopInitialized) return;
    const container = document.getElementById('trust-workshop-canvas-container');
    if (!container) return;

    workshopInitialized = true;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 9.5);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2640, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xfff1d6, 2.2, 30);
    keyLight.position.set(2, 6, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x7352c7, 1.8, 25);
    rimLight.position.set(-4, -3, -3);
    scene.add(rimLight);

    const goldAccent = new THREE.PointLight(0xe8c547, 1.2, 20);
    goldAccent.position.set(0, -4, 4);
    scene.add(goldAccent);

    // Floating Dust Particles
    const dustCount = 120;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 16;
      dustPos[i + 1] = (Math.random() - 0.5) * 12;
      dustPos[i + 2] = (Math.random() - 0.5) * 12;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xf1dfa5,
      size: 0.045,
      transparent: true,
      opacity: 0.6
    });
    dustParticles = new THREE.Points(dustGeo, dustMat);
    scene.add(dustParticles);

    // Build Central Crystal
    crystalGroup = new THREE.Group();
    const crystalGeo = new THREE.OctahedronGeometry(1.85, 1);
    crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xdbe8fc,
      metalness: 0.15,
      roughness: 0.12,
      transmission: 0.7,
      opacity: 0.88,
      transparent: true,
      ior: 1.52,
      reflectivity: 0.75,
      clearcoat: 0.65
    });
    crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    crystalGroup.add(crystalMesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(crystalGeo),
      new THREE.LineBasicMaterial({ color: 0x829bb8, transparent: true, opacity: 0.45 })
    );
    crystalGroup.add(edges);

    // 5 Kintsugi Seam Curves along Crystal Facets
    const seamCurves = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.2, 1.8, 0.1),
        new THREE.Vector3(-0.75, 1.15, 0.65),
        new THREE.Vector3(-1.3, 0.35, 0.6),
        new THREE.Vector3(-1.0, -0.3, 0.75)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.15, 1.75, 0.15),
        new THREE.Vector3(0.85, 1.05, 0.65),
        new THREE.Vector3(1.25, 0.28, 0.75),
        new THREE.Vector3(1.15, -0.35, 0.55)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.25, 0.2, 0.45),
        new THREE.Vector3(-0.55, -0.2, 1.15),
        new THREE.Vector3(-0.1, -0.75, 1.05),
        new THREE.Vector3(-0.65, -1.25, 0.65)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.15, 0.1, 0.55),
        new THREE.Vector3(0.65, -0.2, 1.15),
        new THREE.Vector3(0.18, -0.75, 1.05),
        new THREE.Vector3(0.75, -1.25, 0.55)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.75, -1.15, 0.45),
        new THREE.Vector3(0.0, -1.35, 0.95),
        new THREE.Vector3(0.65, -1.15, 0.55),
        new THREE.Vector3(0.0, -1.8, 0.1)
      ])
    ];

    seamMeshes = [];
    seamCurves.forEach((curve) => {
      const tubeGeo = new THREE.TubeGeometry(curve, 28, 0.038, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x141b2b,
        roughness: 0.9,
        metalness: 0.1,
        emissive: 0x000000
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      crystalGroup.add(tubeMesh);
      seamMeshes.push(tubeMesh);
    });

    scene.add(crystalGroup);

    // Build 5 Orbiting Components
    componentObjects = [];
    WORKSHOP_COMPONENTS.forEach((cfg, idx) => {
      const compMesh = cfg.buildMesh();
      compMesh.position.set(cfg.pos.x, cfg.pos.y, cfg.pos.z);
      compMesh.userData = {
        index: idx,
        config: cfg,
        initialPos: { ...cfg.pos },
        assembled: false,
        floatPhase: idx * 1.2
      };
      scene.add(compMesh);
      componentObjects.push(compMesh);
    });

    // Raycasting & Interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const getPointerPos = (e) => {
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
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;
      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;
      prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
    });

    container.addEventListener('click', (e) => {
      if (isInteracting) return;
      const p = getPointerPos(e);
      mouse.x = p.x;
      mouse.y = p.y;
      raycaster.setFromCamera(mouse, camera);

      // Check intersect with component objects
      const intersects = raycaster.intersectObjects(componentObjects, true);
      if (intersects.length > 0) {
        let targetComp = intersects[0].object;
        while (targetComp.parent && !targetComp.userData.config) {
          targetComp = targetComp.parent;
        }
        if (targetComp && targetComp.userData && targetComp.userData.config) {
          triggerWorkshopComponent(targetComp.userData.index);
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

  function startWorkshopRenderLoop() {
    if (workshopRunning) return;
    workshopRunning = true;
    let clock = 0;

    function render() {
      if (!workshopRunning) return;
      animationFrameId = requestAnimationFrame(render);
      clock += 0.016;

      // Gentle crystal floating & smooth rotation
      if (crystalGroup) {
        crystalGroup.rotation.y += (targetRotationY - crystalGroup.rotation.y) * 0.06 + 0.002;
        crystalGroup.rotation.x += (targetRotationX - crystalGroup.rotation.x) * 0.06;
        crystalGroup.position.y = Math.sin(clock * 0.8) * 0.08;
      }

      // Idle float for un-assembled components
      componentObjects.forEach((comp) => {
        if (!comp.userData.assembled && !isInteracting) {
          const p = comp.userData.floatPhase;
          comp.position.y = comp.userData.initialPos.y + Math.sin(clock * 1.2 + p) * 0.12;
          comp.rotation.y += 0.006;
          comp.rotation.x += 0.003;
        }
      });

      // Dust drift
      if (dustParticles) {
        dustParticles.rotation.y += 0.0008;
      }

      renderer.render(scene, camera);
    }
    render();
  }

  function stopWorkshopRenderLoop() {
    workshopRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  function triggerWorkshopComponent(index) {
    if (index < 0 || index >= componentObjects.length) return;
    const comp = componentObjects[index];
    const cfg = comp.userData.config;

    // Show Message Card
    const msgCard = document.getElementById('workshop-message-card');
    const msgBadge = document.getElementById('msg-comp-badge');
    const msgQuote = document.getElementById('msg-quote-text');

    if (msgBadge) msgBadge.textContent = cfg.title;
    if (msgQuote) msgQuote.innerHTML = cfg.quote;
    if (msgCard) {
      msgCard.classList.add('show');
    }

    // If already assembled, simply focus camera and update quote
    if (comp.userData.assembled) {
      if (typeof gsap !== 'undefined') {
        gsap.to(camera.position, {
          x: comp.position.x * 0.6,
          y: comp.position.y * 0.6 + 0.4,
          z: 7.2,
          duration: 1.0,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(camera.position, { x: 0, y: 0.8, z: 9.5, duration: 1.2, delay: 2.0, ease: 'power2.inOut' });
          }
        });
      }
      return;
    }

    isInteracting = true;

    // Update active pill button state
    const pills = document.querySelectorAll('.comp-pill');
    pills.forEach((p, idx) => {
      if (idx === index) p.classList.add('active');
      else p.classList.remove('active');
    });

    if (typeof gsap !== 'undefined') {
      // 1. Camera moves towards component
      gsap.to(camera.position, {
        x: cfg.pos.x * 0.65,
        y: cfg.pos.y * 0.65 + 0.3,
        z: 7.0,
        duration: 1.1,
        ease: 'power2.out'
      });

      // 2. Component scales up and travels toward crystal socket
      gsap.to(comp.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 0.6, yoyo: true, repeat: 1 });

      gsap.to(comp.position, {
        x: cfg.targetOffset.x,
        y: cfg.targetOffset.y,
        z: cfg.targetOffset.z,
        duration: 2.0,
        delay: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          // 3. Locks into crystal (Magnetic snap)
          comp.userData.assembled = true;
          crystalGroup.attach(comp);

          // Golden Kintsugi seam transformation
          if (seamMeshes[index]) {
            const mat = seamMeshes[index].material;
            gsap.to(mat.color, { r: 1.0, g: 0.88, b: 0.45, duration: 1.0 });
            gsap.to(mat.emissive, { r: 0.95, g: 0.6, b: 0.12, duration: 1.0 });
            mat.emissiveIntensity = 2.2;
          }

          // Gold flash pulse
          const pulse = new THREE.PointLight(0xffd700, 3.5, 6);
          pulse.position.set(cfg.targetOffset.x, cfg.targetOffset.y, cfg.targetOffset.z);
          crystalGroup.add(pulse);
          gsap.to(pulse, {
            intensity: 0,
            duration: 1.4,
            onComplete: () => crystalGroup.remove(pulse)
          });

          // 4. Update HUD Progress
          assembledCount++;
          const counterLabel = document.getElementById('workshop-progress-label');
          if (counterLabel) counterLabel.textContent = `${assembledCount} / 5 ASSEMBLED`;

          const seg = document.querySelector(`.hud-segment.seg-${index + 1}`);
          if (seg) seg.classList.add('active');

          if (pills[index]) {
            pills[index].classList.add('assembled');
            const st = pills[index].querySelector('.comp-pill-status');
            if (st) st.textContent = '✓';
          }

          // 5. Camera glides back to overview
          gsap.to(camera.position, {
            x: 0,
            y: 0.8,
            z: 9.5,
            duration: 1.4,
            ease: 'power2.inOut',
            onComplete: () => {
              isInteracting = false;
              // Check if all 5 assembled
              if (assembledCount === 5) {
                triggerWorkshopFinale();
              }
            }
          });
        }
      });
    } else {
      // Fallback if GSAP is unavailable
      comp.position.set(cfg.targetOffset.x, cfg.targetOffset.y, cfg.targetOffset.z);
      comp.userData.assembled = true;
      crystalGroup.attach(comp);
      assembledCount++;
      isInteracting = false;
    }
  }

  function triggerWorkshopFinale() {
    // Illuminate full crystal
    if (crystalMat && typeof gsap !== 'undefined') {
      gsap.to(crystalMat.color, { r: 1.0, g: 0.96, b: 0.85, duration: 2.2 });
      gsap.to(crystalMesh.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 1.4, yoyo: true, repeat: 1 });
    }

    // Hide temporary quote message card smoothly
    const msgCard = document.getElementById('workshop-message-card');
    if (msgCard) msgCard.classList.remove('show');

    // Reveal Finale Statement Card
    const finaleCard = document.getElementById('workshop-finale-card');
    if (finaleCard) {
      finaleCard.style.display = 'block';
      setTimeout(() => {
        finaleCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }

  function inspectWorkshopCrystal() {
    targetRotationY += Math.PI * 2;
    if (typeof gsap !== 'undefined') {
      gsap.to(camera.position, {
        x: 0,
        y: 0.2,
        z: 6.8,
        duration: 1.6,
        ease: 'power2.out'
      });
    }
  }

  // Global Exports
  window.initTrustWorkshop = initTrustWorkshop;
  window.resumeTrustWorkshop = startWorkshopRenderLoop;
  window.pauseTrustWorkshop = stopWorkshopRenderLoop;
  window.triggerWorkshopComponent = triggerWorkshopComponent;
  window.inspectWorkshopCrystal = inspectWorkshopCrystal;
})();
