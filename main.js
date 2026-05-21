/* ═══════════════════════════════════════════════════════════════
   HEISENWORKS.STUDIO — Core Interactions & Animations (main.js)
   ═══════════════════════════════════════════════════════════════ */

/* ── LENIS SMOOTH SCROLL INITIALIZATION ── */
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* ── DNA SCROLL ANIMATION ── */
window.scrollProgress = 0;
const dnaCanvas = document.getElementById('dna-canvas');
if (dnaCanvas) {
  const dnaCtx = dnaCanvas.getContext('2d');
  function resizeDna() {
    dnaCanvas.width = dnaCanvas.offsetWidth;
    dnaCanvas.height = dnaCanvas.offsetHeight;
  }
  window.addEventListener('resize', resizeDna);
  resizeDna();
  
  let lastDnaScroll = -1;
  function drawDna() {
    if (Math.abs(lastDnaScroll - window.scrollProgress) < 0.0001) {
      requestAnimationFrame(drawDna);
      return;
    }
    lastDnaScroll = window.scrollProgress;
    dnaCtx.clearRect(0, 0, dnaCanvas.width, dnaCanvas.height);
    
    const w = dnaCanvas.width, h = dnaCanvas.height, centerX = w / 2;
    const nodes = 45, spacing = h / nodes, amplitude = w * 0.35, frequency = 0.15;
    const phaseOffset = window.scrollProgress * Math.PI * 10;
    
    dnaCtx.lineWidth = 1.5;
    
    // Draw connecting rods and nodes
    for (let i = 0; i <= nodes; i++) {
      const y = i * spacing, phase = i * frequency + phaseOffset;
      const x1 = centerX + Math.sin(phase) * amplitude;
      const x2 = centerX + Math.sin(phase + Math.PI) * amplitude;
      const isActive = window.scrollProgress >= (i / nodes);
      
      // Rod
      dnaCtx.beginPath();
      dnaCtx.moveTo(x1, y);
      dnaCtx.lineTo(x2, y);
      dnaCtx.strokeStyle = isActive ? 'rgba(0,71,255,0.4)' : 'rgba(155,152,144,0.1)';
      dnaCtx.stroke();
      
      // Node 1 (Cobalt)
      dnaCtx.beginPath();
      dnaCtx.arc(x1, y, 2.5, 0, Math.PI * 2);
      dnaCtx.fillStyle = isActive ? '#0047FF' : 'rgba(155,152,144,0.2)';
      dnaCtx.fill();
      
      // Node 2 (Green)
      dnaCtx.beginPath();
      dnaCtx.arc(x2, y, 2.5, 0, Math.PI * 2);
      dnaCtx.fillStyle = isActive ? '#1DB954' : 'rgba(155,152,144,0.2)';
      dnaCtx.fill();
    }
    
    // Draw Strand 1
    dnaCtx.beginPath();
    for (let i = 0; i <= nodes; i++) {
      const y = i * spacing, phase = i * frequency + phaseOffset;
      const x1 = centerX + Math.sin(phase) * amplitude;
      if (i === 0) dnaCtx.moveTo(x1, y); else dnaCtx.lineTo(x1, y);
    }
    dnaCtx.strokeStyle = 'rgba(0,71,255,0.25)';
    dnaCtx.stroke();
    
    // Draw Strand 2
    dnaCtx.beginPath();
    for (let i = 0; i <= nodes; i++) {
      const y = i * spacing, phase = i * frequency + phaseOffset;
      const x2 = centerX + Math.sin(phase + Math.PI) * amplitude;
      if (i === 0) dnaCtx.moveTo(x2, y); else dnaCtx.lineTo(x2, y);
    }
    dnaCtx.strokeStyle = 'rgba(29,185,84,0.25)';
    dnaCtx.stroke();
    
    requestAnimationFrame(drawDna);
  }
  requestAnimationFrame(drawDna);
}

/* ── CUSTOM CURSOR & DYNAMIC TRAILS ── */
const dot = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
if (dot && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0, mc = 0;
  
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    
    // Throttled trail generation: 1 in 4 mouse movements
    if (++mc % 4 === 0) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.cssText = `left:${mx}px;top:${my}px;transform:translate(-50%,-50%)`;
      document.body.appendChild(trail);
      
      requestAnimationFrame(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'translate(-50%,-50%) scale(0)';
      });
      setTimeout(() => trail.remove(), 400);
    }
  });
  
  // Animation Loop for smoothing custom cursor ring
  (function updateCursor() {
    dot.style.transform = `translate(${mx}px,${my}px)`;
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(updateCursor);
  })();
  
  // Add hover classes
  document.querySelectorAll('a, button, .wcard, .team-card, .skill-node, #chat-trigger').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

