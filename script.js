/* 
   INTERACTIVIDAD Y ANIMACIONES - R.U. LIMPIEZA TEMUCO
   JavaScript Puro (Vanilla JS)
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MENÚ MÓVIL (TOGGLE HAMBURGER)
    // ==========================================
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const hamburgerBars = document.querySelectorAll('.hamburger-bar');

    if (mobileNavToggle && mobileMenu) {
        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.toggle('open');
            
            // Animación del botón hamburguesa
            if (isOpen) {
                hamburgerBars[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                hamburgerBars[1].style.opacity = '0';
                hamburgerBars[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                hamburgerBars[0].style.transform = 'none';
                hamburgerBars[1].style.opacity = '1';
                hamburgerBars[2].style.transform = 'none';
            }
        });

        // Cerrar menú al hacer click en cualquier link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamburgerBars[0].style.transform = 'none';
                hamburgerBars[1].style.opacity = '1';
                hamburgerBars[2].style.transform = 'none';
            });
        });

        // Cerrar menú si se hace click fuera de él
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                mobileMenu.classList.remove('open');
                hamburgerBars[0].style.transform = 'none';
                hamburgerBars[1].style.opacity = '1';
                hamburgerBars[2].style.transform = 'none';
            }
        });
    }

    // ==========================================
    // 2. STICKY HEADER EN SCROLL
    // ==========================================
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);
    // Ejecutar una vez al cargar por si parte con scroll
    handleScroll();

    // ==========================================
    // 3. COMPARADOR ANTES/DESPUÉS INTERACTIVO
    // ==========================================
    const slider = document.querySelector('.before-after-slider');
    
    if (slider) {
        let isDragging = false;

        const updateSliderPosition = (clientX) => {
            const rect = slider.getBoundingClientRect();
            // Calcular porcentaje respecto al ancho del slider
            let percentage = ((clientX - rect.left) / rect.width) * 100;

            // Clampear entre 0% y 100% con un pequeño margen para no perder el handle
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;

            // Setear la propiedad personalizada CSS
            slider.style.setProperty('--slider-pos', `${percentage}%`);
        };

        // Eventos Mouse
        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSliderPosition(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSliderPosition(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Eventos Touch (Móviles)
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            // Prevent default para evitar scroll mientras se desliza en móvil
            if (e.cancelable) e.preventDefault();
            updateSliderPosition(e.touches[0].clientX);
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            updateSliderPosition(e.touches[0].clientX);
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // ==========================================
    // 4. ANIMACIONES SCROLL REVEAL (INTERSECTION OBSERVER)
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-active');
                    // Una vez revelado, dejamos de observarlo para rendimiento
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.1, // Se activa cuando el 10% del elemento es visible
            rootMargin: '0px 0px -50px 0px' // Margen inferior para retrasar un poco la aparición
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback si el navegador es muy antiguo: mostrar todo de inmediato
        revealElements.forEach(element => {
            element.classList.add('reveal-active');
        });
    }

    // ==========================================
    // 5. SCROLLSPY (NAVEGACIÓN ACTIVA DINÁMICA)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    const updateActiveLink = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Compensación de header + margen

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Inicializar al cargar
});
