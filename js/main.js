/**
 * =====================================================
 * CES Main Scripts
 * =====================================================
 * Nav-dependent code (mobile toggle) now listens for
 * the 'headerInjected' CustomEvent dispatched by
 * header-footer-injector.js, guaranteeing the header
 * DOM exists before attaching listeners.
 *
 * All other functionality (carousel, accordion) remains
 * on DOMContentLoaded as those elements are page-specific
 * and always present in the static HTML.
 * =====================================================
 */

/* --------------------------------------------------
   Mobile Navigation
   Handled by header-footer-injector.js → initMobileMenu().
   The injector dispatches 'headerInjected' after binding
   the toggle, so no duplicate binding is needed here.
   Adding a second listener here would cause double-toggle
   (open → immediately close) on every click.
-------------------------------------------------- */

/* --------------------------------------------------
   Page-Specific: Carousel
   These elements are in static HTML, so DOMContentLoaded
   is the correct trigger.
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    var slides = document.querySelectorAll('.carousel-slide');
    if (slides.length > 0) {
        var dotsContainer = document.querySelector('.carousel-dots');
        var prevButton = document.querySelector('.carousel-control.prev');
        var nextButton = document.querySelector('.carousel-control.next');
        var currentSlide = 0;
        var slideInterval;

        var showSlide = function (index) {
            slides.forEach(function (slide, i) {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
            document.querySelector('.carousel-slides').style.transform = 'translateX(-' + (index * 100) + '%)';
            updateDots(index);
        };

        var nextSlide = function () {
            currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
            showSlide(currentSlide);
        };

        var startSlideShow = function () {
            slideInterval = setInterval(nextSlide, 7000);
        };

        var stopSlideShow = function () {
            clearInterval(slideInterval);
        };

        var updateDots = function (index) {
            var dots = document.querySelectorAll('.dot');
            dots.forEach(function (dot, i) {
                dot.classList.remove('active');
                if (i === index) {
                    dot.classList.add('active');
                }
            });
        };

        var createDots = function () {
            slides.forEach(function (_, i) {
                var dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', function () {
                    stopSlideShow();
                    showSlide(i);
                    currentSlide = i;
                    startSlideShow();
                });
                dotsContainer.appendChild(dot);
            });
        };

        prevButton.addEventListener('click', function () {
            stopSlideShow();
            currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
            showSlide(currentSlide);
            startSlideShow();
        });

        nextButton.addEventListener('click', function () {
            stopSlideShow();
            nextSlide();
            startSlideShow();
        });

        createDots();
        showSlide(0);
        startSlideShow();
    }
});

/* --------------------------------------------------
   Page-Specific: Accordion
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    var accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(function (header) {
        header.addEventListener('click', function () {
            this.classList.toggle('active');
            var content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
});