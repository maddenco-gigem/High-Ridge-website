// ============================================
// HIGH RIDGE ADVISORY - Analytics & Cookie Consent
// ============================================

// Real GA4 / GTM container is injected at deploy time via Netlify's
// Snippet Injection feature (Site settings → Build & deploy → Post
// processing → Snippet injection). Do not re-add a gtag config call
// here — it would double-load against a dead placeholder ID.

// Initialize dataLayer and gtag function (shared with Netlify-injected GTM)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// ----------------------------------------
// Consent state — opt-out model (US / Texas)
// ----------------------------------------
// Analytics + advertising default ON. Visitors opt out via the floating cookie
// icon or the footer "Cookie Preferences" link. An explicit choice stored in
// localStorage always wins; absent a choice, a Global Privacy Control (GPC)
// browser signal is honored as an opt-out, otherwise consent defaults to granted.
var COOKIE_CONSENT_KEY = 'cookie_consent';    // 'granted' | 'denied' (explicit choice)
var COOKIE_NOTICE_KEY = 'cookie_notice_seen'; // 'true' once first-visit notice dismissed

// Consent Mode default — denied for the few ms before we resolve and update.
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied'
});

function cookieResolveConsent() {
  var explicit = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (explicit === 'granted' || explicit === 'denied') return explicit;
  if (navigator.globalPrivacyControl === true) return 'denied'; // honor GPC opt-out
  return 'granted'; // opt-out default: on unless the visitor opts out
}

function cookieApplyConsent(state) {
  var granted = state === 'granted';
  gtag('consent', 'update', {
    'analytics_storage': granted ? 'granted' : 'denied',
    'ad_storage': granted ? 'granted' : 'denied',
    'ad_user_data': granted ? 'granted' : 'denied',
    'ad_personalization': granted ? 'granted' : 'denied'
  });
}

// Resolve and apply consent immediately on load.
cookieApplyConsent(cookieResolveConsent());

// ----------------------------------------
// Cookie Preferences UI — floating icon + panel + first-visit notice
// ----------------------------------------
function cookieSetConsent(state) {
  localStorage.setItem(COOKIE_CONSENT_KEY, state);
  localStorage.setItem(COOKIE_NOTICE_KEY, 'true');
  cookieApplyConsent(state);
  gtag('event', 'cookie_consent', { 'event_category': 'consent', 'event_label': state });
  cookieSyncToggle();
}

function cookieSyncToggle() {
  var toggle = document.getElementById('cookieToggleAA');
  if (toggle) toggle.checked = cookieResolveConsent() === 'granted';
}

function openCookiePanel(e) {
  if (e) e.stopPropagation();
  var panel = document.getElementById('cookiePanel');
  var fab = document.getElementById('cookieFab');
  if (!panel) return;
  cookieSyncToggle();
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  if (fab) fab.setAttribute('aria-expanded', 'true');
  dismissCookieNotice();
}

function closeCookiePanel() {
  var panel = document.getElementById('cookiePanel');
  var fab = document.getElementById('cookieFab');
  if (!panel) return;
  panel.classList.remove('is-open');
  panel.setAttribute('aria-hidden', 'true');
  if (fab) fab.setAttribute('aria-expanded', 'false');
}

var cookieNoticeTimer = null;

function dismissCookieNotice() {
  var notice = document.getElementById('cookieNotice');
  if (!notice) return;
  if (cookieNoticeTimer) { clearTimeout(cookieNoticeTimer); cookieNoticeTimer = null; }
  notice.classList.remove('show');
  setTimeout(function() { if (notice.parentNode) notice.parentNode.removeChild(notice); }, 300);
}

function showCookieNotice() {
  // Mark as shown so the proactive notice appears once, ever. Ongoing notice +
  // opt-out remain available via the cookie icon, footer link, and privacy policy.
  localStorage.setItem(COOKIE_NOTICE_KEY, 'true');
  var notice = document.createElement('div');
  notice.id = 'cookieNotice';
  notice.className = 'cookie-notice';
  notice.setAttribute('role', 'region');
  notice.setAttribute('aria-label', 'Cookie notice');
  notice.innerHTML =
    '<p>We use cookies for analytics and advertising. You can opt out anytime.</p>' +
    '<div class="cookie-notice-actions">' +
      '<button type="button" class="cookie-link-btn" id="cookieNoticeManage">Manage</button>' +
      '<button type="button" class="cookie-btn cookie-btn-primary" id="cookieNoticeGotIt">Got it</button>' +
    '</div>';
  document.body.appendChild(notice);
  requestAnimationFrame(function() { notice.classList.add('show'); });
  document.getElementById('cookieNoticeManage').addEventListener('click', openCookiePanel);
  document.getElementById('cookieNoticeGotIt').addEventListener('click', function(e) {
    e.stopPropagation();
    dismissCookieNotice();
  });

  // Auto-dismiss after 10s if the visitor doesn't act. The persistent cookie
  // icon + footer link remain available either way.
  cookieNoticeTimer = setTimeout(dismissCookieNotice, 10000);
}

