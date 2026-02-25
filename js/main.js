// ============================================
// HIGH RIDGE ADVISORY - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Check for reduced motion preference
  initReducedMotion();

  // Initialize all components
  initNavigation();
  initNavbarScroll();
  initClientPortalDropdown();
  initScrollAnimations();
  initTeamAccordions();
  initSmoothScroll();
  initTypewriter();
  initClickableAddress();
  initFormLoadingStates();
  initExitIntentPopup();
  initBookingUrgencyMonth();
  initPortalRedirect();
});

// ----------------------------------------
// Reduced Motion Support
// ----------------------------------------
function initReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
  }

  // Listen for changes in preference
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  });
}

// ----------------------------------------
// Booking Urgency Month
// ----------------------------------------
function initBookingUrgencyMonth() {
  const monthElements = document.querySelectorAll('.booking-urgency-month');

  if (monthElements.length === 0) return;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = new Date().getMonth();
  const nextMonth = (currentMonth + 1) % 12;
  const nextMonthName = months[nextMonth];

  monthElements.forEach(function(el) {
    el.textContent = nextMonthName;
  });
}

// ----------------------------------------
// Mobile Navigation
// ----------------------------------------
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener('click', function() {
    const isOpen = navMenu.classList.contains('is-open');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking a link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });

  function openMenu() {
    navMenu.classList.add('is-open');
    navToggle.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
}

// ----------------------------------------
// Navbar Scroll Effect
// ----------------------------------------
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');

  if (!navbar) return;

  // Check if we're on a page with transparent navbar
  const isTransparent = navbar.classList.contains('navbar--transparent');

  if (!isTransparent) return;

  let ticking = false;

  function updateNavbar() {
    const scrollY = window.scrollY;
    const navbarHeight = navbar.offsetHeight;
    const hero = document.querySelector('.hero');
    const startFade = 50; // Start fading after 50px

    // End fade when navbar bottom reaches hero bottom
    const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
    const endFade = heroHeight - navbarHeight;

    // Calculate opacity based on scroll position
    let opacity = 0;
    if (scrollY > startFade) {
      opacity = Math.min((scrollY - startFade) / (endFade - startFade), 1);
    }

    // Apply background with calculated opacity
    navbar.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    navbar.style.boxShadow = opacity > 0.5 ? `0 4px 6px -1px rgba(0, 0, 0, ${opacity * 0.1}), 0 2px 4px -1px rgba(0, 0, 0, ${opacity * 0.06})` : 'none';

    // Toggle class for text color changes at halfway point
    if (opacity > 0.5) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }

    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  // Run once on load
  updateNavbar();
}

// ----------------------------------------
// Client Portal Dropdown
// ----------------------------------------
function initClientPortalDropdown() {
  const dropdown = document.getElementById('client-portal');

  if (!dropdown) return;

  const toggle = dropdown.querySelector('.nav-dropdown-toggle');
  const menu = dropdown.querySelector('.nav-dropdown-menu');

  if (!toggle || !menu) return;

  // Toggle on click
  toggle.addEventListener('click', function(e) {
    e.preventDefault();
    const isOpen = dropdown.classList.contains('is-open');

    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  // Keyboard support
  toggle.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle.click();
    }
  });

  // Close on click outside
  document.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target)) {
      closeDropdown();
    }
  });

  // Close on escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  });

  function openDropdown() {
    dropdown.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown() {
    dropdown.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
}

// ----------------------------------------
// Scroll Animations
// ----------------------------------------
function initScrollAnimations() {
  // Check for reduced motion preference
  if (document.documentElement.classList.contains('reduce-motion')) {
    // Make all animated elements visible immediately
    document.querySelectorAll('[data-animate]').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const animatedElements = document.querySelectorAll('[data-animate]');

  if (animatedElements.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optionally unobserve after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    observer.observe(el);
  });
}

// ----------------------------------------
// Team Bio Accordions
// ----------------------------------------
function initTeamAccordions() {
  const toggleButtons = document.querySelectorAll('[data-team-toggle]');

  if (toggleButtons.length === 0) return;

  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const teamCard = button.closest('.card-team');
      const isExpanded = teamCard.classList.contains('is-expanded');

      // Close all other accordions
      document.querySelectorAll('.card-team.is-expanded').forEach(card => {
        if (card !== teamCard) {
          card.classList.remove('is-expanded');
          const cardButton = card.querySelector('[data-team-toggle]');
          if (cardButton) {
            cardButton.setAttribute('aria-expanded', 'false');
            cardButton.innerHTML = 'View Bio <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
          }
        }
      });

      // Toggle current accordion
      if (isExpanded) {
        teamCard.classList.remove('is-expanded');
        button.setAttribute('aria-expanded', 'false');
        button.innerHTML = 'View Bio <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
      } else {
        teamCard.classList.add('is-expanded');
        button.setAttribute('aria-expanded', 'true');
        button.innerHTML = 'Close Bio <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
      }
    });
  });
}

