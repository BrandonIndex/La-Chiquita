document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Hours Logic --- */
    const statusBadge = document.getElementById('status-badge');
    const todayHoursText = document.getElementById('today-hours');

    function checkOpenStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, ...
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hours * 60 + minutes;

        // Schedule Data (in minutes from midnight)
        // Mon (1), Tue (2), Sun (0): 11:30-14:00 (690-840) & 19:30-23:00 (1170-1380)
        // Wed (3) - Sat (6): 11:30-14:30 (690-870) & 19:30-23:00 (1170-1380)

        let isOpen = false;
        let todaySchedule = "";

        // Determine today's schedule
        if (day === 1 || day === 2 || day === 0) {
            todaySchedule = "11:30 - 14:00 / 19:30 - 23:00";
            if ((currentTime >= 690 && currentTime < 840) || (currentTime >= 1170 && currentTime < 1380)) {
                isOpen = true;
            }
        } else {
            todaySchedule = "11:30 - 14:30 / 19:30 - 23:00";
            if ((currentTime >= 690 && currentTime < 870) || (currentTime >= 1170 && currentTime < 1380)) {
                isOpen = true;
            }
        }

        // Update UI
        todayHoursText.textContent = todaySchedule;

        if (isOpen) {
            statusBadge.textContent = "ABIERTO AHORA";
            statusBadge.classList.add('open');
            statusBadge.classList.remove('closed');
        } else {
            statusBadge.textContent = "CERRADO AHORA";
            statusBadge.classList.add('closed');
            statusBadge.classList.remove('open');
        }
    }

    // Run on load and every minute
    checkOpenStatus();
    setInterval(checkOpenStatus, 60000);


    /* --- 2. Mobile Menu Toggle --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });


    /* --- 3. Light/Dark Mode Toggle --- */
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = themeBtn.querySelector('i');

    function updateThemeIcon(isLight) {
        if (isLight) {
            // It's light mode, show Moon icon to switch to Dark
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            // It's dark mode, show Sun icon to switch to Light
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    // Check Local Storage Preference
    const savedTheme = localStorage.getItem('theme');

    // Default to Dark Mode unless Light Mode is explicitly saved
    // CSS Logic: body has no class = Dark Mode (default). body.light-mode = Light Mode.
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        updateThemeIcon(true);
    } else {
        body.classList.remove('light-mode');
        updateThemeIcon(false);
    }

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLightMode = body.classList.contains('light-mode');

        // Save preference
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');

        // Update Icon
        updateThemeIcon(isLightMode);
    });


    /* --- 4. Smooth Scroll for Anchor Links --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });


    /* --- 5. Intersection Observer for Animations --- */
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fade-in elements (Ensure CSS supports this or allow Animate.css to handle main ones)
    const animatedElements = document.querySelectorAll('.food-card, .review-card, .info-item, .service-card');
    animatedElements.forEach(el => {
        // Only apply manual animation styles if not using Animate.css classes directly
        if (!el.classList.contains('animate__animated')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        }
    });

});
