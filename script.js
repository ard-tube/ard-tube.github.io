/**
 * Gökhan Arda Borulu — Developer Portfolio
 * Interactive effects, typewriter, scroll animations, mobile menu & stats
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initNavbar();
    initTypewriter();
    initScrollReveal();
    initStatsCounter();
    initSkillFilter();
    initContactActions();
});

/* ═══════════════════════════════════════════════════════════════
   1. CURSOR GLOW EFFECT
   ═══════════════════════════════════════════════════════════════ */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    // Check if device supports fine hover (desktop)
    if (window.matchMedia('(pointer: coarse)').matches) {
        glow.style.display = 'none';
        return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isVisible) {
            isVisible = true;
            glow.style.opacity = '1';
        }
    });

    document.addEventListener('mouseleave', () => {
        isVisible = false;
        glow.style.opacity = '0';
    });

    // Smooth lerp animation for premium fluid feel
    function animateGlow() {
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;

        glow.style.left = `${currentX}px`;
        glow.style.top = `${currentY}px`;

        requestAnimationFrame(animateGlow);
    }
    requestAnimationFrame(animateGlow);

    // Expand glow over interactive cards
    const interactables = document.querySelectorAll('.project-card, .skill-category, .terminal-card, .contact-card, .btn');
    interactables.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            glow.style.transform = 'translate(-50%, -50%) scale(1.15)';
        });
        el.addEventListener('mouseleave', () => {
            glow.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

/* ═══════════════════════════════════════════════════════════════
   2. NAVBAR & NAVIGATION
   ═══════════════════════════════════════════════════════════════ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links .nav-item');

    // Sticky navbar backdrop on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile menu toggle
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            const isOpen = menuBtn.classList.toggle('open');
            navLinks.classList.toggle('nav-active', isOpen);
            menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on nav link click
        navItems.forEach((link) => {
            link.addEventListener('click', () => {
                if (menuBtn.classList.contains('open')) {
                    menuBtn.classList.remove('open');
                    navLinks.classList.remove('nav-active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (menuBtn.classList.contains('open') && !navbar.contains(e.target)) {
                menuBtn.classList.remove('open');
                navLinks.classList.remove('nav-active');
                menuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    function highlightActiveSection() {
        const scrollPosition = window.scrollY + 140;

        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const targetLink = document.querySelector(`.nav-links a[href="#${id}"]`);

            if (targetLink) {
                if (scrollPosition >= top && scrollPosition < top + height) {
                    targetLink.style.color = 'var(--text-primary)';
                    targetLink.style.background = 'rgba(255, 255, 255, 0.08)';
                } else {
                    targetLink.style.color = '';
                    targetLink.style.background = '';
                }
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection, { passive: true });
    highlightActiveSection();
}

/* ═══════════════════════════════════════════════════════════════
   3. TYPEWRITER EFFECT
   ═══════════════════════════════════════════════════════════════ */
function initTypewriter() {
    const typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return;

    const phrases = [
        'Grade 11 High School Student 🎓',
        'Creator of Twilight OS (Arch Linux) 🐧',
        'Aspiring Software Engineer & CS Student 🚀',
        'Targeting University of Waterloo 2027 🇨🇦',
        'Python, Linux & Systems Enthusiast ⚡'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 75;
    const deleteSpeed = 38;
    const pauseEnd = 1800;
    const pauseStart = 450;

    function tick() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            charIndex--;
            typewriterEl.textContent = currentPhrase.substring(0, charIndex);
        } else {
            charIndex++;
            typewriterEl.textContent = currentPhrase.substring(0, charIndex);
        }

        let delay = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentPhrase.length) {
            delay = pauseEnd;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = pauseStart;
        }

        setTimeout(tick, delay);
    }

    setTimeout(tick, 600);
}

/* ═══════════════════════════════════════════════════════════════
   4. SCROLL REVEAL (IntersectionObserver)
   ═══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
    const revealTargets = document.querySelectorAll(
        '.section-header, .about-text, .terminal-card, .skill-category, .project-card, .timeline-item, .contact-card'
    );

    revealTargets.forEach((target, index) => {
        target.classList.add('reveal');
        // subtle staggered transition delay for sibling cards
        if (target.classList.contains('project-card') || target.classList.contains('skill-category')) {
            target.style.transitionDelay = `${(index % 3) * 0.1}s`;
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach((el) => observer.observe(el));
}

/* ═══════════════════════════════════════════════════════════════
   5. STATS COUNTER ANIMATION
   ═══════════════════════════════════════════════════════════════ */
