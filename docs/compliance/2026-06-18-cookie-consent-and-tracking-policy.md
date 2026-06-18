# Cookie Consent & Website Tracking — Decision Record

**Effective date:** 2026-06-18
**Owner:** High Ridge Advisory (site built/maintained by OnWave Lab)
**Status:** Implemented on staging (drafts) — **pending Csenge/CCO sign-off before production**
**Applies to:** highridgeadvisory.com (the `hra-website` Netlify site)

> Purpose: This document records — as of the effective date above — the firm's
> stance and the specific choices made for website cookies, analytics, and
> advertising tracking, and the reasoning behind them, so the decisions are
> defensible and reconstructable in a compliance review or audit.

---

## 1. Summary of what was decided

High Ridge Advisory adopted an **opt-out consent model** for non-essential
(analytics + advertising) cookies on the public marketing website, surfaced
through a persistent, low-friction **cookie preferences control** rather than a
blocking banner. Analytics/advertising run by default; visitors can opt out at
any time via a floating cookie icon or a footer link, and the site honors
browser **Global Privacy Control (GPC)** signals as an opt-out.

This replaced an earlier (same-day) approach that used a per-quiz consent
checkbox and an auto-showing "Accept / Decline" banner; that approach was
reverted in favor of the model described here (see §7, History).

---

## 2. Legal stance and rationale

**Jurisdiction.** High Ridge Advisory operates from McKinney, Texas and serves a
predominantly U.S. client base. The governing consumer-privacy regime is
therefore U.S. **state law** — principally the **Texas Data Privacy and Security
Act (TDPSA)**, with the California (CPRA), Colorado, and Connecticut frameworks
as reference points.

**Why opt-out is permissible.** These U.S. state laws operate on an **opt-out**
model for targeted advertising and the "sale"/"sharing" of personal data: a
business may run analytics and advertising cookies by default provided it (a)
gives notice, (b) offers an accessible opt-out, and (c) honors universal opt-out
signals (GPC). We satisfy all three (see §3). Prior **opt-in** consent is only
required under **EU/UK GDPR + ePrivacy**, which is not our operating market;
EU/UK traffic is treated as out of scope for this decision.

**Sector-specific sensitivity (financial services).** Advisory services on this
site are offered through Csenge Advisory Group, LLC (a registered investment
adviser). Because the firm handles nonpublic personal financial information, we
applied additional caution beyond the bare legal minimum:

- **No sensitive data to advertising platforms.** Any future advertising pixel
  (e.g., Meta) must fire only generic events — **no PII and no financial quiz
  answers** are sent to third-party ad platforms. (See §6.)
- **Conservative on consent UX.** We deliberately avoided "dark patterns."
- **CCO/Csenge sign-off** is required before this model goes to production,
  given the firm's Reg S-P / GLBA obligations and published privacy policy.

**No dark patterns — deliberate choice.** We rejected the idea of biasing users
toward "Accept" (e.g., making Accept large/easy and Decline hidden/hard). The
FTC and state attorneys general treat manipulated consent interfaces as
**invalid consent and a deceptive practice**, and it is inappropriate for a
fiduciary. The opt-out model makes this moot: there is no pressured "Accept"
moment — the first-visit notice is purely informational ("Manage" / "Got it").

---

## 3. How we meet the three opt-out requirements

| Requirement | How it's met |
|---|---|
| **Notice** | A compact first-visit notice ("We use cookies for analytics and advertising. You can opt out anytime.") shown once, that auto-dismisses after 10 seconds (or when the visitor clicks "Got it" / "Manage"). Ongoing notice and opt-out do not depend on the toast: the persistent cookie icon, the footer "Cookie Preferences" link, and the Csenge Privacy Policy link (in both the preferences panel and the footer) remain available at all times. |
| **Accessible opt-out** | A persistent floating cookie icon (bottom-right, every page) **and** a "Cookie Preferences" link in the footer, both opening a preferences panel with a single Analytics & advertising toggle that can be switched off and saved at any time. |
| **Honor universal opt-out signals** | If the visitor's browser sends **Global Privacy Control** (`navigator.globalPrivacyControl === true`) and the visitor has not made an explicit choice, consent resolves to **denied** automatically. |