// ----------------------------------------
// Smooth Scroll for Anchor Links
// ----------------------------------------
function initSmoothScroll() {
  // Only for links that point to anchors on the same page
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      // Skip if it's just "#"
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        // Get navbar height for offset
        const navbar = document.getElementById('navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        let targetPosition;

        // Special handling for hero scroll indicator going to #intro
        if (targetId === '#intro' && this.classList.contains('scroll-indicator')) {
          const sectionHeight = targetElement.offsetHeight;
          const viewportHeight = window.innerHeight;
          const sectionTop = targetElement.getBoundingClientRect().top + window.scrollY;

          // On larger screens, center the section content
          if (viewportHeight >= 768 && sectionHeight < viewportHeight) {
            // Center the section in the viewport
            const centeredOffset = (viewportHeight - sectionHeight) / 2;
            targetPosition = sectionTop - centeredOffset;
          } else {
            // On smaller screens, put the heading at the top with navbar offset
            targetPosition = sectionTop - navbarHeight - 20;
          }
        } else {
          // Default behavior for other links
          targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
        }

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // Handle page load with hash
  if (window.location.hash) {
    const targetElement = document.querySelector(window.location.hash);

    if (targetElement) {
      // Wait for page to fully load
      setTimeout(() => {
        const navbar = document.getElementById('navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  }
}

// ----------------------------------------
// Utility: Throttle Function
// ----------------------------------------
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ----------------------------------------
// Utility: Debounce Function
// ----------------------------------------
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ----------------------------------------
// Typewriter Animation
// ----------------------------------------
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');

  if (!typewriterElement) return;

  // Check for reduced motion preference
  if (document.documentElement.classList.contains('reduce-motion')) {
    typewriterElement.textContent = 'Wealth Planning';
    return;
  }

  const words = [
    'Wealth Planning',
    'Financial Guidance',
    'Investment Strategy',
    'Client Service',
    'Fiduciary Care'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  const typeSpeed = 80;      // Speed of typing
  const deleteSpeed = 50;    // Speed of deleting
  const pauseTime = 2000;    // Pause at complete word
  const pauseBetween = 500;  // Pause before typing next word

  function type() {
    const currentWord = words[wordIndex];

    if (isPaused) {
      isPaused = false;
      setTimeout(type, pauseBetween);
      return;
    }

    if (isDeleting) {
      // Deleting characters
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, pauseBetween);
      } else {
        setTimeout(type, deleteSpeed);
      }
    } else {
      // Typing characters
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentWord.length) {
        isDeleting = true;
        isPaused = true;
        setTimeout(type, pauseTime);
      } else {
        setTimeout(type, typeSpeed);
      }
    }
  }

  // Start the animation
  type();
}

// ----------------------------------------
// Clickable Address (Copy on Desktop, Maps on Mobile)
// ----------------------------------------
function initClickableAddress() {
  const addressElements = document.querySelectorAll('.clickable-address');

  if (addressElements.length === 0) return;

  const fullAddress = '208 E. Louisiana Street, Suite 301, McKinney, Texas 75069';
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(fullAddress);

  // Detect mobile device
  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  }

  addressElements.forEach(element => {
    // Add appropriate cursor and hover styles
    element.style.cursor = 'pointer';

    element.addEventListener('click', function(e) {
      e.preventDefault();

      if (isMobileDevice()) {
        // On mobile, open maps app
        window.open(mapsUrl, '_blank');
      } else {
        // On desktop, copy to clipboard
        navigator.clipboard.writeText(fullAddress).then(() => {
          showCopiedTooltip(element);
        }).catch(err => {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = fullAddress;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          showCopiedTooltip(element);
        });
      }
    });
  });

  function showCopiedTooltip(element) {
    // Check if tooltip already exists
    let tooltip = element.querySelector('.address-tooltip');

    if (!tooltip) {
      tooltip = document.createElement('span');
      tooltip.className = 'address-tooltip';
      tooltip.textContent = 'Copied!';
      element.style.position = 'relative';
      element.appendChild(tooltip);
    }

    // Show tooltip
    tooltip.classList.add('is-visible');

    // Hide after 2 seconds
    setTimeout(() => {
      tooltip.classList.remove('is-visible');
    }, 2000);
  }
}

// ----------------------------------------
// Form Loading States & Bot Protection
// ----------------------------------------
function initFormLoadingStates() {
  const forms = document.querySelectorAll('form[data-netlify="true"], form[netlify]');
  const MIN_SUBMIT_TIME = 3000; // Minimum 3 seconds before submission allowed

  forms.forEach(form => {
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;

    // Record when form was loaded (for time-based bot detection)
    const formLoadTime = Date.now();
    const formLoadedInput = form.querySelector('#form-loaded');
    if (formLoadedInput) {
      formLoadedInput.value = formLoadTime;
    }

    // Store original button content
    const originalButtonText = submitButton.innerHTML;

    form.addEventListener('submit', function(e) {
      // Bot detection checks
      const honeypot1 = form.querySelector('input[name="bot-field"]');
      const honeypot2 = form.querySelector('input[name="website"]');
      const timeSinceLoad = Date.now() - formLoadTime;

      // Check honeypot fields (bots fill these, humans don't see them)
      if ((honeypot1 && honeypot1.value) || (honeypot2 && honeypot2.value)) {
        e.preventDefault();
        console.log('Bot detected: honeypot filled');
        // Silently fail - don't tell bots why it failed
        showFormError(form, 'Unable to submit form. Please try again later.');
        return;
      }

      // Check submission time (bots submit instantly, humans need time)
      if (timeSinceLoad < MIN_SUBMIT_TIME) {
        e.preventDefault();
        console.log('Bot detected: submitted too fast (' + timeSinceLoad + 'ms)');
        showFormError(form, 'Please take a moment to review your message before submitting.');
        return;
      }

      // Passed bot checks - show loading state
      form.classList.add('is-submitting');
      submitButton.disabled = true;
      submitButton.innerHTML = `
        <span class="btn-spinner"></span>
        <span>Sending...</span>
      `;

      // For Netlify forms, let the form submit naturally
    });
  });
}

// Show form error message
function showFormError(form, message) {
  // Remove any existing error
  const existingError = form.querySelector('.form-error-message');
  if (existingError) existingError.remove();

  // Create and insert error message
  const errorDiv = document.createElement('div');
  errorDiv.className = 'form-error-message';
  errorDiv.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <span>${message}</span>
  `;

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.parentNode.insertBefore(errorDiv, submitButton);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// ----------------------------------------
// Exit Intent Popup for Lead Capture
// ----------------------------------------
function initExitIntentPopup() {
  // Don't show on thank-you page or if already shown this session
  if (window.location.pathname.includes('thank-you') ||
      sessionStorage.getItem('exitPopupShown')) {
    return;
  }

  let popupShown = false;

  // Create popup HTML
  const popupHTML = `
    <div class="exit-popup" id="exit-popup" role="dialog" aria-modal="true" aria-labelledby="exit-popup-title">
      <div class="exit-popup-overlay"></div>
      <div class="exit-popup-content">
        <button class="exit-popup-close" aria-label="Close popup">&times;</button>
        <div class="exit-popup-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"/>
          </svg>
        </div>
        <h3 id="exit-popup-title">Before You Go...</h3>
        <p>Schedule a no-pressure, free consultation with our team.</p>

        <div class="exit-popup-calendar">
          <div class="tidycal-embed" data-path="high-ridge-advisory/initial-consultation"></div>
        </div>
        <div class="exit-popup-actions">
          <button class="btn btn-ghost exit-popup-dismiss">Maybe Later</button>
        </div>
      </div>
    </div>
  `;

  // Append popup to body
  document.body.insertAdjacentHTML('beforeend', popupHTML);

  const popup = document.getElementById('exit-popup');
  const closeBtn = popup.querySelector('.exit-popup-close');
  const dismissBtn = popup.querySelector('.exit-popup-dismiss');
  const overlay = popup.querySelector('.exit-popup-overlay');

  function showPopup() {
    if (popupShown) return;
    popupShown = true;
    sessionStorage.setItem('exitPopupShown', 'true');
    popup.classList.add('is-visible');
    document.body.style.overflow = 'hidden';

    // Load TidyCal embed.js if not already on the page
    if (!document.querySelector('script[src*="tidycal"]')) {
      var s = document.createElement('script');
      s.src = 'https://asset-tidycal.b-cdn.net/js/embed.js';
      s.async = true;
      document.body.appendChild(s);
    }
  }

  function hidePopup() {
    popup.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  // Detect exit intent (mouse leaving viewport at top)
  document.addEventListener('mouseleave', function(e) {
    if (e.clientY < 10) {
      showPopup();
    }
  });

  // Close handlers
  closeBtn.addEventListener('click', hidePopup);
  dismissBtn.addEventListener('click', hidePopup);
  overlay.addEventListener('click', hidePopup);

  // Close on escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popup.classList.contains('is-visible')) {
      hidePopup();
    }
  });
}

// ----------------------------------------
// Portal Redirect Overlay
// ----------------------------------------
function initPortalRedirect() {
  var REDIRECT_DELAY = 1500;

  function showRedirectOverlay(destinationUrl, platformName) {
    var overlay = document.createElement('div');
    overlay.className = 'portal-redirect-overlay';
    overlay.innerHTML =
      '<div class="portal-redirect-content">' +
        '<img src="/images/logo.webp" alt="High Ridge Advisory" class="portal-redirect-logo">' +
        '<h2 class="portal-redirect-title">Redirecting to ' + platformName + '</h2>' +
        '<div class="portal-redirect-dots"><span></span><span></span><span></span></div>' +
        '<div class="portal-redirect-badge">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
            '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' +
          '</svg>' +
          '<span>Secure Connection</span>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    setTimeout(function() {
      overlay.classList.add('active');
    }, 10);

    setTimeout(function() {
      window.open(destinationUrl, '_blank', 'noopener,noreferrer');
      overlay.classList.remove('active');
      setTimeout(function() {
        overlay.remove();
      }, 300);
    }, REDIRECT_DELAY);
  }

  var portalCards = document.querySelectorAll('.portal-card[data-portal-name]');
  portalCards.forEach(function(card) {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      var url = card.getAttribute('href');
      var name = card.getAttribute('data-portal-name');
      showRedirectOverlay(url, name);
    });
  });
}