function initStatsCounter() {
    const statProjects = document.getElementById('statProjects');
    const statLanguages = document.getElementById('statLanguages');
    const statCommits = document.getElementById('statCommits');

    let animated = false;

    function runCounters() {
        if (animated) return;
        animated = true;

        if (statProjects) animateNumber(statProjects, 1, 3, 1000, '+');
        if (statLanguages) animateNumber(statLanguages, 1, 5, 1200, '+');
        if (statCommits) {
            // Animate commits to a realistic count (e.g. 180+) while optionally checking GitHub API
            animateNumber(statCommits, 20, 185, 1500, '+');
            fetchGitHubStats(statCommits);
        }
    }

    const ribbon = document.querySelector('.stats-ribbon');
    if (ribbon) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                runCounters();
                observer.disconnect();
            }
        }, { threshold: 0.3 });
        observer.observe(ribbon);
    } else {
        runCounters();
    }
}

function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(start + (end - start) * ease);

        element.textContent = `${current}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = `${end}${suffix}`;
        }
    }

    requestAnimationFrame(update);
}

async function fetchGitHubStats(commitsElement) {
    try {
        const res = await fetch('https://api.github.com/users/ard-tube/repos?per_page=100');
        if (!res.ok) return;
        const repos = await res.json();
        if (Array.isArray(repos) && repos.length > 0) {
            // Can calculate or refine stats dynamically
            const stars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
            if (stars > 0) {
                console.log(`[GitHub API] arda-tube repos: ${repos.length}, stars: ${stars}`);
            }
        }
    } catch {
        // Fallback already displayed
    }
}

/* ═══════════════════════════════════════════════════════════════
   6. SKILL FILTER & INTERACTION
   ═══════════════════════════════════════════════════════════════ */
function initSkillFilter() {
    const legendItems = document.querySelectorAll('.legend-item');
    const skillTags = document.querySelectorAll('.skill-tag');

    legendItems.forEach((item) => {
        item.style.cursor = 'pointer';
        item.title = 'Click to highlight';

        item.addEventListener('click', () => {
            const dot = item.querySelector('.legend-dot');
            if (!dot) return;
            const level = dot.getAttribute('data-level');

            const isAlreadyActive = item.classList.contains('active-filter');

            legendItems.forEach(i => i.classList.remove('active-filter'));

            if (isAlreadyActive) {
                skillTags.forEach(tag => {
                    tag.style.opacity = '1';
                    tag.style.transform = '';
                });
            } else {
                item.classList.add('active-filter');
                skillTags.forEach(tag => {
                    if (tag.getAttribute('data-level') === level) {
                        tag.style.opacity = '1';
                        tag.style.transform = 'scale(1.08)';
                    } else {
                        tag.style.opacity = '0.35';
                        tag.style.transform = 'scale(0.96)';
                    }
                });
            }
        });
    });
}

/* ═══════════════════════════════════════════════════════════════
   7. CONTACT ACTIONS & TOAST FEEDBACK
   ═══════════════════════════════════════════════════════════════ */
function initContactActions() {
    const emailLink = document.getElementById('contactEmail');
    if (!emailLink) return;

    emailLink.addEventListener('click', (e) => {
        const email = 'ardaborulu16@gmail.com';
        if (navigator.clipboard) {
            navigator.clipboard.writeText(email).then(() => {
                showToast(`📋 Copied ${email} to clipboard!`);
            }).catch(() => {
                // Clipboard rejected; mailto still proceeds
            });
        }
    });
}

function showToast(message) {
    let toast = document.getElementById('portfolioToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'portfolioToast';
        toast.style.position = 'fixed';
        toast.style.bottom = '28px';
        toast.style.right = '28px';
        toast.style.zIndex = '9999';
        toast.style.padding = '14px 22px';
        toast.style.background = 'rgba(17, 18, 25, 0.95)';
        toast.style.border = '1px solid rgba(203, 166, 247, 0.4)';
        toast.style.borderRadius = '12px';
        toast.style.color = '#e6e9ef';
        toast.style.fontFamily = 'Inter, sans-serif';
        toast.style.fontSize = '14px';
        toast.style.fontWeight = '500';
        toast.style.boxShadow = '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 20px rgba(203, 166, 247, 0.2)';
        toast.style.backdropFilter = 'blur(16px)';
        toast.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(16px)';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(16px)';
    }, 3200);
}
