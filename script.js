document.addEventListener('DOMContentLoaded', function() {
    
    // -------------------------
    // 1. Lenis Smooth Scrolling
    // -------------------------
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP with Lenis
    gsap.ticker.add((time) => { lenis.raf(time * 1000) });
    gsap.ticker.lagSmoothing(0);

    // -------------------------
    // 2. Custom Cursor Logic
    // -------------------------
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const hoverTargets = document.querySelectorAll('.hover-target, a, button');

    // Follow mouse
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        // Dot follows instantly
        if(cursorDot) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
        }

        // Outline follows with slight delay for smooth feel
        if(cursorOutline) {
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        }
    });

    // Hover state expanding
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        target.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // -------------------------
    // 3. GSAP Animations
    // -------------------------
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Reveal
    const heroTl = gsap.timeline();
    heroTl.fromTo(".hero-text", 
        { opacity: 0, y: 50, filter: "blur(10px)" }, 
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power3.out", delay: 0.2 }
    )
    .fromTo(".hero-subtext", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=1"
    )
    .fromTo(".hero-buttons", 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.8"
    );

    // Scroll Fade-Up Elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%", 
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Parallax Videos inside containers
    const parallaxContainers = document.querySelectorAll('.parallax-container');
    parallaxContainers.forEach(container => {
        const media = container.querySelector('.parallax-media');
        gsap.to(media, {
            yPercent: 20, // Moves the image down slightly as you scroll down
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top bottom", 
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Navbar Blur Effect on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-black/60', 'py-3');
            navbar.classList.remove('py-4', 'bg-white/5');
        } else {
            navbar.classList.remove('bg-black/60', 'py-3');
            navbar.classList.add('py-4', 'bg-white/5');
        }
    });

    // -------------------------
    // 4. FAQ Accordion Logic
    // -------------------------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const toggle = item.querySelector('.faq-toggle');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.material-symbols-outlined');

        toggle.addEventListener('click', () => {
            const isOpen = content.style.maxHeight;

            // Close all others
            faqItems.forEach(otherItem => {
                otherItem.querySelector('.faq-content').style.maxHeight = null;
                otherItem.querySelector('.material-symbols-outlined').style.transform = 'rotate(0deg)';
            });

            // Open clicked if it wasn't already open
            if (!isOpen) {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.style.transform = 'rotate(45deg)'; // turn plus into X
            }
        });
    });

    // -------------------------
    // 5. HLS.js Video Logic
    // -------------------------
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        const sourceElement = video.querySelector('source');
        const src = sourceElement ? sourceElement.src : null;
        if (!src) return;

        if (src.includes('.m3u8')) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
            } else if (typeof Hls !== 'undefined' && Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(src);
                hls.attachMedia(video);
            }
        }
    });

    // -------------------------
    // 6. Modal Logic
    // -------------------------
    const modal = document.getElementById('inquireModal');
    const modalContent = document.getElementById('inquireModalContent');
    const closeBtn = document.getElementById('closeModal');
    const inquireTriggers = document.querySelectorAll('.inquire-trigger');

    function openModal() {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
        lenis.stop(); // Stop smooth scroll
    }

    function closeModal() {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');
        lenis.start(); // Resume smooth scroll
    }

    inquireTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('opacity-0')) {
            closeModal();
        }
    });
});