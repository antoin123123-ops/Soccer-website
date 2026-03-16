/* ========================================
   Coach Antoine Trifonov — Interactive JS
   ======================================== */

// ===== NAV: Scroll shadow =====
const nav = document.getElementById('nav');
function handleNavScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

// ===== NAV: Mobile toggle =====
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  // Animate hamburger to X
  const spans = navToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close nav on link click
navLinks.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== SCROLL: Fade-up animations =====
function initFadeAnimations() {
  const targets = document.querySelectorAll([
    '.about__content',
    '.about__image-col',
    '.program-card',
    '.result-step',
    '.results__stat-card',
    '.testimonial-card',
    '.programs__header',
    '.contact__info',
    '.contact__form-wrapper',
    '.section-title',
    '.hero__badge',
    '.hero__title',
    '.hero__subtitle',
    '.hero__actions',
    '.hero__stats',
  ].join(','));

  targets.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

// Stagger children of grids
function staggerCards() {
  const grids = ['.programs__grid', '.testimonials__grid', '.results__steps', '.about__credentials'];
  grids.forEach(selector => {
    const parent = document.querySelector(selector);
    if (!parent) return;
    parent.querySelectorAll('.fade-up').forEach((el, i) => {
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });
}

// ===== CONTACT FORM =====
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate async submit
    setTimeout(() => {
      btn.textContent = '✓ Application Sent!';
      btn.style.background = '#4caf50';
      btn.style.borderColor = '#4caf50';
      btn.style.color = '#fff';
      form.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 4000);
    }, 1200);
  });
}

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== COUNT UP Animation for stats =====
function countUp(el, target, suffix = '') {
  let start = 0;
  const duration = 1800;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.floor(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = [
    { selector: '.hero__stat-number', pattern: /^(\d+)(.*)$/ },
  ];

  const heroStats = document.querySelectorAll('.hero__stat-number');
  heroStats.forEach(el => {
    const match = el.textContent.match(/^(\d+)(.*)$/);
    if (!match) return;
    const target  = parseInt(match[1], 10);
    const suffix  = match[2];
    const stored  = el.textContent;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(el, target, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
  });

  // Results stat numbers
  const resultStats = document.querySelectorAll('.results__stat-number');
  resultStats.forEach(el => {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)(\S*)$/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2] || '';

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(el, target, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initFadeAnimations();
  staggerCards();
  initCounters();
});
