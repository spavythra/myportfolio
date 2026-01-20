// Navigation active state
const navLinks = document.querySelectorAll('.aside .nav li a');

// Update active state on click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(ele => ele.classList.remove('active'));
        link.classList.add('active');
    })
});

// Update active state on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Project Filtering
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card-wrapper');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');

                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Filter projects
                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.classList.add('hide');
                        }, 300);
                    }
                });
            });
        });
    }

    // Metrics Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        let current = +counter.innerText;
        const increment = target / speed;
        const hasDecimal = target % 1 !== 0;

        if (current < target) {
            current = Math.min(current + increment, target);
            counter.innerText = hasDecimal ? current.toFixed(1) : Math.ceil(current);
            setTimeout(() => animateCounter(counter), 10);
        } else {
            counter.innerText = hasDecimal ? target.toFixed(1) : target + '+';
        }
    };

    // Skills Bar Animation (Progressive Enhancement)
    // The bars are already visible via CSS, this just adds smooth animation
    const animateSkills = () => {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            const progressBar = item.querySelector('.skill-progress');
            if (progressBar) {
                // Temporarily set to 0 to trigger animation
                const finalWidth = progressBar.style.width || getComputedStyle(progressBar).width;
                progressBar.style.width = '0';

                setTimeout(() => {
                    const percent = item.getAttribute('data-percent');
                    progressBar.style.width = percent + '%';
                    progressBar.classList.add('animated');
                }, 100 + (index * 50));
            }
        });
    };

    // Use Intersection Observer for animation on scroll
    const skillsObserverCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    };

    const skillsObserver = new IntersectionObserver(skillsObserverCallback, {
        threshold: 0.2,
        rootMargin: '0px'
    });

    const skillsContainer = document.querySelector('.skills-container');
    if (skillsContainer) {
        skillsObserver.observe(skillsContainer);
    }

    // Trigger counter animation immediately on load
    if (counters.length > 0) {
        counters.forEach(counter => {
            counter.innerText = '0';
            setTimeout(() => animateCounter(counter), 100);
        });
    }
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Visitor Counter - Simple localStorage based counter
function updateVisitorCount() {
    const visitorCountElement = document.getElementById('visitor-count');
    const updateDateElement = document.getElementById('update-date');

    if (visitorCountElement) {
        // Get or initialize visitor count
        let count = localStorage.getItem('visitorCount');
        if (!count) {
            count = Math.floor(Math.random() * 500) + 100; // Start with random number 100-600
        } else {
            count = parseInt(count);
        }

        // Check if this is a new session (not visited in last 30 minutes)
        const lastVisit = localStorage.getItem('lastVisit');
        const now = Date.now();

        if (!lastVisit || (now - parseInt(lastVisit)) > 1800000) { // 30 minutes
            count++;
            localStorage.setItem('visitorCount', count);
        }

        localStorage.setItem('lastVisit', now);

        // Display count with animation
        let currentCount = 0;
        const increment = count / 50;
        const timer = setInterval(() => {
            currentCount += increment;
            if (currentCount >= count) {
                visitorCountElement.textContent = count.toLocaleString();
                clearInterval(timer);
            } else {
                visitorCountElement.textContent = Math.floor(currentCount).toLocaleString();
            }
        }, 20);
    }

    // Update date to today
    if (updateDateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        updateDateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', updateVisitorCount);