function buildCookieUI() {
  // Floating cookie icon (always present)
  var fab = document.createElement('button');
  fab.type = 'button';
  fab.id = 'cookieFab';
  fab.className = 'cookie-fab';
  fab.setAttribute('aria-label', 'Cookie preferences');
  fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5Z"/><circle cx="9" cy="10" r=".6" fill="currentColor"/><circle cx="14.5" cy="13.5" r=".6" fill="currentColor"/><circle cx="9.5" cy="15" r=".6" fill="currentColor"/><circle cx="12.5" cy="8" r=".6" fill="currentColor"/></svg>';
  document.body.appendChild(fab);

  // Preferences panel
  var panel = document.createElement('div');
  panel.id = 'cookiePanel';
  panel.className = 'cookie-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Cookie preferences');
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML =
    '<div class="cookie-panel-head">' +
      '<h2 class="cookie-panel-title">Cookie Preferences</h2>' +
      '<button type="button" class="cookie-panel-close" id="cookiePanelClose" aria-label="Close">&times;</button>' +
    '</div>' +
    '<p class="cookie-panel-text">We use cookies for analytics and advertising, which can include sharing data with third-party partners for measurement and targeted advertising. You can opt out anytime.</p>' +
    '<div class="cookie-toggle-row">' +
      '<div class="cookie-toggle-copy"><div class="cookie-toggle-label">Analytics &amp; advertising</div><div class="cookie-toggle-sub">Measures traffic and supports relevant advertising.</div></div>' +
      '<label class="cookie-switch"><input type="checkbox" id="cookieToggleAA"><span class="cookie-slider"></span></label>' +
    '</div>' +
    '<div class="cookie-panel-actions">' +
      '<button type="button" class="cookie-btn cookie-btn-primary" id="cookieSave">Save preferences</button>' +
    '</div>' +
    '<a class="cookie-panel-link" href="https://csenge.com/wp-content/uploads/2025/05/Privacy-Policy-2025.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>';
  document.body.appendChild(panel);

  // Wire interactions
  fab.addEventListener('click', function(e) {
    e.stopPropagation();
    if (panel.classList.contains('is-open')) closeCookiePanel(); else openCookiePanel();
  });
  document.getElementById('cookiePanelClose').addEventListener('click', closeCookiePanel);
  document.getElementById('cookieSave').addEventListener('click', function() {
    var on = document.getElementById('cookieToggleAA').checked;
    cookieSetConsent(on ? 'granted' : 'denied');
    closeCookiePanel();
  });

  // Close on outside click / Escape
  document.addEventListener('click', function(e) {
    if (!panel.classList.contains('is-open')) return;
    if (panel.contains(e.target) || fab.contains(e.target)) return;
    closeCookiePanel();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) closeCookiePanel();
  });

  // Footer "Cookie Preferences" link (second opt-out entry point).
  // Injected as an <a> so it inherits the existing footer-legal link styling.
  var legal = document.querySelector('.footer-legal-links');
  if (legal) {
    var link = document.createElement('a');
    link.className = 'footer-cookie-link';
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
    link.textContent = 'Cookie Preferences';
    link.addEventListener('click', openCookiePanel);
    link.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCookiePanel(e); }
    });
    legal.appendChild(link);
  }

  cookieSyncToggle();

  // First-visit notice — shown once, ever. The cookie icon, footer link, and
  // privacy policy provide ongoing notice + opt-out thereafter.
  if (localStorage.getItem(COOKIE_NOTICE_KEY) !== 'true') {
    showCookieNotice();
  }
}

document.addEventListener('DOMContentLoaded', buildCookieUI);

// ----------------------------------------
// Custom Event Tracking
// ----------------------------------------

// Track outbound links
document.addEventListener('click', function(e) {
  const link = e.target.closest('a');
  if (link && link.hostname !== window.location.hostname) {
    gtag('event', 'click', {
      'event_category': 'outbound',
      'event_label': link.href,
      'transport_type': 'beacon'
    });
  }
});

// Track CTA button clicks
document.addEventListener('click', function(e) {
  const ctaButton = e.target.closest('.btn-primary, .btn-gold, .btn-ghost');
  if (ctaButton) {
    const buttonText = ctaButton.textContent.trim();
    const buttonHref = ctaButton.href || 'no-href';

    gtag('event', 'cta_click', {
      'event_category': 'engagement',
      'event_label': buttonText,
      'button_destination': buttonHref
    });
  }
});

// Track form submissions
document.addEventListener('submit', function(e) {
  const form = e.target;
  const formName = form.getAttribute('name') || form.id || 'unnamed-form';

  gtag('event', 'form_submit', {
    'event_category': 'engagement',
    'event_label': formName
  });
});

// Track scroll depth
let scrollDepthTracked = {25: false, 50: false, 75: false, 100: false};

window.addEventListener('scroll', debounceScroll(function() {
  const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

  [25, 50, 75, 100].forEach(depth => {
    if (scrollPercent >= depth && !scrollDepthTracked[depth]) {
      scrollDepthTracked[depth] = true;
      gtag('event', 'scroll_depth', {
        'event_category': 'engagement',
        'event_label': depth + '%'
      });
    }
  });
}, 250));

function debounceScroll(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  };
}

// Track page engagement time
let engagementStart = Date.now();
let isPageVisible = true;

document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    isPageVisible = false;
    const timeSpent = Math.round((Date.now() - engagementStart) / 1000);
    gtag('event', 'page_engagement', {
      'event_category': 'engagement',
      'event_label': 'time_on_page',
      'value': timeSpent
    });
  } else {
    isPageVisible = true;
    engagementStart = Date.now();
  }
});

// Track client portal clicks
document.addEventListener('click', function(e) {
  const portalLink = e.target.closest('.nav-dropdown-item');
  if (portalLink) {
    const portalName = portalLink.textContent.trim();
    gtag('event', 'client_portal_click', {
      'event_category': 'engagement',
      'event_label': portalName
    });
  }
});

// Track team bio expansions
document.addEventListener('click', function(e) {
  const bioToggle = e.target.closest('[data-team-toggle]');
  if (bioToggle) {
    const teamMember = bioToggle.getAttribute('data-team-toggle');
    const card = bioToggle.closest('.card-team');
    const isExpanding = !card.classList.contains('is-expanded');

    if (isExpanding) {
      gtag('event', 'team_bio_view', {
        'event_category': 'engagement',
        'event_label': teamMember
      });
    }
  }
});
