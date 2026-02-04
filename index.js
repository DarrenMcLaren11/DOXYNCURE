document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupSmoothScroll();
    setupIntersectionObserver();
    setupScrollAnimations();
    setupInteractiveElements();
});

function setupNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .step-item, .benefit-item').forEach(el => {
        observer.observe(el);
    });
}

function setupScrollAnimations() {
    const elements = document.querySelectorAll('.feature-card, .step-item, .benefit-item');

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));

    const statsElements = document.querySelectorAll('.stat-item');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target.querySelector('.stat-number');
                if (number && !number.classList.contains('animated')) {
                    animateNumber(number);
                    number.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.5 });

    statsElements.forEach(el => statsObserver.observe(el));
}

function animateNumber(element) {
    const finalValue = element.textContent;
    const numericValue = parseInt(finalValue.replace(/\D/g, ''));
    
    // SAFETY CHECK ADDED: If value is not a number (like "-"), stop animation
    if (isNaN(numericValue)) return;

    const suffix = finalValue.replace(/\d/g, '');
    const duration = 2000;
    const start = Date.now();

    function update() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(numericValue * progress);
        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = finalValue;
        }
    }

    update();
}

function setupInteractiveElements() {
    setupCardHoverEffects();
    setupButtonEffects();
    setupStepIndicators();
    setupParallaxEffect();
}

function setupCardHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .benefit-item');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

function setupButtonEffects() {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('mouseover', function() {
            createRipple(event, this);
        });
    });

    function createRipple(event, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        if (element.querySelector('.ripple')) {
            element.querySelector('.ripple').remove();
        }
    }
}

function setupStepIndicators() {
    const steps = document.querySelectorAll('.step-item');
    let currentStep = 0;

    setInterval(() => {
        steps.forEach((step, index) => {
            if (index === currentStep) {
                step.style.transform = 'scale(1.02)';
                step.style.boxShadow = '0 10px 40px rgba(37, 99, 235, 0.2)';
            } else {
                step.style.transform = 'scale(1)';
                step.style.boxShadow = 'none';
            }
        });

        currentStep = (currentStep + 1) % steps.length;
    }, 4000);
}

function setupParallaxEffect() {
    window.addEventListener('scroll', function() {
        const blobs = document.querySelectorAll('.gradient-blob');
        const scrollY = window.scrollY;

        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 0.5;
            blob.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

document.addEventListener('mousemove', function(e) {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    const blobs = document.querySelectorAll('.gradient-blob');
    blobs.forEach((blob, index) => {
        const offsetX = (x - 0.5) * 20 * (index + 1);
        const offsetY = (y - 0.5) * 20 * (index + 1);

        blob.style.transform = `translate(calc(var(--tx, 0px) + ${offsetX}px), calc(var(--ty, 0px) + ${offsetY}px))`;
    });
});

const stats = [
    { selector: '.stat-item:nth-child(1)', callback: () => animateStat(0) },
    { selector: '.stat-item:nth-child(2)', callback: () => animateStat(1) },
    { selector: '.stat-item:nth-child(3)', callback: () => animateStat(2) }
];

function animateStat(index) {
    const statElements = document.querySelectorAll('.stat-number');
    if (statElements[index]) {
        const element = statElements[index];
        if (!element.classList.contains('animated')) {
            animateNumber(element);
            element.classList.add('animated');
        }
    }
}

document.querySelectorAll('.feature-card, .benefit-item').forEach(card => {
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.position = 'absolute';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.background = 'radial-gradient(circle, rgba(6, 182, 212, 0.6), transparent)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'rippleAnimation 0.6s ease-out forwards';

        this.style.position = 'relative';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

const style = document.createElement('style');
style.textContent = `
    @keyframes rippleAnimation {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(1);
            opacity: 0;
        }
    }

    .stat-number {
        font-variant-numeric: tabular-nums;
    }
`;
document.head.appendChild(style);

window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    setupScrollAnimations();
});