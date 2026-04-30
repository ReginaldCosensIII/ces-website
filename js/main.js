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

/* --------------------------------------------------
   Page-Specific: FAQ Dynamic Integration
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    if (document.body.classList.contains('faq-page')) {
        fetch('http://test.cesrebuild.com/api/seo/faqs')
            .then(function(response) {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Network response was not ok');
            })
            .then(function(data) {
                var script = document.createElement('script');
                script.type = 'application/ld+json';
                script.textContent = data;
                document.head.appendChild(script);
                console.log('Successfully injected dynamic FAQ schema.');

                var faqData = JSON.parse(data);
                var container = document.getElementById('dynamic-faq-container');
                if (container && faqData.mainEntity) {
                    faqData.mainEntity.forEach(function(item, index) {
                        var details = document.createElement('details');
                        details.className = 'faq-item';
                        if (index === 0) {
                            details.setAttribute('open', '');
                        }

                        var summary = document.createElement('summary');
                        summary.textContent = item.name + ' ';
                        var icon = document.createElement('span');
                        icon.className = 'faq-icon';
                        icon.setAttribute('aria-hidden', 'true');
                        summary.appendChild(icon);

                        var content = document.createElement('div');
                        content.className = 'faq-content';
                        // Assuming acceptedAnswer.text may contain paragraphs
                        content.innerHTML = item.acceptedAnswer.text;

                        details.appendChild(summary);
                        details.appendChild(content);
                        container.appendChild(details);
                    });
                    document.getElementById('dynamic-faq-container').classList.add('loaded');
                }
            })
            .catch(function(error) {
                console.error('Failed to fetch dynamic FAQ schema:', error);
            });
    }
});

/* --------------------------------------------------
   Page-Specific: Tech Tips Dynamic Integration
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
    if (document.body.classList.contains('tech-tips-page')) {
        fetch('http://test.cesrebuild.com/api/seo/techtips')
            .then(function(response) {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Network response was not ok');
            })
            .then(function(data) {
                var script = document.createElement('script');
                script.type = 'application/ld+json';
                script.textContent = data;
                document.head.appendChild(script);
                console.log('Successfully injected dynamic Tech Tips schema.');

                var techTipsData = JSON.parse(data);
                var container = document.getElementById('dynamic-techtips-container');
                if (container && techTipsData.itemListElement) {
                    techTipsData.itemListElement.forEach(function(listItem, index) {
                        var item = listItem.item;
                        var details = document.createElement('details');
                        details.className = 'faq-item';
                        if (index === 0) {
                            details.setAttribute('open', '');
                        }

                        var summary = document.createElement('summary');
                        summary.textContent = item.headline + ' ';
                        var icon = document.createElement('span');
                        icon.className = 'faq-icon';
                        icon.setAttribute('aria-hidden', 'true');
                        summary.appendChild(icon);

                        var content = document.createElement('div');
                        content.className = 'faq-content';
                        content.innerHTML = item.text;

                        details.appendChild(summary);
                        details.appendChild(content);
                        container.appendChild(details);
                    });
                    document.getElementById('dynamic-techtips-container').classList.add('loaded');
                }
            })
            .catch(function(error) {
                console.error('Failed to fetch dynamic Tech Tips schema:', error);
            });
    }
});