// ═══════════════════════════════════════════════════════════════
// PAGE LOADING ANIMATION
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.page-loader');
  
  // Hide loader after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Trigger initial animations after loader
      initHeroAnimations();
    }, 1500);
  });
});

// ═══════════════════════════════════════════════════════════════
// HERO ANIMATIONS
// ═══════════════════════════════════════════════════════════════
function initHeroAnimations() {
  const heroElements = document.querySelectorAll('.hero-badge, .hero-name, .hero-tagline, .hero-desc, .hero-ctas, .hero-stats');
  
  heroElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.animation = `heroElementReveal 0.8s ${0.2 + index * 0.15}s ease forwards`;
  });
}

// Add dynamic keyframes for hero elements
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes heroElementReveal {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
`;
document.head.appendChild(styleSheet);

// ═══════════════════════════════════════════════════════════════
// SCROLL REVEAL ANIMATION
// ═══════════════════════════════════════════════════════════════
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Add subtle parallax effect
      applyParallax(entry.target);
    }
  });
}, { 
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// Parallax effect for revealed elements
function applyParallax(element) {
  let speed = 0.5;
  element.style.transform = `translateY(${speed * 10}px)`;
  setTimeout(() => {
    element.style.transform = 'translateY(0)';
  }, 800);
}

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════
const nav = document.querySelector('nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

// Nav scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  
  // Update active nav link based on scroll position
  updateActiveNavLink();
});

// Mobile menu toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Close mobile menu when clicking a link
navLinksItems.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Smooth scroll for nav links
navLinksItems.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
      const navHeight = nav.offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPosition = window.scrollY + 150;
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// CONTACT FORM
// ═══════════════════════════════════════════════════════════════
function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const msg = document.getElementById('form-msg');
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Add loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '⏳ Sending...';
  submitBtn.disabled = true;
  
  // Simulate form submission (replace with actual backend)
  setTimeout(() => {
    msg.style.display = 'block';
    msg.style.animation = 'fadeSlideUp 0.5s ease';
    form.reset();
    
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    // Hide message after 4 seconds
    setTimeout(() => {
      msg.style.display = 'none';
    }, 4000);
  }, 1500);
}

// Add input validation feedback
document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('focused');
  });
  
  input.addEventListener('blur', () => {
    input.parentElement.classList.remove('focused');
  });
});

// ═══════════════════════════════════════════════════════════════
// STATS COUNTER ANIMATION
// ═══════════════════════════════════════════════════════════════
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-num, .leadership-stat-num');
      
      statNumbers.forEach(stat => {
        const target = parseFloat(stat.textContent);
        const isDecimal = target % 1 !== 0;
        const suffix = stat.classList.contains('stat-label') ? '' : '';
        
        animateValue(stat, 0, target, 2000, isDecimal);
      });
      
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .leadership-card').forEach(el => {
  statsObserver.observe(el);
});

function animateValue(element, start, end, duration, isDecimal) {
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    
    const current = start + (end - start) * easeOut;
    
    if (isDecimal) {
      element.textContent = current.toFixed(2);
    } else {
      element.textContent = Math.floor(current);
    }
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// ═══════════════════════════════════════════════════════════════
// SKILL TAGS INTERACTION
// ═══════════════════════════════════════════════════════════════
document.querySelectorAll('.skill-tag, .tech-badge, .course-tag').forEach(tag => {
  tag.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.05)';
  });
  
  tag.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
  });
});

// ═══════════════════════════════════════════════════════════════
// PROJECT CARDS - ADDITIONAL EFFECTS
// ═══════════════════════════════════════════════════════════════
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    const projectNum = this.querySelector('.project-num');
    if (projectNum) {
      projectNum.style.color = 'rgba(0,212,255,0.2)';
    }
  });
  
  card.addEventListener('mouseleave', function() {
    const projectNum = this.querySelector('.project-num');
    if (projectNum) {
      projectNum.style.color = 'rgba(0,212,255,0.06)';
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// CONTACT LINKS - PHONE & EMAIL
// ═══════════════════════════════════════════════════════════════
// Add click-to-copy functionality for contact info
document.querySelectorAll('.contact-item').forEach(item => {
  item.addEventListener('click', function(e) {
    // Only trigger for email/phone items
    const href = this.getAttribute('href');
    if (href && (href.startsWith('mailto:') || href.startsWith('tel:'))) {
      // Visual feedback
      this.style.transform = 'translateX(8px)';
      setTimeout(() => {
        this.style.transform = '';
      }, 200);
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION
// ═══════════════════════════════════════════════════════════════
// Allow keyboard navigation through sections
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
  }
});

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE OPTIMIZATION
// ═══════════════════════════════════════════════════════════════
// Lazy load images (if any added later)
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        imageObserver.unobserve(img);
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// ACCESSIBILITY - REDUCE MOTION
// ═══════════════════════════════════════════════════════════════
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  // Disable animations for users who prefer reduced motion
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('visible');
  });
  
  // Remove loader delay
  const loader = document.querySelector('.page-loader');
  if (loader) {
    loader.classList.add('hidden');
  }
}

// ═══════════════════════════════════════════════════════════════
// EXPORT FOR GLOBAL USE
// ═══════════════════════════════════════════════════════════════
window.handleSubmit = handleSubmit;
