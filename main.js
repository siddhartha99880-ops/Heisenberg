/* ============================================
   ANTI-GRAVITY CREATIVE UNIVERSE
   Main Application Script
   ============================================ */

// -----------------------------------------------
// PROJECT DATA
// -----------------------------------------------
const PROJECT_DATA = {
    nebula: {
        category: 'Video + Branding',
        title: 'Nebula Brand Campaign',
        desc: 'A complete rebrand and cinematic video campaign for a cutting-edge tech startup. We crafted a visual identity that disrupted the market and delivered a series of cinematic videos that drove a 340% increase in brand recognition.',
        highlights: [
            'Full brand identity redesign from ground up',
            '6-part cinematic video series for social and broadcast',
            'Custom motion graphics and visual effects',
            'Photography direction and art supervision'
        ],
        tech: ['Premiere Pro', 'After Effects', 'Cinema 4D', 'Photoshop', 'Illustrator'],
        results: [
            { number: '340%', label: 'Brand Awareness' },
            { number: '2.1M', label: 'Video Views' },
            { number: '45%', label: 'Lead Growth' }
        ]
    },
    quantum: {
        category: 'Web Application',
        title: 'Quantum Dashboard',
        desc: 'A real-time analytics platform featuring immersive 3D data visualization and AI-powered predictive insights. Built for enterprise clients managing complex datasets across multiple business verticals.',
        highlights: [
            'Real-time WebSocket data streaming',
            'Interactive 3D data visualizations with Three.js',
            'AI-powered anomaly detection and forecasting',
            'Role-based access control and team collaboration'
        ],
        tech: ['React', 'Node.js', 'Three.js', 'PostgreSQL', 'TensorFlow.js', 'D3.js'],
        results: [
            { number: '99.9%', label: 'Uptime' },
            { number: '50K+', label: 'Daily Users' },
            { number: '3.2s', label: 'Avg Load Time' }
        ]
    },
    stellar: {
        category: 'Cinematic Film',
        title: 'Stellar Motion Reel',
        desc: 'A breathtaking cinematic brand film for a luxury fashion house, weaving haute couture with digital artistry to create a visual experience that transcended traditional fashion advertising.',
        highlights: [
            '4K cinematic production with anamorphic lenses',
            'Custom color grading and film emulation',
            'Synchronized motion graphics and typography',
            'Multi-platform delivery (cinema, broadcast, digital)'
        ],
        tech: ['DaVinci Resolve', 'After Effects', 'Premiere Pro', 'Cinema 4D', 'Nuke'],
        results: [
            { number: '12M', label: 'Impressions' },
            { number: 'Gold', label: 'Clio Award' },
            { number: '28%', label: 'Sales Increase' }
        ]
    },
    cosmic: {
        category: 'Brand Identity',
        title: 'Cosmic Identity System',
        desc: 'A comprehensive brand identity system for a fintech company disrupting traditional banking. From logo conception to a 200-page brand guidelines document, every detail was meticulously crafted.',
        highlights: [
            'Strategic brand positioning and messaging framework',
            'Logo design with dynamic, responsive variations',
            '200-page comprehensive brand guidelines',
            'Complete collateral design (print and digital)'
        ],
        tech: ['Illustrator', 'Photoshop', 'Figma', 'InDesign', 'After Effects'],
        results: [
            { number: '200+', label: 'Brand Assets' },
            { number: '95%', label: 'Client Satisfaction' },
            { number: '$4.2M', label: 'Funding Raised' }
        ]
    },
    aurora: {
        category: 'E-Commerce Platform',
        title: 'Aurora Platform',
        desc: 'A full-stack e-commerce platform with groundbreaking AR product previews and a frictionless checkout experience. Designed and built from scratch to serve 100K+ monthly active users.',
        highlights: [
            'AR-powered product visualization (try before you buy)',
            'One-click checkout with multiple payment gateways',
            'AI-based product recommendations engine',
            'Real-time inventory management dashboard'
        ],
        tech: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'AR.js', 'Redis'],
        results: [
            { number: '100K+', label: 'Monthly Users' },
            { number: '4.8★', label: 'App Store Rating' },
            { number: '67%', label: 'Conv. Rate Up' }
        ]
    },
    photon: {
        category: 'Interactive Experience',
        title: 'Photon XR Experience',
        desc: 'An award-winning interactive WebGL experience for a gaming brand that captivated millions worldwide. Users explore a procedurally generated universe with real-time particle interactions.',
        highlights: [
            'Procedurally generated 3D environments',
            'Real-time particle physics and interactions',
            'Spatial audio and haptic feedback integration',
            'Cross-platform WebXR compatibility'
        ],
        tech: ['Three.js', 'WebGL', 'GLSL Shaders', 'Web Audio API', 'WebXR', 'GSAP'],
        results: [
            { number: '5M+', label: 'Interactions' },
            { number: 'FWA', label: 'Site of the Day' },
            { number: '8min', label: 'Avg Session' }
        ]
    }
};

