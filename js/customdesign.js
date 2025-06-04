// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements
    const animatedElements = {
        '.product-item': 'fade-in-up',
        '.timeline-item': 'fade-in-side',
        '.value-item': 'fade-in-up',
        '.team-image': 'fade-in-up',
        '.goal-item': 'fade-in-side',
        '.commitment-item': 'fade-in-side'
    };
    
    // Apply animations to elements on scroll
    for (const [selector, animation] of Object.entries(animatedElements)) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            animateOnScroll(elements, animation);
        }
    }
    
    // Values hover effect
    const valueItems = document.querySelectorAll('.value-item');
    valueItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('value-hover');
        });
        item.addEventListener('mouseleave', function() {
            this.classList.remove('value-hover');
        });
    });
    
    // Product items hover effect
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('product-hover');
        });
        item.addEventListener('mouseleave', function() {
            this.classList.remove('product-hover');
        });
    });
    
    // Team image hover effect
    const teamImages = document.querySelectorAll('.team-image');
    teamImages.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.classList.add('team-image-hover');
        });
        image.addEventListener('mouseleave', function() {
            this.classList.remove('team-image-hover');
        });
    });
});

// Function to handle scroll animations
function animateOnScroll(elements, animationClass) {
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay for staggered animation effect
                setTimeout(() => {
                    entry.target.classList.add(animationClass);
                }, Math.random() * 300);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe each element
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Add smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80, // Adjust for header height
                behavior: 'smooth'
            });
        }
    });
});

// Optional: Add a scroll-to-top button
function addScrollToTopButton() {
    const button = document.createElement('button');
    button.innerText = '↑';
    button.className = 'scroll-to-top';
    button.title = 'Scroll to top';
    document.body.appendChild(button);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    // Scroll to top when clicked
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Call this function if you want to add a scroll-to-top button
// addScrollToTopButton();