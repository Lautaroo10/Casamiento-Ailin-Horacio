document.getElementById('splash').addEventListener('click', () => {
    const splash = document.getElementById('splash');
    const content = document.getElementById('content');

    splash.classList.add('hidden');
    content.classList.add('visible');

    // cuando termina la transición, libera el scroll y saca el splash del DOM
    splash.addEventListener('transitionend', () => {
        splash.style.display = 'none';
        document.body.style.overflowY = 'auto';
    }, { once: true });
});

// --- Carrusel Deslizable ---
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('carouselContainer');
    const track = document.getElementById('carouselTrack');

    if (!container || !track) return;

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationId = null;

    // Disable transition while dragging for smooth movement
    function setSliderPosition() {
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function getMaxScroll() {
        return -(track.scrollWidth - container.offsetWidth);
    }

    function clamp(value) {
        return Math.max(getMaxScroll(), Math.min(0, value));
    }

    function animation() {
        setSliderPosition();
        if (isDragging) {
            animationId = requestAnimationFrame(animation);
        }
    }

    // --- Touch events ---
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        prevTranslate = currentTranslate;
        track.style.transition = 'none';
        animationId = requestAnimationFrame(animation);
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        currentTranslate = clamp(prevTranslate + diff);
    }, { passive: true });

    container.addEventListener('touchend', () => {
        isDragging = false;
        cancelAnimationFrame(animationId);
        track.style.transition = 'transform 0.35s ease-out';
        currentTranslate = clamp(currentTranslate);
        setSliderPosition();
    });

    // --- Mouse events (desktop) ---
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        prevTranslate = currentTranslate;
        track.style.transition = 'none';
        animationId = requestAnimationFrame(animation);
        e.preventDefault();
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = currentX - startX;
        currentTranslate = clamp(prevTranslate + diff);
    });

    container.addEventListener('mouseup', () => {
        isDragging = false;
        cancelAnimationFrame(animationId);
        track.style.transition = 'transform 0.35s ease-out';
        currentTranslate = clamp(currentTranslate);
        setSliderPosition();
    });

    container.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            cancelAnimationFrame(animationId);
            track.style.transition = 'transform 0.35s ease-out';
            currentTranslate = clamp(currentTranslate);
            setSliderPosition();
        }
    });
});