// -----------------------------------------------
// THREE.JS STARFIELD
// -----------------------------------------------
class StarfieldScene {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.mouse = { x: 0, y: 0 };
        this.scrollY = 0;
        this.isRunning = true;

        this.init();
        this.createStarfield();
        this.createNebula();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.z = 500;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x050510, 1);
        this.container.appendChild(this.renderer.domElement);
    }

    createStarfield() {
        const count = 6000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const colorChoices = [
            new THREE.Color(0xffffff),
            new THREE.Color(0x8B5CF6),
            new THREE.Color(0x3B82F6),
            new THREE.Color(0x06B6D4),
            new THREE.Color(0xEC4899),
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i3 + 2] = (Math.random() - 0.5) * 2000;

            const color = colorChoices[Math.random() < 0.7 ? 0 : Math.floor(Math.random() * colorChoices.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);
    }

    createNebula() {
        const count = 300;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const nebulaColors = [
            new THREE.Color(0x8B5CF6),
            new THREE.Color(0x3B82F6),
            new THREE.Color(0x06B6D4),
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 800;
            positions[i3 + 1] = (Math.random() - 0.5) * 800;
            positions[i3 + 2] = (Math.random() - 0.5) * 600;

            const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 30,
            vertexColors: true,
            transparent: true,
            opacity: 0.04,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.nebula = new THREE.Points(geometry, material);
        this.scene.add(this.nebula);
    }

    bindEvents() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            this.mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        });

        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        if (!this.isRunning) return;
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.0001;

        // Gentle rotation
        this.stars.rotation.y = time * 0.5;
        this.stars.rotation.x = time * 0.2;

        if (this.nebula) {
            this.nebula.rotation.y = -time * 0.3;
            this.nebula.rotation.x = time * 0.15;
        }

        // Mouse parallax
        this.camera.position.x += (this.mouse.x * 30 - this.camera.position.x) * 0.02;
        this.camera.position.y += (-this.mouse.y * 30 - this.camera.position.y) * 0.02;

        // Scroll-linked depth
        this.camera.position.z = 500 - this.scrollY * 0.05;

        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        this.isRunning = false;
    }
}

// -----------------------------------------------
// INTRO ANIMATION
// -----------------------------------------------
class IntroAnimation {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.overlay = document.getElementById('intro-overlay');
        this.enterBtn = document.getElementById('enter-btn');
        this.tl = gsap.timeline();
        this.init();
    }

    init() {
        if (typeof gsap === 'undefined') {
            console.error('GSAP not loaded. Intro animations skipped.');
            this.overlay.style.display = 'none';
            if (this.onComplete) this.onComplete();
            return;
        }
        // Build intro timeline
        this.tl
            .to('.intro-line-1', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                delay: 0.5
            })
            .to('.intro-line-2', {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
            }, '-=0.6')
            .to('.intro-planet', {
                opacity: 1,
                scale: 1,
                duration: 1.5,
                ease: 'elastic.out(1, 0.5)',
            }, '-=0.4')
            .to('.intro-enter', {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
            }, '-=0.6');

        // Enter button
        this.enterBtn.addEventListener('click', () => this.enter());
    }

    enter() {
        const tl = gsap.timeline({
            onComplete: () => {
                this.overlay.style.display = 'none';
                if (this.onComplete) this.onComplete();
            }
        });

        tl
            .to('.intro-enter', { opacity: 0, y: -20, duration: 0.3 })
            .to('.intro-planet', { scale: 20, opacity: 0, duration: 1.2, ease: 'power4.in' }, '-=0.1')
            .to('.intro-line-1, .intro-line-2', { opacity: 0, y: -30, duration: 0.4, stagger: 0.1 }, '-=1')
            .to('#intro-overlay', { opacity: 0, duration: 0.5 }, '-=0.3');
    }
}

