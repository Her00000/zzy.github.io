// Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    console.log('Academic Website Loaded');

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
            navbar.style.padding = '0.5rem 0';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1rem 0';
        }
    });

    // Constellation Effect
    const canvas = document.getElementById('constellation-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let stars = [];
        const numStars = 150; // Increased star count
        const maxDist = 120;

        function resize() {
            width = canvas.width = canvas.parentElement.offsetWidth;
            height = canvas.height = canvas.parentElement.offsetHeight;
        }

        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3; // Slower movement
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 2;
                this.opacity = Math.random();
                this.fadeSpeed = 0.005 + Math.random() * 0.01;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Twinkle effect
                this.opacity += this.fadeSpeed;
                if (this.opacity > 1 || this.opacity < 0.2) {
                    this.fadeSpeed = -this.fadeSpeed;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(0, 243, 255, ${this.opacity})`; // Cyan stars
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            resize();
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push(new Star());
            }
            animate();
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw lines
            ctx.lineWidth = 0.5;
            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    const dx = stars[i].x - stars[j].x;
                    const dy = stars[i].y - stars[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        ctx.beginPath();
                        // Gradient line
                        const gradient = ctx.createLinearGradient(stars[i].x, stars[i].y, stars[j].x, stars[j].y);
                        gradient.addColorStop(0, `rgba(0, 243, 255, ${stars[i].opacity * 0.2})`);
                        gradient.addColorStop(1, `rgba(188, 19, 254, ${stars[j].opacity * 0.2})`);
                        ctx.strokeStyle = gradient;
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Update and draw stars
            stars.forEach(star => {
                star.update();
                star.draw();
            });

            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resize);
        init();

        // Mouse interaction
        let mouse = { x: null, y: null };
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Add mouse to stars for interaction
        // Modified animate loop to include mouse interaction
        const originalAnimate = animate;
        animate = function () {
            ctx.clearRect(0, 0, width, height);

            // Draw lines between stars
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.lineWidth = 0.5;
            for (let i = 0; i < stars.length; i++) {
                for (let j = i + 1; j < stars.length; j++) {
                    const dx = stars[i].x - stars[j].x;
                    const dy = stars[i].y - stars[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        ctx.beginPath();
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.stroke();
                    }
                }

                // Draw lines to mouse
                if (mouse.x !== null) {
                    const dx = stars[i].x - mouse.x;
                    const dy = stars[i].y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxDist) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)'; // Purple glow for mouse
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }

            // Update and draw stars
            stars.forEach(star => {
                star.update();
                star.draw();
            });

            requestAnimationFrame(animate);
        }
    }
});