/* ── KATANA CANVAS SLASH ANIMATION ── */
const kCanvas = document.getElementById('katana-canvas');
if (kCanvas) {
  const kCtx = kCanvas.getContext('2d');
  function resizeK() {
    kCanvas.width = kCanvas.offsetWidth;
    kCanvas.height = kCanvas.offsetHeight;
  }
  resizeK();
  window.addEventListener('resize', resizeK);
  
  let sP = [], sT = [], sF = 0, kRun = false;
  
  function Slash(x1, y1, x2, y2) {
    this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2;
    this.life = 1; this.width = 4;
    
    // Generate glowing splash sparks
    for (let i = 0; i < 25; i++) {
      const t = i / 25;
      sP.push({
        x: x1 + (x2 - x1) * t + (Math.random() - 0.5) * 10,
        y: y1 + (y2 - y1) * t + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -Math.random() * 2.5 - 1,
        life: 1 + Math.random() * 0.4,
        size: Math.random() * 3 + 1,
        h: Math.random() < 0.7 ? 215 : 150 // Blue or Green hues
      });
    }
    
    sF = 0.5;
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 120);
    
    if (!kRun) {
      kRun = true;
      drawSlashLayer();
    }
  }
  
  function drawSlashLayer() {
    kCtx.clearRect(0, 0, kCanvas.width, kCanvas.height);
    
    // Draw screen flash
    if (sF > 0) {
      kCtx.fillStyle = `rgba(0,71,255,${sF * 0.15})`;
      kCtx.fillRect(0, 0, kCanvas.width, kCanvas.height);
      sF = Math.max(0, sF - 0.04);
    }
    
    // Render Slashes
    sT.forEach((s) => {
      if (s.life <= 0) return;
      const g = kCtx.createLinearGradient(s.x1, s.y1, s.x2, s.y2);
      g.addColorStop(0, 'rgba(0,100,255,0)');
      g.addColorStop(0.3, `rgba(100,180,255,${s.life})`);
      g.addColorStop(0.5, `rgba(220,240,255,${s.life})`);
      g.addColorStop(0.7, `rgba(100,180,255,${s.life})`);
      g.addColorStop(1, 'rgba(0,100,255,0)');
      
      kCtx.save();
      kCtx.beginPath();
      kCtx.moveTo(s.x1, s.y1);
      kCtx.lineTo(s.x2, s.y2);
      kCtx.strokeStyle = g;
      kCtx.lineWidth = s.width * s.life;
      kCtx.lineCap = 'round';
      kCtx.shadowColor = '#4488FF';
      kCtx.shadowBlur = 18 * s.life;
      kCtx.stroke();
      kCtx.restore();
      
      // Secondary ambient glow trail
      kCtx.beginPath();
      kCtx.moveTo(s.x1, s.y1);
      kCtx.lineTo(s.x2, s.y2);
      kCtx.strokeStyle = `rgba(0,71,255,${s.life * 0.12})`;
      kCtx.lineWidth = s.width * s.life * 10;
      kCtx.lineCap = 'round';
      kCtx.stroke();
      
      s.life -= 0.02;
    });
    sT = sT.filter((s) => s.life > 0);
    
    // Render Sparks
    sP.forEach((p) => {
      if (p.life <= 0) return;
      const c = p.h === 215 ? `rgba(100,180,255,${p.life})` : `rgba(30,185,84,${p.life * 0.7})`;
      kCtx.beginPath();
      kCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      kCtx.fillStyle = c;
      kCtx.fill();
      
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // gravity pull
      p.life -= 0.025;
    });
    sP = sP.filter((p) => p.life > 0);
    
    if (sT.length || sP.length || sF > 0) {
      requestAnimationFrame(drawSlashLayer);
    } else {
      kRun = false;
    }
  }
  
  // Automated background ambient slashes
  function autoSlash() {
    if (window.scrollY < window.innerHeight * 2.5) {
      const w = kCanvas.width, h = kCanvas.height;
      const types = [
        () => ({ x1: w * (0.05 + Math.random() * 0.3), y1: h * (0.1 + Math.random() * 0.3), x2: w * (0.05 + Math.random() * 0.3) + w * (0.4 + Math.random() * 0.3), y2: h * (0.1 + Math.random() * 0.3) + h * (0.3 + Math.random() * 0.3) }),
        () => ({ x1: w * (0.5 + Math.random() * 0.4), y1: h * (0.05 + Math.random() * 0.3), x2: w * (0.5 + Math.random() * 0.4) - w * (0.35 + Math.random() * 0.25), y2: h * (0.05 + Math.random() * 0.3) + h * (0.3 + Math.random() * 0.35) }),
        () => {
          const sy = h * (0.25 + Math.random() * 0.5);
          return { x1: w * 0.02, y1: sy - h * 0.05, x2: w * 0.9, y2: sy + h * 0.03 };
        }
      ];
      
      const select = types[Math.floor(Math.random() * types.length)]();
      sT.push(new Slash(select.x1, select.y1, select.x2, select.y2));
      
      if (Math.random() < 0.3) {
        setTimeout(() => {
          const select2 = types[Math.floor(Math.random() * types.length)]();
          sT.push(new Slash(select2.x1, select2.y1, select2.x2, select2.y2));
        }, 150);
      }
    }
    setTimeout(autoSlash, 3000 + Math.random() * 3000);
  }
  setTimeout(autoSlash, 800);
  
  // Interactive click slashes on Hero art sticky
  const heroSticky = document.getElementById('hero-sticky');
  if (heroSticky) {
    heroSticky.addEventListener('click', (e) => {
      const r = kCanvas.getBoundingClientRect();
      const cx = e.clientX - r.left, cy = e.clientY - r.top;
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.6;
      const len = kCanvas.width * 0.5;
      
      sT.push(new Slash(
        cx - Math.cos(angle) * len * 0.4,
        cy - Math.sin(angle) * len * 0.4,
        cx + Math.cos(angle) * len * 0.6,
        cy + Math.sin(angle) * len * 0.6
      ));
    });
  }
}

