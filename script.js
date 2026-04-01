/* ==========================================
   CV Website — Interactive JavaScript
   ========================================== */

// ---- Particle Background ----
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 92, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(124, 92, 255, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        animFrameId = requestAnimationFrame(animate);
    }
    animate();
})();

// ---- Navbar Scroll Effect ----
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveLink() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);

    // Close mobile nav on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
        });
    });
})();

// ---- Scroll Reveal ----
(function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.skill-category, .project-card, .timeline-item, .extras-card, .about-grid > *, .contact-card, .cta-card'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
})();

// ---- Skill Bar Animation ----
(function initSkillBars() {
    const bars = document.querySelectorAll('.skill-fill, .lang-fill');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
            }
        });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
})();

// ---- Counter Animation ----
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                let current = 0;
                const step = Math.max(1, Math.floor(target / 30));
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    entry.target.textContent = current;
                }, 40);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
})();

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- Contact Form (Web3Forms) ----
async function sendEmail(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('sender-email').value.trim();
    const message = document.getElementById('message').value.trim();
    const btn = document.getElementById('submit-btn');
    const form = document.getElementById('contact-form');

    if (!name || !email || !message) {
        showFormStatus('Please fill in all fields.', 'error');
        return;
    }

    // Show loading state
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span>Sending...</span><svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>';

    try {
        const formData = new FormData(form);
        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        });

        const result = await response.json();

        if (result.success) {
            // Show success state
            btn.innerHTML = '<span>✓ Message Sent!</span>';
            btn.style.background = 'linear-gradient(135deg, #4ade80, #22c55e)';
            btn.classList.add('btn-success');

            showFormStatus('Your message has been sent successfully! I\'ll get back to you soon.', 'success');

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
                btn.classList.remove('btn-success');
                form.reset();
            }, 4000);
        } else {
            throw new Error(result.message || 'Something went wrong');
        }
    } catch (error) {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        showFormStatus('Failed to send message. Please try again or email me directly at dahalgaurab100@gmail.com', 'error');
        console.error('Form submission error:', error);
    }
}

function showFormStatus(msg, type) {
    const statusDiv = document.getElementById('form-status');
    if (!statusDiv) return;
    statusDiv.textContent = msg;
    statusDiv.className = 'form-status ' + type;
    statusDiv.style.display = 'block';

    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 6000);
    } else {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}
