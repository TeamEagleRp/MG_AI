// =============================================
// MG AI - Main JavaScript
// Copyright: MG CoDe
// Version: 444
// =============================================

// Mobile Menu Toggle
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Close mobile menu on link click
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const menu = document.querySelector('.nav-links');
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        });
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.9)';
    }
});

// Add bot button tracking
document.querySelectorAll('[href*="add-bot"]').forEach(btn => {
    btn.addEventListener('click', function() {
        console.log(`[MG AI] Add bot clicked for guild: ${this.dataset.guildId || 'unknown'}`);
    });
});

// Discord login redirect
document.querySelectorAll('.btn-discord').forEach(btn => {
    btn.addEventListener('click', function(e) {
        console.log('[MG AI] Discord login initiated');
    });
});

// Feature cards animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.feature-card, .command-category, .guild-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Console branding
console.log('%c MG AI ', 'background: #444; color: white; font-size: 20px; font-weight: bold; padding: 10px; border-radius: 5px;');
console.log('%c Developed by MG CoDe | 444 ', 'color: #888; font-size: 14px;');

