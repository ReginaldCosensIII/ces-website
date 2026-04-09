# Computer Enhancement Systems (CES) Website

Computer Enhancement Systems, Inc. (dba CES IT Service) provides managed IT services, cybersecurity, VoIP solutions, and AI-driven video surveillance for businesses in the Maryland, DC, and Virginia areas.

This repository contains the source code for the public-facing CES website, designed for high performance, SEO excellence, and easy maintainability.

## 🚀 Key Technologies
- **Core:** HTML5, CSS3, Vanilla JavaScript (ES5/ES6+)
- **Architecture:** JavaScript-driven global component injection
- **Performance:** Synchronous head-loading for zero Cumulative Layout Shift (CLS)
- **Analytics:** Google Tag Manager (GTM) and GA4 integration

## 🏗️ Architecture Overview

The site utilizes a **component-based injection strategy** to centralize shared infrastructure (Header and Footer) across all 11+ pages.

### Global Header & Footer
- **Source Files:** `header.html` and `footer.html` (markup fragments)
- **Injection Engine:** `js/header-footer-injector.js`
- **Styling:** `css/header.css` and `css/footer.css` (decoupled from page-specific styles)

#### Injection Flow:
1. **Phase 1 (Sync):** The injector script in the `<head>` performs a blocking injection of the header into `#site-header-root`. A temporary `visibility: hidden` guard on `<body>` ensures the page only renders once the header is painted, eliminating layout shifts.
2. **Phase 2 (Async):** The footer is injected into `#site-footer-root` on `DOMContentLoaded`.
3. **Event Orchestration:** Dispatches a `headerInjected` event to signal `main.js` that navigation elements are ready for listener attachment.

## 📂 Directory Structure
- `/css`: Modular stylesheets (`styles.css`, `header.css`, `footer.css`, `about.css`)
- `/js`: Site logic (`main.js`, `header-footer-injector.js`)
- `/service-areas`: Location-specific SEO landing pages
- `/images`: Site-wide assets and photography
- `header.html`, `footer.html`: Global component fragments
- `sitemap.xml`, `robots.txt`: SEO configuration
- `web.config`: IIS server routing and redirect rules

## 💡 Navigational Features
- **Smart Dropdowns:** The "About Us" menu uses a context-aware implementation:
  - **Desktop:** CSS hover reveals the dropdown panel.
  - **Mobile:** JavaScript intercepts the parent click to toggle the dropdown inline within the mobile hamburger menu.
- **Active States:** Navigation links automatically highlight based on the current URI path.
- **Path Absolutism:** All internal links use root-absolute paths (e.g., `/index.html`) to support deep-nested subdirectories like `/service-areas/`.

## 🛠️ Maintenance & Content Updates

### Updating CEO AI Forum Dates
When updating the **CEO AI Forum** date:
1. Update `index.html` (Hero and Forum sections).
2. Update `ceo-ai-forum.html` (Header and form text).
3. Update the global `header.html` or `footer.html` if the event is featured in the navigation or sidebar.

### Deployment Guidelines
- **IIS Requirements:** The site is hosted on Windows Server via IIS.
- **Redirects:** Use the `web.config` file to manage 301 redirects and enforce lowercase URL normalization.
- **Testing:** Always deploy to the CES Dev Server and verify navigation and mobile responsiveness before pushing to production.

---
*Maintained by the CES Development Team*

## 🛠️ Developer Workflow

To maintain professional standards and architectural consistency, all developers should follow the site's standardized workflow:

1. **Standard Flow:** Use the `/standard-task-flow` command to initiate a repeatable development cycle.
2. **PR Templates:** Always use the **CES Standard PR Template** defined in the project's **Skill** repository (`.agent/SKILL.md`).
3. **Local Tooling:** The `.agent/` directory contains local-only scripts and patterns that facilitate professional-grade AI-assisted development.
4. **Global Extensions:** This project utilizes the **Global Voice Assistant (TTS)** and **Educational Mentorship** protocols for an enhanced development experience.
