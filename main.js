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

/* ── CUSTOM CURSOR ── */
const dot = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
if (dot && ring) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });
  
  (function updateCursor() {
    dot.style.transform = `translate(${mx}px,${my}px)`;
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(updateCursor);
  })();
  
  // Dynamic Hover delegation
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .wcard, .team-card, .skill-node, #chat-trigger, #mag-wrap')) {
      ring.classList.add('hovered');
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .wcard, .team-card, .skill-node, #chat-trigger, #mag-wrap')) {
      ring.classList.remove('hovered');
    }
  });
}

/* ── SCROLL EVENTS & STORYTELLING ── */
const heroPin = document.getElementById('hero-pin');
const heroFrame = document.getElementById('hero-frame');
const heroText = document.getElementById('hero-text');
const pageReveal = document.getElementById('page-reveal');
const heroArt = document.getElementById('hero-art');

let sTick = false;
window.addEventListener('scroll', () => {
  if (!sTick) {
    sTick = true;
    requestAnimationFrame(() => {
      const h = document.documentElement;
      window.scrollProgress = (h.scrollTop / (h.scrollHeight - h.clientHeight));
      
      // 1. Hero Reveal Scale & Shift
      if (heroPin && heroFrame) {
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
          if (heroArt) heroArt.style.transform = `translateX(${p * -4}%)`;
        }
      }
      
      // 2. Narrative Section Scroll Storytelling Slide Transitions
      const narrativeSection = document.getElementById('narrative-section');
      if (narrativeSection) {
        const rect = narrativeSection.getBoundingClientRect();
        const totalScroll = narrativeSection.offsetHeight - window.innerHeight;
        const scrolled = -rect.top;
        
        if (scrolled >= 0 && scrolled <= totalScroll) {
          const progress = scrolled / totalScroll; // 0 to 1
          
          const slides = [
            document.getElementById('n-slide-1'),
            document.getElementById('n-slide-2'),
            document.getElementById('n-slide-3')
          ];
          const dots = document.querySelectorAll('.indicator-dot');
          
          const centers = [0.16, 0.5, 0.84];
          slides.forEach((slide, index) => {
            if (slide) {
              const center = centers[index];
              const diff = progress - center;
              const opacity = Math.max(0, 1 - Math.abs(diff) * 5.5);
              const translateY = -diff * 150;
              
              slide.style.opacity = opacity;
              slide.style.transform = `translateY(${translateY}px)`;
            }
          });
          
          // Update active dot indicators
          let activeIndex = 0;
          if (progress > 0.33 && progress <= 0.66) {
            activeIndex = 1;
          } else if (progress > 0.66) {
            activeIndex = 2;
          }
          
          dots.forEach((dot, index) => {
            if (index === activeIndex) {
              dot.classList.add('active');
            } else {
              dot.classList.remove('active');
            }
          });
        }
      }
      
      // 3. Dynamic Section-based Theme Swapping
      const sections = [
        { id: 'hero-pin', theme: 'dark' },
        { id: 'intro', theme: 'light' },
        { id: 'narrative-section', theme: 'dark' },
        { id: 'team', theme: 'light' },
        { id: 'work', theme: 'light' },
        { id: 'skills', theme: 'dark' },
        { id: 'studio', theme: 'light' },
        { id: 'process', theme: 'dark' },
        { id: 'testimonials', theme: 'light' },
        { id: 'contact', theme: 'light' }
      ];
      
      const viewportCenter = window.scrollY + window.innerHeight * 0.5;
      let activeTheme = 'dark'; // fallback
      
      for (const secConfig of sections) {
        const el = document.getElementById(secConfig.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          const height = el.offsetHeight;
          if (viewportCenter >= top && viewportCenter <= top + height) {
            activeTheme = secConfig.theme;
            break;
          }
        }
      }
      
      if (activeTheme === 'dark') {
        document.body.classList.add('theme-dark');
      } else {
        document.body.classList.remove('theme-dark');
      }
      
      sTick = false;
    });
  }
}, { passive: true });

/* ── REVEAL OBSERVER (.rev) ── */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.rev').forEach(el => revObs.observe(el));

/* ── STATISTICS COUNT-UP ANIMATION ── */
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

/* ── MAGNETIC BUTTON ── */
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

/* ── LENIS / ANCHOR SCROLL INTERMEDIARY ── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = a.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      if (typeof lenis !== 'undefined') {
        lenis.scrollTo(target);
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

