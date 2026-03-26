# Computer Enhancement Systems (CES) Website

## Global Header and Footer Architecture

The CES website utilizes a **JavaScript-injected global architecture** to ensure maintainability and consistency across all 11+ site pages. Instead of hardcoding the header and footer in every HTML file, the site uses a single-source-of-truth approach.

### Key Components
- **`header.html` & `footer.html`**: These files contain the primary HTML markup for the global site components.
- **`js/header-footer-injector.js`**: This script is responsible for the synchronous injection of the header and the asynchronous injection of the footer.
- **`css/header.css` & `css/footer.css`**: Modular stylesheets containing all styles for their respective components.

### Implementation Strategy
1. **Zero CLS (Cumulative Layout Shift):** To prevent the page from flickering or shifting upon load, the `header-footer-injector.js` is placed in the `<head>` of every document. It synchronously injects the header HTML before the first paint and uses a temporary `visibility: hidden` guard on the `<body>` to ensure a seamless experience.
2. **Absolute Path Normalization:** All internal links in the global templates use absolute root paths (e.g., `/index.html`) to ensure correct navigation from any subdirectory, such as `/service-areas/`.
3. **Event Orchestration:** The injector dispatches a `headerInjected` custom event once the header is in the DOM. The `js/main.js` file waits for this event before attaching navigation-dependent listeners (like the mobile menu toggle).

### Navigation & Dropdowns
- **About Us Dropdown:** The "About Us" nav item features a responsive dropdown.
  - **Desktop:** Interactive hover reveals a panel with links to **About Us** and **Contact Us**.
  - **Mobile:** The primary tap toggles the dropdown inline within the hamburger menu.
- **Active State:** The injector automatically applies the `.active` class to the appropriate navigation link based on the current `window.location.pathname`.

## Seminar & Event Management
The site frequently hosts events like the **AI Integration & Cybersecurity Lunch and Learn Seminar**.
- **Current Seminar Date:** May 21st, 2026.
- **Updating Dates:** When a seminar date changes, the update typically only needs to happen in `header.html`, `footer.html`, and page-specific content like `index.html` and `ai-seminar-registration.html`.

## Development Guidelines
- **Adding Nav Links:** Update the `HEADER_HTML` string constant in `js/header-footer-injector.js` and the corresponding logic in `header.html` for local reference.
- **Styling:** Always use `css/header.css` for header changes and `css/footer.css` for footer changes. Avoid adding these styles to `styles.css`.
- **Mobile Menu:** The mobile menu toggle is re-bound automatically by the injector using a DOM node clone pattern to prevent stale event listeners.
