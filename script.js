document.addEventListener('DOMContentLoaded', function() {

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
                openLightbox(index);
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
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
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

    // --- Smooth scrolling for navigation links ---
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Add some offset to account for fixed header
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

}); // End of DOMContentLoaded listener