/* ── SCROLL-BASED PIN & REVEAL TRANSLATIONS ── */
const heroPin = document.getElementById('hero-pin');
const heroFrame = document.getElementById('hero-frame');
const heroText = document.getElementById('hero-text');
const pageReveal = document.getElementById('page-reveal');
const heroArt = document.getElementById('hero-art');
const heroScanLines = document.querySelector('.hero-scan-lines');

if (heroPin && heroFrame) {
  let sTick = false;
  window.addEventListener('scroll', () => {
    if (!sTick) {
      sTick = true;
      requestAnimationFrame(() => {
        const h = document.documentElement;
        window.scrollProgress = (h.scrollTop / (h.scrollHeight - h.clientHeight));
        
        const pinTop = heroPin.getBoundingClientRect().top;
        const totalScroll = heroPin.offsetHeight - window.innerHeight;
        const scrolled = -pinTop;
        
        if (scrolled >= 0 && scrolled <= totalScroll) {
          const p = scrolled / totalScroll;
          if (pageReveal) pageReveal.style.opacity = Math.max(0, Math.min((p - 0.15) / 0.75, 1));
          if (heroText) {
            heroText.style.opacity = Math.max(0, 1 - p * 4);
            heroText.style.transform = `translateY(${p * -90}px)`;
          }
          if (heroScanLines) heroScanLines.style.opacity = Math.max(0, 1 - p * 3);
          if (heroArt) heroArt.style.transform = `translateX(${p * -4}%)`;
        }
        sTick = false;
      });
    }
  }, { passive: true });
}

/* ── AMBIENT HERO SCAN SPARKS ── */
(function initScanSparks() {
  const container = document.querySelector('.hero-scan-lines');
  if (!container) return;
  
  setInterval(() => {
    if (window.scrollY > window.innerHeight * 2.5) return;
    
    const spark = document.createElement('div');
    spark.className = 'scan-spark';
    spark.style.left = (10 + Math.random() * 80) + '%';
    spark.style.top = (5 + Math.random() * 90) + '%';
    spark.style.zIndex = 22;
    container.appendChild(spark);
    
    setTimeout(() => spark.remove(), 700);
  }, 1500);
})();

