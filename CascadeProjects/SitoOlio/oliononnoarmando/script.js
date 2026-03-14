/**
 * Arte & Anima - JavaScript
 */

// 1. Gestione Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        // Aggiungiamo un leggero delay per rendere fluido l'ingresso
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            
            // Forza trigger onscroll iniziale per le animazioni reveal gia' in view
            handleScroll();
        }, 500);
    }
});

// Elem. DOM principali
const header = document.getElementById('navbar');
const mobileMenu = document.getElementById('mobile-menu');
const navLinksContainer = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-link');

// 2. Gestione Header Sticky "Scrolled"
function handleScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', handleScroll);

// 3. Gestione Hamburger Menu Mobile
if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });
}

// Chiusura menu cliccando su un link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navLinksContainer.classList.remove('active');
        }
    });
});

// 4. Smooth Scrolling con calcolo dell'altezza dell'header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Ignora href="#" vuoti
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // Calcola l'altezza dell'header e sottrae per evitare coperture
            const headerHeight = header.offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// 5. Animazioni allo scroll (IntersectionObserver)
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
    root: null, // viewport
    rootMargin: '0px 0px -100px 0px', // trigger quando l'elemento e' 100px sopra il bottom
    threshold: 0.15 // trigger quando 15% dell'elemento e' visibile
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Smetti di osservare dopo che e' animato una volta se vogliamo che resti tale
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});

// 6. Gestione Audio dei Video
const audioToggleBtns = document.querySelectorAll('.audio-toggle-btn');

audioToggleBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-video-target');
        const video = document.getElementById(targetId);
        const icon = this.querySelector('i');
        
        if (video) {
            video.muted = !video.muted;
            
            if (video.muted) {
                icon.className = 'fa-solid fa-volume-xmark';
                this.innerHTML = `${icon.outerHTML} Audio`;
            } else {
                icon.className = 'fa-solid fa-volume-high';
                this.innerHTML = `${icon.outerHTML} Muto`;
            }
        }
    });
});
