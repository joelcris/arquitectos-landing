document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Navigation ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const horizontalNav = document.querySelector('.horizontal-nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            horizontalNav.classList.toggle('active');
            // Change icon between bars and times
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking on a nav link
        const navLinks = document.querySelectorAll('.horizontal-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    horizontalNav.classList.remove('active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!horizontalNav.contains(e.target) && !mobileMenuToggle.contains(e.target) && horizontalNav.classList.contains('active')) {
                horizontalNav.classList.remove('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Vertical Navigation & Section Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const verticalNav = document.querySelector('.vertical-nav');
    const navDots = document.querySelectorAll('.nav-dot');
    const backToTopButton = document.getElementById('back-to-top');
    const pageTransition = document.querySelector('.page-transition');
    
    // Show vertical nav after scrolling past hero
    function toggleVerticalNav() {
        if (window.scrollY > window.innerHeight * 0.7) {
            verticalNav.style.display = 'block';
        } else {
            verticalNav.style.display = 'none';
        }
    }
    
    // Show back to top button after scrolling
    function toggleBackToTopButton() {
        if (window.scrollY > window.innerHeight) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    // Update active section in vertical nav
    function highlightNavigation() {
        let scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navDots.forEach(dot => {
                    dot.classList.remove('active');
                    if (dot.getAttribute('href') === '#' + sectionId) {
                        dot.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Parallax scrolling effect for hero
    function parallaxScroll() {
        const parallaxBg = document.querySelector('.hero-parallax-bg');
        if (parallaxBg) {
            const scrollY = window.scrollY;
            parallaxBg.style.transform = `translateY(${scrollY * 0.4}px)`;
        }
    }
    
    // Scroll event handling
    window.addEventListener('scroll', function() {
        toggleVerticalNav();
        toggleBackToTopButton();
        highlightNavigation();
        parallaxScroll();
    });
    
    // Back to top button click
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            // Add transition effect
            pageTransition.classList.add('active');
            
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                setTimeout(() => {
                    pageTransition.classList.remove('active');
                }, 500);
            }, 300);
        });
    }
    
    // Page section transitions
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#') && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Show transition overlay
                    pageTransition.classList.add('active');
                    
                    setTimeout(() => {
                        // Calculate position accounting for header height
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        
                        // Scroll to target
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Hide transition overlay after a delay
                        setTimeout(() => {
                            pageTransition.classList.remove('active');
                        }, 500);
                    }, 300);
                }
            }
        });
    });

    // --- Footer Year ---
    const currentYear = new Date().getFullYear();
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = currentYear;
    }

    // --- Lightbox & Carousel ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const galleryThumbnails = document.querySelectorAll('.gallery-item img');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    let currentImageIndex = 0;
    let galleryData = []; // To store {fullSrc: '...', alt: '...'} for each image

    // Populate galleryData array
    galleryThumbnails.forEach((thumbnail, index) => {
        const fullSrc = thumbnail.getAttribute('data-full');
        const altText = thumbnail.getAttribute('alt');
        if (fullSrc) {
            galleryData.push({ fullSrc: fullSrc, alt: altText });

            // Add click listener to each thumbnail
            thumbnail.addEventListener('click', () => {
                // Show transition before opening lightbox
                pageTransition.classList.add('active');
                
                setTimeout(() => {
                    openLightbox(index);
                    pageTransition.classList.remove('active');
                }, 300);
            });
        } else {
             console.warn(`Gallery item at index ${index} is missing data-full attribute.`);
        }
    });

    // Function to open the lightbox at a specific index
    function openLightbox(index) {
        if (!lightbox || !lightboxImg || galleryData.length === 0) return;

        currentImageIndex = index;
        showImage(currentImageIndex);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Function to display the image at the given index
    function showImage(index) {
        if (index < 0 || index >= galleryData.length) {
             console.error("Invalid image index requested:", index);
             return;
        }
        lightboxImg.classList.add('loading');

        setTimeout(() => {
            lightboxImg.setAttribute('src', galleryData[index].fullSrc);
            lightboxImg.setAttribute('alt', galleryData[index].alt || 'Vista ampliada del proyecto');
            lightboxImg.classList.remove('loading');
        }, 50);
    }

    // Function to change the image (direction: 1 for next, -1 for prev)
    function changeImage(direction) {
        currentImageIndex += direction;

        if (currentImageIndex >= galleryData.length) {
            currentImageIndex = 0;
        } else if (currentImageIndex < 0) {
            currentImageIndex = galleryData.length - 1;
        }
        showImage(currentImageIndex);
    }

    // Function to close the lightbox
    function closeLightbox() {
         if(lightbox) {
            // Add transition effect
            pageTransition.classList.add('active');
            
            setTimeout(() => {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
                
                setTimeout(() => {
                    pageTransition.classList.remove('active');
                }, 300);
            }, 200);
         }
    }

    // Add Event Listeners if elements exist
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', () => changeImage(-1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => changeImage(1));
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
               closeLightbox();
            }
        });
    }

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                changeImage(1);
            } else if (e.key === 'ArrowLeft') {
                changeImage(-1);
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });

    // --- Progressive Image Loading ---
    function loadImagesProgressively() {
        const imgs = document.querySelectorAll('img');
        
        imgs.forEach(img => {
            // Skip images that don't need lazy loading
            if (img.classList.contains('lightbox-content')) return;
            
            // Create and configure the IntersectionObserver
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Start with low opacity
                        img.style.opacity = '0.3';
                        
                        // Load the image
                        img.onload = () => {
                            // Fade in when loaded
                            img.style.transition = 'opacity 0.5s ease';
                            img.style.opacity = '1';
                        };
                        
                        // Disconnect after loading
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(img);
        });
    }
    
    loadImagesProgressively();

    // --- Enhanced Intersection Observer for Fade-in Animation ---
    const fadeElements = document.querySelectorAll('.fade-in-element');
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add a slight delay for staggered effect
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, 150);
                } else {
                    // Optional: Hide elements when they scroll out of view
                    // entry.target.classList.remove('is-visible');
                }
            });
        }, { 
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px' // Trigger slightly before element is in view
        });
        fadeElements.forEach(el => observer.observe(el));
    } else {
        console.warn('IntersectionObserver not supported, animations disabled.');
        fadeElements.forEach(el => {
            el.classList.add('is-visible');
            el.style.transform = 'translateY(0)';
            el.style.opacity = '1';
        });
    }

    // Initial calls
    toggleVerticalNav();
    toggleBackToTopButton();
    highlightNavigation();

    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        // Handle both click and touch events for better mobile support
        ['click', 'touchend'].forEach(eventType => {
            scrollIndicator.addEventListener(eventType, function(e) {
                // Prevent default touch behavior
                if (e.type === 'touchend') {
                    e.preventDefault();
                }
                
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    // Show transition overlay
                    pageTransition.classList.add('active');
                    
                    setTimeout(() => {
                        // Calculate position accounting for header height
                        const headerHeight = document.querySelector('header').offsetHeight;
                        const targetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                        
                        // Scroll to target
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Hide transition overlay after a delay
                        setTimeout(() => {
                            pageTransition.classList.remove('active');
                        }, 500);
                    }, 300);
                }
            });
        });

        // Prevent touchmove to avoid scrolling while touching the indicator
        scrollIndicator.addEventListener('touchmove', function(e) {
            e.preventDefault();
        });
    }
}); // End of DOMContentLoaded listener