/* ── FLOATING CODE TEXT PARTICLES ── */
(function initCodeParticles() {
  const snippets = [
    'const x = observe()',
    'fn ship()',
    '// heisenberg',
    'async build()',
    'await ship()',
    '.map(adapt)'
  ];
  const canvas = document.querySelector('.art-canvas');
  if (!canvas) return;
  
  snippets.forEach((text, i) => {
    const p = document.createElement('div');
    p.className = 'code-particle';
    p.textContent = text;
    p.style.left = (5 + Math.random() * 85) + '%';
    p.style.top = (10 + Math.random() * 80) + '%';
    p.style.animationDuration = (10 + Math.random() * 10) + 's';
    p.style.animationDelay = (i * 1.5) + 's';
    canvas.appendChild(p);
  });
})();

/* ── 3D IMMERSIVE PARTICLE NETWORK ── */
(function init3DScene() {
  const canvas = document.getElementById('scene3d');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let W, H, cx, cy, mouse = { x: 0, y: 0 }, time = 0, visible = false;
  
  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cx = W / 2;
    cy = H / 2;
  }
  resize();
  window.addEventListener('resize', resize);
  
  // Mouse parallax interaction
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / W - 0.5;
    mouse.y = (e.clientY - r.top) / H - 0.5;
  });
  
  // Icosahedron definition
  const phi = (1 + Math.sqrt(5)) / 2;
  const rawVerts = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
  ];
  const edges = [
    [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
    [1, 5], [1, 7], [1, 8], [1, 9],
    [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
    [3, 4], [3, 6], [3, 8], [3, 9],
    [4, 5], [4, 9], [4, 11],
    [5, 9], [5, 11],
    [6, 7], [6, 8], [6, 10],
    [7, 8], [7, 10],
    [8, 9],
    [10, 11]
  ];
  const scale = Math.min(W, H) * 0.18;
  
  // Dust particles
  const particles = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: (Math.random() - 0.5) * W * 1.4,
      y: (Math.random() - 0.5) * H * 1.4,
      z: Math.random() * 400 - 200,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      phase: Math.random() * Math.PI * 2
    });
  }
  
  // Orbiting digital rings
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const pts = [];
    const ringR = scale * (1.8 + i * 0.6);
    for (let j = 0; j < 60; j++) {
      const a = (j / 60) * Math.PI * 2;
      pts.push([Math.cos(a) * ringR, 0, Math.sin(a) * ringR]);
    }
    rings.push({
      pts,
      rotX: Math.random() * Math.PI,
      rotY: i * Math.PI / 3,
      speed: 0.15 + i * 0.08
    });
  }
  
  // Helper Math Rotations
  function rotateX(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
  }
  function rotateY(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c];
  }
  function rotateZ(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
  }
  function project(p) {
    const fov = 600;
    const z = p[2] + fov;
    return { x: cx + (p[0] * fov) / z, y: cy + (p[1] * fov) / z, s: fov / z };
  }
  
  // Intersection Observer for performance
  const targetSec = document.getElementById('immersive-3d');
  if (targetSec) {
    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) requestAnimationFrame(drawScene);
    }, { threshold: 0.05 });
    io.observe(targetSec);
  }
  
  function drawScene() {
    if (!visible) return;
    time += 0.008;
    ctx.clearRect(0, 0, W, H);
    
    // Background radial glow
    const radial = ctx.createRadialGradient(cx + mouse.x * 80, cy + mouse.y * 80, 0, cx, cy, Math.max(W, H) * 0.6);
    radial.addColorStop(0, 'rgba(0,71,255,0.06)');
    radial.addColorStop(0.5, 'rgba(0,40,180,0.02)');
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, W, H);
    
    // Draw space dust
    particles.forEach((p) => {
      p.y -= p.speed;
      if (p.y < -H * 0.7) p.y = H * 0.7;
      const px = cx + p.x + mouse.x * p.z * 0.15;
      const py = cy + p.y + mouse.y * p.z * 0.1;
      const alpha = 0.15 + 0.1 * Math.sin(time * 2 + p.phase);
      
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,71,255,${alpha})`;
      ctx.fill();
    });
    
    const rx = time * 0.4 + mouse.y * 0.6;
    const ry = time * 0.6 + mouse.x * 0.8;
    const rz = time * 0.2;
    
    // Transform raw vertices
    const projected = rawVerts.map((v) => {
      let p = [v[0] * scale, v[1] * scale, v[2] * scale];
      p = rotateX(p, rx);
      p = rotateY(p, ry);
      p = rotateZ(p, rz);
      return { ...project(p), z3d: p[2] };
    });
    
    // Draw connecting wire lines
    edges.forEach(([a, b]) => {
      const pa = projected[a], pb = projected[b];
      const avgZ = (pa.z3d + pb.z3d) / 2;
      const alpha = 0.08 + 0.2 * ((avgZ + scale * 2) / (scale * 4));
      
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.strokeStyle = `rgba(0,71,255,${Math.max(0.03, alpha)})`;
      ctx.lineWidth = 0.8 * ((pa.s + pb.s) / 2);
      ctx.stroke();
    });
    
    // Draw nodes
    projected.forEach((p) => {
      const alpha = 0.3 + 0.4 * ((p.z3d + scale * 2) / (scale * 4));
      const radius = 2.5 * p.s;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100,170,255,${Math.max(0.1, alpha)})`;
      ctx.fill();
      
      // Node ambient glow outer circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,71,255,${Math.max(0.02, alpha * 0.15)})`;
      ctx.fill();
    });
    
    // Draw rings
    rings.forEach((ring) => {
      ring.rotX += ring.speed * 0.008;
      ring.rotY += ring.speed * 0.012;
      ctx.beginPath();
      ring.pts.forEach((v, i) => {
        let p = rotateX(v, ring.rotX + rx * 0.3);
        p = rotateY(p, ring.rotY + ry * 0.3);
        const pr = project(p);
        if (i === 0) ctx.moveTo(pr.x, pr.y); else ctx.lineTo(pr.x, pr.y);
      });
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0,71,255,0.06)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
    
    // Pulse central core glow
    const pulseRadius = 12 + 4 * Math.sin(time * 3);
    const coreGlow = ctx.createRadialGradient(cx + mouse.x * 20, cy + mouse.y * 20, 0, cx + mouse.x * 20, cy + mouse.y * 20, pulseRadius * 4);
    coreGlow.addColorStop(0, 'rgba(0,71,255,0.25)');
    coreGlow.addColorStop(0.5, 'rgba(0,71,255,0.05)');
    coreGlow.addColorStop(1, 'transparent');
    
    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(cx + mouse.x * 20, cy + mouse.y * 20, pulseRadius * 4, 0, Math.PI * 2);
    ctx.fill();
    
    requestAnimationFrame(drawScene);
  }
})();

