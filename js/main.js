/* ============================================
   HOTPARKS — Main JavaScript
   Interactions, animations, and utilities
   ============================================ */

(function () {
    'use strict';

    // --- DOM Ready ---
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavigation();
        initScrollReveal();
        initCounterAnimation();
        initRingAnimation();
        initSmoothScroll();
    }

    // ============================================
    // NAVIGATION
    // ============================================
    function initNavigation() {
        var nav = document.getElementById('nav');
        var burger = document.getElementById('navBurger');
        var mobileMenu = document.getElementById('mobileMenu');
        var isMenuOpen = false;

        if (!nav) return;

        // Scroll detection for nav background
        var lastScrollY = 0;
        var ticking = false;

        function onScroll() {
            lastScrollY = window.scrollY;
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    if (lastScrollY > 60) {
                        nav.classList.add('nav--scrolled');
                    } else {
                        nav.classList.remove('nav--scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        // Run once on load
        onScroll();

        // Mobile menu toggle
        if (burger && mobileMenu) {
            burger.addEventListener('click', function () {
                isMenuOpen = !isMenuOpen;
                burger.classList.toggle('nav__burger--active', isMenuOpen);
                mobileMenu.classList.toggle('mobile-menu--open', isMenuOpen);
                document.body.style.overflow = isMenuOpen ? 'hidden' : '';
            });

            // Close menu when clicking a link
            var mobileLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
            mobileLinks.forEach(function (link) {
                link.addEventListener('click', function () {
                    isMenuOpen = false;
                    burger.classList.remove('nav__burger--active');
                    mobileMenu.classList.remove('mobile-menu--open');
                    document.body.style.overflow = '';
                });
            });

            // Close on escape key
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && isMenuOpen) {
                    isMenuOpen = false;
                    burger.classList.remove('nav__burger--active');
                    mobileMenu.classList.remove('mobile-menu--open');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    function initScrollReveal() {
        // Elements to reveal on scroll
        var revealSelectors = [
            '.section-header',
            '.heat-index__card',
            '.category-card',
            '.park-card',
            '.vibe-card',
            '.nearby__content',
            '.nearby__visual',
            '.itinerary-card',
            '.underrated__card',
            '.passport__visual',
            '.passport__content',
            '.question-card',
            '.months-banner__inner',
            '.safety__content',
            '.safety__visual',
            '.newsletter__inner'
        ];

        var elements = document.querySelectorAll(revealSelectors.join(', '));

        elements.forEach(function (el) {
            el.classList.add('reveal');
        });

        // Add staggered delays to grid children
        var gridContainers = document.querySelectorAll(
            '.heat-index__grid, .categories__grid, .featured__grid, .vibes__grid, .itineraries__grid, .underrated__grid, .passport__badges, .questions__grid'
        );

        gridContainers.forEach(function (grid) {
            var children = grid.children;
            for (var i = 0; i < children.length; i++) {
                var delay = Math.min(i, 4);
                children[i].classList.add('reveal--delay-' + delay);
            }
        });

        // Intersection Observer for reveal
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal--visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            elements.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            // Fallback: show everything
            elements.forEach(function (el) {
                el.classList.add('reveal--visible');
            });
        }
    }

    // ============================================
    // COUNTER ANIMATION (Hero stats)
    // ============================================
    function initCounterAnimation() {
        var counters = document.querySelectorAll('[data-count]');
        if (counters.length === 0) return;

        function animateCounter(el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var duration = 2000;
            var startTime = null;
            var startValue = 0;

            function easeOutCubic(t) {
                return 1 - Math.pow(1 - t, 3);
            }

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var easedProgress = easeOutCubic(progress);
                var current = Math.floor(startValue + (target - startValue) * easedProgress);

                el.textContent = current.toLocaleString();

                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    el.textContent = target.toLocaleString();
                }
            }

            window.requestAnimationFrame(step);
        }

        if ('IntersectionObserver' in window) {
            var counterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        counterObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5
            });

            counters.forEach(function (counter) {
                counterObserver.observe(counter);
            });
        } else {
            counters.forEach(animateCounter);
        }
    }

    // ============================================
    // RING ANIMATION (Heat Index score rings)
    // ============================================
    function initRingAnimation() {
        var rings = document.querySelectorAll('.heat-index__ring-progress');
        if (rings.length === 0) return;

        function animateRing(el) {
            var progress = parseInt(el.getAttribute('data-progress'), 10);
            var circumference = 2 * Math.PI * 54; // r = 54
            var offset = circumference - (circumference * progress / 100);

            el.style.strokeDasharray = circumference;
            el.style.strokeDashoffset = circumference;

            // Trigger animation after a short delay
            setTimeout(function () {
                el.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                el.style.strokeDashoffset = offset;
            }, 200);
        }

        if ('IntersectionObserver' in window) {
            var ringObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateRing(entry.target);
                        ringObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5
            });

            rings.forEach(function (ring) {
                ringObserver.observe(ring);
            });
        } else {
            rings.forEach(animateRing);
        }
    }

    // ============================================
    // SMOOTH SCROLL (for anchor links)
    // ============================================
    function initSmoothScroll() {
        var links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function (link) {
            link.addEventListener('click', function (e) {
                var href = this.getAttribute('href');
                if (href === '#') return;

                var target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                var navHeight = document.getElementById('nav') ? document.getElementById('nav').offsetHeight : 0;
                var targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

})();
