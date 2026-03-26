/**
 * =====================================================
 * CES Global Header & Footer Injector
 * =====================================================
 * PHASE 1 (Synchronous — runs in <head>):
 *   - Header HTML is embedded inline as a string constant.
 *     This avoids any network fetch and guarantees the
 *     header is painted on the FIRST render frame,
 *     eliminating Cumulative Layout Shift (CLS).
 *
 * PHASE 2 (Async — runs on DOMContentLoaded):
 *   - Footer is injected (below the fold, no CLS risk).
 *   - Active nav link is set based on window.location.pathname.
 *   - Mobile menu is re-initialized.
 *   - 'headerInjected' CustomEvent is dispatched so that
 *     main.js can safely attach listeners to nav elements.
 * =====================================================
 */

(function () {
    'use strict';

    /* --------------------------------------------------
       HEADER MARKUP (embedded — no fetch required)
       All paths are absolute root paths to support
       pages loaded from /service-areas/ subdirectory.
    -------------------------------------------------- */
    var HEADER_HTML = '\
<header class="site-header">\
    <div class="header-top">\
        <div class="container header-top-grid">\
            <div class="header-left">\
                <a href="/index.html" class="logo-link">\
                    <img src="/images/ceslogo.png" alt="Computer Enhancement Systems Logo" class="logo-image-wide">\
                </a>\
            </div>\
            <div class="header-right">\
                <div class="header-branding">\
                    <span class="contact-main-text">Computer Enhancement Systems, Inc</span>\
                    <span class="contact-dba-text">dba CES IT Service</span>\
                </div>\
                <div class="contact-sub-text">\
                    | <a href="tel:+13016201580" class="header-phone-link">301-620-1580</a> \u2013 1530 Tilco Drive -\
                    Unit C, Frederick, MD 21704 |\
                </div>\
            </div>\
            <div class="mobile-menu-toggle-wrapper">\
                <button class="mobile-nav-toggle" aria-label="Toggle navigation">\
                    <span></span>\
                    <span></span>\
                    <span></span>\
                </button>\
            </div>\
        </div>\
    </div>\
    <nav class="header-nav-bar">\
        <div class="container">\
            <ul class="main-nav-list" id="ces-main-nav">\
                <li><a href="/index.html">Home</a></li>\
                <li><a href="/managed-services.html">Managed IT Service</a></li>\
                <li><a href="/video-surveillance.html">AI Video Surveillance</a></li>\
                <li><a href="/voip-solutions.html">VoIP Solutions</a></li>\
                <li class="nav-item--has-dropdown">\
                    <a href="/about.html" class="nav-link--dropdown-parent">About Us\
                        <span class="chevron-wrap">\
                            <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>\
                        </span>\
                    </a>\
                    <ul class="nav-dropdown">\
                        <li><a href="/about.html">About Us</a></li>\
                        <li><a href="/testimonials.html">Testimonials</a></li>\
                        <li><a href="/referral-program.html">Referral Program</a></li>\
                        <li><a href="/contact-us.html">Contact Us</a></li>\
                    </ul>\
                </li>\
            </ul>\
        </div>\
    </nav>\
</header>';

    /* --------------------------------------------------
       FOOTER MARKUP (injected async — no CLS risk)
    -------------------------------------------------- */
    var FOOTER_HTML = '\
<footer class="site-footer">\
    <div class="container">\
        <div class="footer-grid">\
            <div class="footer-column" id="social-column">\
                <h4>Stay Connected</h4>\
                <div class="social-icons">\
                    <a href="https://www.facebook.com/ComputerEnhancementSystems" target="_blank" rel="noopener noreferrer" aria-label="Facebook">\
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-1.5c-1 0-1 .5-1 1V12h3l-.5 3h-2.5v6.8A10 10 0 0022 12z"/></svg>\
                    </a>\
                    <a href="https://x.com/cesitservice" target="_blank" rel="noopener noreferrer" aria-label="X">\
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>\
                    </a>\
                </div>\
            </div>\
            <div class="footer-column" id="contact-info-column">\
                <p>Computer Enhancement Systems, Inc.</p>\
                <p>301-620-1580</p>\
                <p>1530 Tilco Drive - Unit C, Frederick, MD 21704</p>\
                <p class="footer-hours">BUSINESS HOURS: MON-FRI 8AM-5PM</p>\
                <p class="footer-hours">WALK-IN HOURS: MON-FRI 9AM-4:30PM</p>\
                <div class="footer-service-areas">\
                    <p>Proudly Supporting:\
                        <a href="/service-areas/it-support-services-frederick.html">Frederick, MD</a> |\
                        <a href="/service-areas/it-support-services-montgomery.html">Montgomery, MD</a> |\
                        <a href="/service-areas/it-support-services-columbia.html">Columbia, MD</a>\
                    </p>\
                </div>\
            </div>\
            <div class="footer-column" id="partners-column">\
                <h4>Business Partners</h4>\
                <div class="partner-logos">\
                    <a href="https://www.hp.com/" target="_blank" rel="noopener noreferrer"><img src="/images/hp_logo.svg" alt="HP Logo" loading="lazy"></a>\
                    <a href="https://www.cisco.com/" target="_blank" rel="noopener noreferrer"><img src="/images/cisco.gif" alt="Cisco Logo" loading="lazy"></a>\
                    <a href="https://www.intel.com/" target="_blank" rel="noopener noreferrer"><img src="/images/partner-intel.jpg" alt="Intel Logo" loading="lazy"></a>\
                    <a href="https://www.microsoft.com/en-us/microsoft-365" target="_blank" rel="noopener noreferrer"><img src="/images/365.png" alt="Office 365 Logo" loading="lazy"></a>\
                </div>\
            </div>\
        </div>\
    </div>\
    <div class="footer-bottom-bar">\
        <div class="container">\
            <p>&copy; 2025 Computer Enhancement Systems, Inc. All Rights Reserved.</p>\
        </div>\
    </div>\
</footer>';

    /* --------------------------------------------------
       NAV ACTIVE LINK MAP
       Maps URL path segments to nav link hrefs.
       The /service-areas/ pages use '/' (Home) as active.
    -------------------------------------------------- */
    var NAV_MAP = [
        { match: /^\/managed-services/,    href: '/managed-services.html' },
        { match: /^\/video-surveillance/,  href: '/video-surveillance.html' },
        { match: /^\/voip-solutions/,      href: '/voip-solutions.html' },
        { match: /^\/about/,               href: '/about.html' },
        { match: /^\/testimonials/,        href: '/testimonials.html' },
        { match: /^\/contact-us/,          href: '/contact-us.html' },
        { match: /^\/$|^\/index/,          href: '/index.html' },
        // Service area pages show Home as active (no service-area nav item)
        { match: /^\/service-areas\//,     href: '/index.html' }
    ];

    /* --------------------------------------------------
       PHASE 1: Synchronous header injection
       Runs immediately when script tag is parsed in <head>.
       document.currentScript.parentElement is <head>, but
       we target #site-header-root which is written into
       <body> before this script runs via a placeholder.
       We defer the DOM placement to DOMContentLoaded
       because <body> does not yet exist at parse of <head>.
       To guarantee zero CLS, we hide the body until the
       header is placed, then reveal it.
    -------------------------------------------------- */
    // Inject a blocking style to hide body until header is ready.
    // This is removed immediately after header is placed.
    var blockStyle = document.createElement('style');
    blockStyle.id = 'ces-header-block';
    blockStyle.textContent = 'body{visibility:hidden;}';
    document.head.appendChild(blockStyle);

    /* --------------------------------------------------
       PHASE 2: DOM-ready injection
    -------------------------------------------------- */
    function initMobileMenu() {
        var toggle = document.querySelector('.mobile-nav-toggle');
        if (!toggle) return;
        // Remove any stale listeners by cloning the node
        var fresh = toggle.cloneNode(true);
        toggle.parentNode.replaceChild(fresh, toggle);
        fresh.addEventListener('click', function () {
            document.body.classList.toggle('nav-active');
            // Close any open dropdowns when toggling the mobile menu closed
            if (!document.body.classList.contains('nav-active')) {
                document.querySelectorAll('.nav-item--has-dropdown.dropdown-open')
                    .forEach(function (item) { item.classList.remove('dropdown-open'); });
            }
        });
    }

    function initDropdowns() {
        var dropdownItems = document.querySelectorAll('.nav-item--has-dropdown');
        dropdownItems.forEach(function (item) {
            var parentLink = item.querySelector('.nav-link--dropdown-parent');
            if (!parentLink) return;

            parentLink.addEventListener('click', function (e) {
                // MOBILE: top-level click opens/closes dropdown instead of navigating
                if (document.body.classList.contains('nav-active')) {
                    e.preventDefault();
                    // Close other open dropdowns
                    document.querySelectorAll('.nav-item--has-dropdown.dropdown-open')
                        .forEach(function (other) {
                            if (other !== item) other.classList.remove('dropdown-open');
                        });
                    item.classList.toggle('dropdown-open');
                }
                // DESKTOP: allow normal href navigation; dropdown is controlled by CSS :hover
            });
        });
    }

    function setActiveNavLink() {
        var path = window.location.pathname;
        var navLinks = document.querySelectorAll('#ces-main-nav a');
        var activeHref = '/index.html'; // fallback

        for (var i = 0; i < NAV_MAP.length; i++) {
            if (NAV_MAP[i].match.test(path)) {
                activeHref = NAV_MAP[i].href;
                break;
            }
        }

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            // Normalize: compare just the pathname portion
            var linkPath = link.getAttribute('href');
            if (linkPath === activeHref) {
                link.classList.add('active');
            }
        });
    }

    function injectHeader() {
        var root = document.getElementById('site-header-root');
        if (root) {
            root.outerHTML = HEADER_HTML;
        }
        // Remove the visibility block — header is now in the DOM
        var block = document.getElementById('ces-header-block');
        if (block) block.parentNode.removeChild(block);
    }

    function injectFooter() {
        var root = document.getElementById('site-footer-root');
        if (root) {
            root.outerHTML = FOOTER_HTML;
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        // Inject header & footer
        injectHeader();
        injectFooter();

        // Set active nav link on the freshly injected header
        setActiveNavLink();

        // Re-bind mobile menu and initialize dropdowns
        initMobileMenu();
        initDropdowns();

        // Dispatch the headerInjected custom event so main.js and any
        // other scripts can safely query navigation elements.
        document.dispatchEvent(new CustomEvent('headerInjected', {
            bubbles: true,
            detail: { path: window.location.pathname }
        }));
    });

}());
