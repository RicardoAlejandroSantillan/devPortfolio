document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Carrusel de Proyectos Personales
    new InfiniteCarousel({
        trackSelector: '.carousel-personal-project-track',
        cardSelector: '.carousel-personal-project-card',
        prevBtnSelector: '.carousel-personal-project-arrow.left',
        nextBtnSelector: '.carousel-personal-project-arrow.right',
        paginationContainer: '.carousel-personal-project-pagination'
    });

    // Inicializar Carrusel de Trabajo Profesional
    new InfiniteCarousel({
        trackSelector: '.carousel-professional-work-track',
        cardSelector: '.carousel-professional-work-card',
        prevBtnSelector: '.carousel-professional-work-arrow.left',
        nextBtnSelector: '.carousel-professional-work-arrow.right',
        paginationContainer: '.carousel-professional-work-pagination'
    });
});

class InfiniteCarousel {
    constructor({ trackSelector, cardSelector, prevBtnSelector, nextBtnSelector, paginationContainer }) {
        this.track = document.querySelector(trackSelector);
        this.originalCards = document.querySelectorAll(cardSelector);
        this.prevBtn = document.querySelector(prevBtnSelector);
        this.nextBtn = document.querySelector(nextBtnSelector);

        // Paginación
        this.currentSpan = document.querySelector(`${paginationContainer} .current`);
        this.totalSpan = document.querySelector(`${paginationContainer} .total`);

        if (!this.track || this.originalCards.length === 0) return;

        // Configuración Base
        this.totalOriginal = this.originalCards.length;
        this.visibleSlides = 3.5;
        // Aumentamos clones para permitir deslizamientos largos sin ver espacios vacíos
        this.clonesCount = Math.max(this.totalOriginal, Math.ceil(this.visibleSlides) + 3);
        this.currentIndex = this.clonesCount;
        this.isTransitioning = false;
        this.slideWidth = 0;

        // Variables para Touch/Drag
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.animationID = 0;
        this.currentPosition = 0;
        this.hasMoved = false;

        this.init();
    }

    init() {
        if (this.totalSpan) this.totalSpan.textContent = this.totalOriginal;
        this.createClones();
        this.updateDimensions();

        this.nextBtn.addEventListener('click', () => this.move('next'));
        this.prevBtn.addEventListener('click', () => this.move('prev'));

        this.track.addEventListener('transitionend', () => this.handleTransitionEnd());

        window.addEventListener('resize', () => {
            this.updateDimensions();
            this.updatePosition(false);
        });

        const resizeObserver = new ResizeObserver(() => {
            this.updateDimensions();
            this.updatePosition(false);
        });
        resizeObserver.observe(this.track);

        this.addTouchEvents();
        this.setupCardClickListeners();
    }

    createClones() {
        // Clones al final
        for (let i = 0; i < this.clonesCount; i++) {
            const clone = this.originalCards[i % this.totalOriginal].cloneNode(true);
            clone.classList.add('clone');
            this.track.appendChild(clone);
        }

        // Clones al principio
        for (let i = 0; i < this.clonesCount; i++) {
            const index = (this.totalOriginal - 1 - (i % this.totalOriginal));
            // Corrección de índice para evitar negativos en bucles grandes
            const safeIndex = ((index % this.totalOriginal) + this.totalOriginal) % this.totalOriginal;
            const clone = this.originalCards[safeIndex].cloneNode(true);
            clone.classList.add('clone');
            this.track.insertBefore(clone, this.track.firstChild);
        }

        this.allSlides = this.track.children;
    }

    updateDimensions() {
        const firstCard = this.originalCards[0];
        if (!firstCard) return;

        const cardStyle = window.getComputedStyle(firstCard);
        const trackStyle = window.getComputedStyle(this.track);
        const cardWidth = firstCard.getBoundingClientRect().width;
        const gap = parseFloat(trackStyle.gap) || 15;

        this.slideWidth = cardWidth + gap;

        if (!this.isDragging) {
            this.updatePosition(false);
        }
    }

    move(direction) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        if (direction === 'next') this.currentIndex++;
        else this.currentIndex--;