---

## 4. Specific choices and why

- **Default ON (opt-out), single combined toggle.** Maximizes measurement and
  advertising data (the business goal) while remaining U.S.-legal. A single
  "Analytics & advertising" category was chosen over split toggles for
  simplicity; this can be split later if finer control is wanted.
- **Floating icon + footer link, no blocking banner.** Lowers friction and is
  less intrusive than the prior full-width banner, while keeping the opt-out one
  click away at all times. The first-visit notice provides the required notice
  without blocking the page.
- **Explicit choice persisted.** A visitor's explicit choice
  (`cookie_consent = granted | denied`) is stored in `localStorage` and always
  overrides the default and the GPC fallback.
- **Google Consent Mode v2.** Consent is expressed to Google tags via
  `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization`.
  Default is `denied` for the brief moment before the resolved state is applied
  on load.
- **Quiz left untouched.** The Second Opinion assessment (exit-popup, homepage
  embed, and standalone page) carries **no** consent gate. Consent is handled
  globally by the cookie system, not per-form, so the assessment experience is
  unchanged.

---

## 5. Disclosure copy change

The prior cookie banner stated **"Your data is never sold."** That claim was
**removed**, because running an advertising/retargeting pixel is treated as a
"sale"/"sharing" of personal data for cross-context behavioral advertising under
TX/CA/CO/CT law, which would make an absolute "never sold" statement misleading.

Current disclosure language (preferences panel and first-visit notice):

> "We use cookies for analytics and advertising, which can include sharing data
> with third-party partners for measurement and targeted advertising. You can
> opt out anytime."

**Open item:** The site links to **Csenge's** Privacy Policy
(`csenge.com/.../Privacy-Policy-2025.pdf`). Csenge/compliance should confirm that
policy discloses advertising pixels and data sharing with advertising partners;
if it does not, it should be updated by Csenge. This is outside the website
codebase.

---

## 6. What is NOT yet in place (as of this date)

- **No advertising pixel is installed.** The Meta Pixel (and any other ad
  pixel) is **not** present on the site as of 2026-06-18. This work was the
  consent + disclosure groundwork that must precede it.
- **When a pixel is added**, it must: (a) fire only when consent resolves to
  granted, (b) send **no PII and no financial quiz answers** to the platform —
  only a generic completion event, and (c) be reflected in this document and the
  privacy disclosures.
- **Production sign-off pending.** Implemented on the `drafts` branch /
  `drafts--hra-website.netlify.app` only. Promotion to production requires
  Csenge/CCO approval of the opt-out model.

---

## 7. Implementation references

- **Consent logic & UI:** `js/analytics.js` (consent resolution, Google Consent
  Mode mapping, floating icon, preferences panel, first-visit notice, footer
  link injection).
- **Styling:** `css/styles.css` (`.cookie-fab`, `.cookie-panel`,
  `.cookie-notice`, toggle switch, footer link).
- **Security headers / CSP:** `netlify.toml`.

**Relevant commits:**
- `884f650` — pre-consent baseline (CSP header).
- `37bcfd7` — first approach: per-quiz consent checkbox + banner copy tightening
  (subsequently reverted).
- `53c0b77` — **current model:** opt-out cookie preferences (icon + panel +
  footer link); reverted the popup consent gate.
- `dfbcd66` — minor cleanup.

---

## 8. Review triggers

Revisit and re-date this record when any of the following occur:

- A Meta (or other) advertising pixel is installed.
- The firm begins targeting or materially serving EU/UK visitors (would require
  switching to opt-in for those users).
- A change in TX/US state privacy law or enforcement guidance affecting the
  opt-out model or GPC handling.
- The Csenge Privacy Policy is updated, or the firm adopts its own.
- Any change to the consent UI, default state, or the data sent to third
  parties.

---

*Prepared 2026-06-18. This is an internal decision record, not legal advice;
final compliance determinations rest with Csenge/the firm's Chief Compliance
Officer.*