// -----------------------------------------------
// SCROLL ANIMATIONS (GSAP ScrollTrigger)
// -----------------------------------------------
class ScrollAnimations {
    constructor() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error('GSAP or ScrollTrigger not loaded. Animations skipped.');
            return;
        }
        gsap.registerPlugin(ScrollTrigger);
        this.initNav();
        this.initHero();
        this.initTeam();
        this.initProjects();
        this.initSkills();
        this.initTestimonials();
        this.initContact();
    }

    initNav() {
        const nav = document.getElementById('main-nav');

        // Show nav
        gsap.to(nav, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            onStart: () => nav.classList.add('visible'),
        });

        // Scrolled state
        ScrollTrigger.create({
            start: 'top -80px',
            onUpdate: (self) => {
                nav.classList.toggle('scrolled', self.progress > 0);
            }
        });

        // Active link tracking
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');

        sections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top center',
                end: 'bottom center',
                onEnter: () => this.setActiveLink(section.id, navLinks),
                onEnterBack: () => this.setActiveLink(section.id, navLinks),
            });
        });
    }

    setActiveLink(sectionId, links) {
        links.forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionId);
        });
    }

    initHero() {
        const tl = gsap.timeline({ delay: 0.3 });

        tl
            .from('.hero-badge', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' })
            .from('.title-line', { opacity: 0, y: 50, duration: 0.9, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
            .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.5')
            .from('.achievement', { opacity: 0, y: 20, scale: 0.9, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.4')
            .from('.stat-card', { opacity: 0, y: 40, scale: 0.8, duration: 0.7, stagger: 0.15, ease: 'back.out(1.7)' }, '-=0.3')
            .from('.hero-cta-group', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.3')
            .from('.hero-scroll-indicator', { opacity: 0, y: 20, duration: 0.6 }, '-=0.2');
    }

    initTeam() {
        gsap.from('#team .section-header', {
            scrollTrigger: {
                trigger: '#team',
                start: 'top 75%',
            },
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out',
        });

        const teamCards = document.querySelectorAll('.team-card');
        if (teamCards.length === 0) return;

        gsap.from(teamCards, {
            scrollTrigger: {
                trigger: '.team-grid',
                start: 'top 80%',
            },
            opacity: 0,
            y: 60,
            scale: 0.9,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
        });

        // Fallback: Ensure visibility after a short delay
        setTimeout(() => {
            teamCards.forEach(card => {
                card.classList.add('visible-fallback');
                card.style.opacity = '1';
                card.style.visibility = 'visible';
                card.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
            });
        }, 1500);
    }

    initProjects() {
        gsap.from('#projects .section-header', {
            scrollTrigger: {
                trigger: '#projects',
                start: 'top 75%',
            },
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out',
        });

        gsap.from('.planet-card', {
            scrollTrigger: {
                trigger: '.galaxy-grid',
                start: 'top 80%',
            },
            opacity: 0,
            y: 80,
            scale: 0.85,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power3.out',
        });
    }

    initSkills() {
        gsap.from('#skills .section-header', {
            scrollTrigger: {
                trigger: '#skills',
                start: 'top 75%',
            },
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out',
        });

        gsap.from('.skill-node', {
            scrollTrigger: {
                trigger: '.skills-matrix',
                start: 'top 80%',
                onEnter: () => this.animateSkillLevels(),
            },
            opacity: 0,
            scale: 0.5,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)',
        });
    }

    animateSkillLevels() {
        document.querySelectorAll('.node-level').forEach(bar => {
            const level = bar.dataset.level;
            bar.style.setProperty('--level', level);
        });
    }

    initTestimonials() {
        gsap.from('#testimonials .section-header', {
            scrollTrigger: {
                trigger: '#testimonials',
                start: 'top 75%',
            },
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out',
        });

        gsap.from('.testimonial-card', {
            scrollTrigger: {
                trigger: '.testimonials-grid',
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
        });
    }

    initContact() {
        gsap.from('.portal-visual', {
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 75%',
            },
            opacity: 0,
            scale: 0.5,
            rotation: -45,
            duration: 1.2,
            ease: 'elastic.out(1, 0.5)',
        });

        gsap.from('.contact-content', {
            scrollTrigger: {
                trigger: '#contact',
                start: 'top 75%',
            },
            opacity: 0,
            x: 60,
            duration: 1,
            ease: 'power3.out',
        });
    }
}

// -----------------------------------------------
// SKILL CONNECTIONS (Canvas)
// -----------------------------------------------
class SkillConnections {
    constructor() {
        this.canvas = document.getElementById('skills-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [
            [0, 1], [0, 3], [1, 2], [1, 4],
            [2, 5], [3, 4], [4, 5], [0, 4],
            [1, 5], [2, 4], [3, 5]
        ];
        this.animationId = null;
        this.resize();
        this.bindEvents();
        this.animate();
    }

    resize() {
        if (!this.canvas || !this.canvas.parentElement) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.updateNodePositions();
    }

    updateNodePositions() {
        const nodeEls = document.querySelectorAll('.skill-node');
        this.nodes = Array.from(nodeEls).map(el => {
            const rect = el.getBoundingClientRect();
            const parentRect = this.canvas.parentElement.getBoundingClientRect();
            return {
                x: rect.left - parentRect.left + rect.width / 2,
                y: rect.top - parentRect.top + rect.height / 2,
            };
        });
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
    }

    animate() {
        if (!this.ctx) return;
        this.animationId = requestAnimationFrame(() => this.animate());

        this.updateNodePositions();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const time = Date.now() * 0.001;

        this.connections.forEach(([a, b], i) => {
            if (!this.nodes[a] || !this.nodes[b]) return;

            const nodeA = this.nodes[a];
            const nodeB = this.nodes[b];

            // Animated gradient - Increased alpha for thick, visible connections
            const gradient = this.ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
            const alpha = 0.6 + Math.sin(time + i * 0.5) * 0.3; // Much thicker baseline alpha
            gradient.addColorStop(0, `rgba(139, 92, 246, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(6, 182, 212, ${alpha})`);
            gradient.addColorStop(1, `rgba(139, 92, 246, ${alpha})`);

            this.ctx.beginPath();
            this.ctx.moveTo(nodeA.x, nodeA.y);
            this.ctx.lineTo(nodeB.x, nodeB.y);
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 3.5; // Bumped from 1.5 to 3.5
            this.ctx.shadowColor = `rgba(139, 92, 246, ${alpha})`;
            this.ctx.shadowBlur = 10;
            this.ctx.stroke();
            this.ctx.shadowBlur = 0; // reset for particles

            // Energy pulse particle
            const pulsePos = (Math.sin(time * 0.8 + i * 1.2) + 1) / 2;
            const px = nodeA.x + (nodeB.x - nodeA.x) * pulsePos;
            const py = nodeA.y + (nodeB.y - nodeA.y) * pulsePos;

            this.ctx.beginPath();
            this.ctx.arc(px, py, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(6, 182, 212, ${0.5 + Math.sin(time * 2 + i) * 0.3})`;
            this.ctx.fill();
        });
    }
}

// -----------------------------------------------
// PROJECT MODAL
// -----------------------------------------------
class ProjectModal {
    constructor() {
        this.modal = document.getElementById('project-modal');
        this.closeBtn = document.getElementById('modal-close');
        this.backdrop = this.modal.querySelector('.modal-backdrop');
        this.init();
    }

    init() {
        // Open modal on planet click
        document.querySelectorAll('.planet-card').forEach(card => {
            card.addEventListener('click', () => {
                const projectKey = card.dataset.project;
                const data = PROJECT_DATA[projectKey];
                if (data) this.open(data);
            });
        });

        // Close modal
        this.closeBtn.addEventListener('click', () => this.close());
        this.backdrop.addEventListener('click', () => this.close());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    }

    open(data) {
        // Populate
        this.modal.querySelector('.modal-category').textContent = data.category;
        this.modal.querySelector('.modal-title').textContent = data.title;
        this.modal.querySelector('.modal-desc').textContent = data.desc;

        // Highlights
        const highlightsList = this.modal.querySelector('.modal-highlights');
        highlightsList.innerHTML = data.highlights.map(h => `<li>${h}</li>`).join('');

        // Tech
        const techDiv = this.modal.querySelector('.modal-tech');
        techDiv.innerHTML = data.tech.map(t => `<span>${t}</span>`).join('');

        // Results
        const resultsDiv = this.modal.querySelector('.modal-results');
        resultsDiv.innerHTML = data.results.map(r =>
            `<div class="result-item">
                <div class="result-number">${r.number}</div>
                <div class="result-label">${r.label}</div>
            </div>`
        ).join('');

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// -----------------------------------------------
// CONTACT FORM
// -----------------------------------------------
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        if (!this.form) return;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submit();
        });
    }

    submit() {
        const btn = this.form.querySelector('.btn-submit');
        const originalText = btn.querySelector('span').textContent;

        // Success animation
        btn.querySelector('span').textContent = 'Transmission Sent! ✓';
        btn.style.background = 'linear-gradient(135deg, #10B981, #06B6D4)';

        gsap.from(btn, {
            scale: 0.95,
            duration: 0.3,
            ease: 'back.out(1.7)',
        });

        setTimeout(() => {
            this.form.reset();
            btn.querySelector('span').textContent = originalText;
            btn.style.background = '';
        }, 3000);
    }
}

// -----------------------------------------------
// NAVIGATION
// -----------------------------------------------
class Navigation {
    constructor() {
        this.toggle = document.getElementById('mobile-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        // Mobile toggle
        if (this.toggle) {
            this.toggle.addEventListener('click', () => {
                this.navLinks.classList.toggle('open');
                this.toggle.classList.toggle('active');
            });
        }

        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    // Refresh ScrollTrigger after scroll completes
                    setTimeout(() => {
                        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
                    }, 800);
                    // Close mobile menu
                    this.navLinks.classList.remove('open');
                    this.toggle?.classList.remove('active');
                }
            });
        });
    }
}

// -----------------------------------------------
// HOVER PARTICLE EFFECTS
// -----------------------------------------------
class HoverEffects {
    constructor() {
        this.init();
    }

    init() {
        // Add hover particle burst to team cards
        document.querySelectorAll('.team-card, .planet-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createParticleBurst(e, card);
            });
        });

        // Tilt effect on cards
        document.querySelectorAll('.stat-card, .team-card .card-hologram, .planet-card').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    createParticleBurst(e, parent) {
        if (typeof gsap === 'undefined') return;
        const rect = parent.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: ${['#8B5CF6', '#3B82F6', '#06B6D4', '#EC4899'][Math.floor(Math.random() * 4)]};
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 10;
            `;
            parent.style.position = 'relative';
            parent.appendChild(particle);

            gsap.to(particle, {
                x: (Math.random() - 0.5) * 80,
                y: (Math.random() - 0.5) * 80,
                opacity: 0,
                scale: 0,
                duration: 0.6 + Math.random() * 0.4,
                ease: 'power2.out',
                onComplete: () => particle.remove(),
            });
        }
    }
}

// -----------------------------------------------
// RATE US & REVIEWS WIDGET 
// -----------------------------------------------
class RateUsInteractivity {
    constructor() {
        this.stars = document.querySelectorAll('.star-btn');
        this.thanksMsg = document.getElementById('rate-thanks');
        this.inputArea = document.querySelector('.review-input-area');
        this.reviewText = document.getElementById('review-text');
        this.submitBtn = document.getElementById('submit-review-btn');
        this.reviewsContainer = document.getElementById('user-reviews-container');
        
        this.currentRating = 0;
        this.hasRated = false;
        
        if (this.stars.length === 0) return;
        this.seedInitialReviews();
        this.init();
        this.renderSavedReviews();
    }

    seedInitialReviews() {
        const existingReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
        if (existingReviews.length === 0) {
            const seedData = [
                {
                    id: Date.now() - 100000,
                    rating: 5,
                    text: "Absolutely phenomenal work! The team understood our vision instantly and delivered beyond our wildest expectations. The motion graphics alone were worth it.",
                    date: new Date(Date.now() - 86400000 * 2).toLocaleDateString() // 2 days ago
                },
                {
                    id: Date.now() - 200000,
                    rating: 4,
                    text: "Great communication and excellent technical skills. The React application they built for us is lightning fast.",
                    date: new Date(Date.now() - 86400000 * 5).toLocaleDateString() // 5 days ago
                }
            ];
            localStorage.setItem('user_reviews', JSON.stringify(seedData));
        }
    }

    init() {
        this.stars.forEach((star, index) => {
            // Hover effects
            star.addEventListener('mouseover', () => {
                if (this.hasRated) return;
                this.highlightStars(index);
            });

            star.addEventListener('mouseout', () => {
                if (this.hasRated) return;
                this.resetStars();
            });

            // Click to set rating and open textarea
            star.addEventListener('click', () => {
                if (this.hasRated) return;
                this.currentRating = index + 1;
                
                // Set final active state for stars
                this.stars.forEach((s, i) => {
                    s.classList.remove('hover-active');
                    if (i < this.currentRating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });

                // Show the input area text field
                if (this.inputArea) {
                    this.inputArea.classList.add('visible');
                }
            });
        });

        // Submit review button
        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', () => this.submitReview());
        }
    }

    highlightStars(index) {
        this.stars.forEach((star, i) => {
            if (i <= index) {
                star.classList.add('hover-active');
            } else {
                star.classList.remove('hover-active');
            }
        });
    }

    resetStars() {
        this.stars.forEach(star => {
            star.classList.remove('hover-active');
        });
    }

    submitReview() {
        const text = this.reviewText ? this.reviewText.value.trim() : '';
        if (this.currentRating === 0) return; // shouldn't happen, but safe check

        // Create review object
        const newReview = {
            id: Date.now(),
            rating: this.currentRating,
            text: text,
            date: new Date().toLocaleDateString()
        };

        // Save to LocalStorage
        const existingReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
        existingReviews.push(newReview);
        localStorage.setItem('user_reviews', JSON.stringify(existingReviews));

        // Lock form
        this.hasRated = true;
        if (this.inputArea) {
            this.inputArea.style.display = 'none';
        }

        // Show thanks message
        if (this.thanksMsg) {
            this.thanksMsg.textContent = `Thank you for leaving a ${this.currentRating}-star review!`;
            this.thanksMsg.style.display = 'block';
            void this.thanksMsg.offsetWidth;
            this.thanksMsg.style.opacity = '1';
        }

        // Render the new review immediately
        this.renderSavedReviews();
    }

    renderSavedReviews() {
        if (!this.reviewsContainer) return;
        
        const savedReviews = JSON.parse(localStorage.getItem('user_reviews') || '[]');
        this.reviewsContainer.innerHTML = ''; // Clear container

        if (savedReviews.length === 0) {
            this.reviewsContainer.style.display = 'none';
            return;
        }

        this.reviewsContainer.style.display = 'grid'; // Follows testimonials-grid rules

        savedReviews.forEach(review => {
            // Generate star string
            let starsHTML = '';
            for (let i = 0; i < 5; i++) {
                if (i < review.rating) {
                    starsHTML += '<span style="color: #FFD700">★</span>';
                } else {
                    starsHTML += '<span style="color: #777">★</span>';
                }
            }

            // Create card HTML
            const card = document.createElement('div');
            card.className = 'testimonial-card user-testimonial-card';
            
            // Random hue for avatar
            const randomHue = Math.floor(Math.random() * 360);

            card.innerHTML = `
                <div class="testimonial-glow"></div>
                ${review.text ? '<div class="testimonial-quote">"</div><p class="testimonial-text">' + this.escapeHTML(review.text) + '</p>' : '<p class="testimonial-text" style="font-style: italic; color: var(--text-dim);">(Left a star rating without written feedback)</p>'}
                <div class="testimonial-author">
                    <div class="author-avatar" style="--hue: ${randomHue};"><span>USR</span></div>
                    <div>
                        <strong>Verified User</strong>
                        <span>${review.date}</span>
                    </div>
                </div>
                <div class="testimonial-stars">${starsHTML}</div>
            `;
            
            this.reviewsContainer.appendChild(card);
            
            // Initialize GSAP animation for the new card if possible
            if (typeof gsap !== 'undefined') {
                 gsap.from(card, {
                    opacity: 0,
                    y: 20,
                    scale: 0.95,
                    duration: 0.5,
                    ease: 'power2.out'
                 });
            }
        });
    }

    // Helper to prevent XSS in textarea submissions
    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
}

// -----------------------------------------------
// INITIALIZE EVERYTHING
// -----------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Start Three.js starfield
    const starfield = new StarfieldScene();

    // Cinematic intro
    const intro = new IntroAnimation(() => {
        // After intro completes, start main page animations
        new ScrollAnimations();
        new SkillConnections();
        new HoverEffects();
    });

    // These work independently of the intro
    new ProjectModal();
    new ContactForm();
    new Navigation();
    new RateUsInteractivity();

    // Fallback: ensure all animated elements become visible after 3s
    // This handles edge cases where GSAP scroll triggers don't fire
    setTimeout(() => {
        document.querySelectorAll('.planet-card, .testimonial-card, .skill-node, .section-header').forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
            el.style.transform = 'none';
        });
    }, 3000);
});