        this.updatePosition(true);
        this.updatePagination();
    }

    updatePosition(animate = true) {
        this.currentPosition = -this.currentIndex * this.slideWidth;
        if (!animate) this.track.style.transition = 'none';
        this.setSliderPosition(this.currentPosition);
    }

    setSliderPosition(pos) {
        this.track.style.transform = `translate3d(${pos}px, 0, 0)`;
    }

    handleTransitionEnd() {
        this.isTransitioning = false;

        // saltos múltiples
        // recalculamos movimiento
        if (this.currentIndex >= this.totalOriginal + this.clonesCount) {
            const diff = this.currentIndex - (this.totalOriginal + this.clonesCount);
            this.currentIndex = this.clonesCount + diff;
            this.updatePosition(false);
        } else if (this.currentIndex < this.clonesCount - this.totalOriginal) {
            const diff = (this.clonesCount - this.totalOriginal) - this.currentIndex;
            this.currentIndex = (this.totalOriginal + this.clonesCount) - diff;
            this.updatePosition(false);
        } else if (this.currentIndex >= this.totalOriginal + this.clonesCount) {
            this.currentIndex = this.clonesCount;
            this.updatePosition(false);
        } else if (this.currentIndex < this.clonesCount) {
            this.currentIndex = this.totalOriginal + this.currentIndex; // Ajuste relativo
            if (this.currentIndex < this.clonesCount) {
                this.currentIndex = this.totalOriginal + this.clonesCount - (this.clonesCount - this.currentIndex);
            }
            this.updatePosition(false);
        }

        // Refuerzo simple para el bucle estándar
        if (this.currentIndex >= this.totalOriginal + this.clonesCount) {
            this.currentIndex = this.currentIndex - this.totalOriginal;
            this.updatePosition(false);
        } else if (this.currentIndex < this.clonesCount) {
            this.currentIndex = this.currentIndex + this.totalOriginal;
            this.updatePosition(false);
        }
    }

    updatePagination() {
        let realIndex = (this.currentIndex - this.clonesCount) % this.totalOriginal;
        if (realIndex < 0) realIndex += this.totalOriginal;

        if (this.currentSpan) {
            this.currentSpan.textContent = realIndex + 1;
        }
    }

    addTouchEvents() {
        this.track.addEventListener('touchstart', this.touchStart.bind(this), { passive: true });
        this.track.addEventListener('touchmove', this.touchMove.bind(this), { passive: false });
        this.track.addEventListener('touchend', this.touchEnd.bind(this));

        this.track.addEventListener('mousedown', this.touchStart.bind(this));
        this.track.addEventListener('mousemove', this.touchMove.bind(this));
        this.track.addEventListener('mouseup', this.touchEnd.bind(this));
        this.track.addEventListener('mouseleave', () => { if (this.isDragging) this.touchEnd(); });

        this.track.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); return false; };
        this.track.addEventListener('click', this.handleClick.bind(this), { capture: true });
    }

    handleClick(e) {
        // matamos el evento click si hay arrastre
        if (this.hasMoved) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
    }

    getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    touchStart(event) {
        if (this.isTransitioning) return;
        this.isDragging = true;
        this.hasMoved = false;
        this.startPos = this.getPositionX(event);
        this.prevTranslate = -this.currentIndex * this.slideWidth;
        this.currentTranslate = this.prevTranslate;
        this.track.classList.add('dragging');
        cancelAnimationFrame(this.animationID);
    }

    touchMove(event) {
        if (!this.isDragging) return;
        const currentPosition = this.getPositionX(event);
        const diff = currentPosition - this.startPos;

        if (Math.abs(diff) > 5) {
            this.hasMoved = true;
            if (event.cancelable && event.type === 'touchmove') {
                // event.preventDefault();
            }
        }

        this.currentTranslate = this.prevTranslate + diff;
        this.animationID = requestAnimationFrame(() => {
            this.track.style.transition = 'none';
            this.setSliderPosition(this.currentTranslate);
        });
    }

    touchEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        cancelAnimationFrame(this.animationID);
        this.track.classList.remove('dragging');

        const movedBy = this.currentTranslate - this.prevTranslate;

        // --- SALTO MÚLTIPLE ---
        const rawSlidesChanged = -movedBy / this.slideWidth;

        let slidesJump = Math.round(rawSlidesChanged);

        if (slidesJump === 0 && Math.abs(movedBy) > 50) {
            if (movedBy < 0) slidesJump = 1;
            else slidesJump = -1;
        }

        this.currentIndex += slidesJump;

        // Activacion de transición y actualización
        this.isTransitioning = true;
        this.track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        this.updatePosition(true);
        this.updatePagination();
    }

    setupCardClickListeners() {
        Array.from(this.allSlides).forEach(card => {
            card.onclick = (e) => {
                if (this.hasMoved) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                setTimeout(() => {
                    const projectKey = card.dataset.project;
                    if (!projectKey) return;
                    const infoContainer = document.querySelector('.carousel-information-container');
                    if (infoContainer) {
                        infoContainer.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
                    }
                }, 50);
            };
        });
    }
}