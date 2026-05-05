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

function getSafeEmbedUrl(url) {
    if (!url) return null;
    let match;
    // YouTube
    match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
    }
    // Vimeo
    match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|)(\d+)(?:$|\/|\?)/);
    if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}`;
    }
    return null;
}

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
document.addEventListener('DOMContentLoaded', async function () {
    if (document.body.classList.contains('faq-page')) {
        try {
            const response = await fetch('http://test.cesrebuild.com/api/seo/faqs');
            if (!response.ok) {
                throw new Error(response.status);
            }
            
            const data = await response.text();
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
                container.classList.add('loaded');
            }
        } catch (error) {
            console.error('Data Fetch Error:', error);
            var container = document.getElementById('dynamic-faq-container');
            if (container) {
                container.innerHTML = "<div class='ces-error-state text-center p-4' style='border: 1px solid var(--border-color); border-radius: 8px;'><p>Content is temporarily unavailable. Please check back shortly.</p></div>";
            }
        }
    }
});

/* --------------------------------------------------
   Page-Specific: Tech Tips Dynamic Integration
-------------------------------------------------- */
document.addEventListener('DOMContentLoaded', async function () {
    if (document.body.classList.contains('tech-tips-page')) {
        try {
            const response = await fetch('http://test.cesrebuild.com/api/seo/techtips');
            if (!response.ok) {
                throw new Error(response.status);
            }
            
            const data = await response.text();
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

                    // Video embed integration
                    if (item.video && item.video.embedUrl) {
                        const safeEmbedUrl = getSafeEmbedUrl(item.video.embedUrl);
                        if (safeEmbedUrl) {
                            var videoWrapper = document.createElement('div');
                            videoWrapper.className = 'video-container';
                            var iframe = document.createElement('iframe');
                            iframe.title = "Tech Tip Video";
                            iframe.allowFullscreen = true;
                            
                            if (index === 0) {
                                iframe.src = safeEmbedUrl;
                            } else {
                                iframe.dataset.src = safeEmbedUrl;
                                details.addEventListener('toggle', function() {
                                    if (details.open && !iframe.src) {
                                        requestAnimationFrame(() => {
                                            iframe.src = iframe.dataset.src;
                                        });
                                    }
                                });
                            }
                            
                            videoWrapper.appendChild(iframe);
                            content.appendChild(videoWrapper);
                        }
                    }

                    container.appendChild(details);
                });
                container.classList.add('loaded');
            }
        } catch (error) {
            console.error('Data Fetch Error:', error);
            var container = document.getElementById('dynamic-techtips-container');
            if (container) {
                container.innerHTML = "<div class='ces-error-state text-center p-4' style='border: 1px solid var(--border-color); border-radius: 8px;'><p>Content is temporarily unavailable. Please check back shortly.</p></div>";
            }
        }
    }
});