/* ── GENERAL INTERSECTION OBSERVER FOR REVEALS (.rev) ── */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.rev').forEach(el => revObs.observe(el));

/* ── NUMBER COUNTER MULTIPLE INCREMENTS ── */
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.target);
      if (target === 0) {
        el.textContent = '0';
        return;
      }
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, 40);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

/* ── INTERACTIVE TERMINAL TYPING ── */
const termObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const lines = e.target.querySelectorAll('.terminal-line');
      lines.forEach((line) => {
        const delay = parseInt(line.dataset.delay) || 0;
        setTimeout(() => line.classList.add('visible'), delay);
      });
      termObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
const terminal = document.getElementById('terminal');
if (terminal) termObs.observe(terminal);

/* ── TEXT SCRAMBLE / GLITCH EFFECT ── */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:var(--cobalt)">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// Scramble hovered text
document.querySelectorAll('.glitch-text').forEach((el) => {
  const fx = new TextScramble(el);
  const original = el.textContent;
  el.addEventListener('mouseenter', () => {
    fx.setText(original);
  });
});

/* ── MAGNETIC CONTACT BUTTON ── */
const magWrap = document.getElementById('mag-wrap');
const magBtn = document.getElementById('mag-btn');
if (magWrap && magBtn) {
  magWrap.addEventListener('mousemove', (e) => {
    const r = magWrap.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    magBtn.style.transform = `translate(${dx * 0.35}px, ${dy * 0.35}px)`;
  });
  magWrap.addEventListener('mouseleave', () => {
    magBtn.style.transform = 'translate(0,0)';
  });
}

/* ── 3D PERSPECTIVE TILT FOR CARDS ── */
document.querySelectorAll('.wcard, .team-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateX(${-cy * 8}deg) rotateY(${cx * 8}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── SMOOTH INNER SECTION LINK ANCHORS ── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
