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

        // Configuración
        this.totalOriginal = this.originalCards.length;
        this.visibleSlides = 3.5;
        this.clonesCount = Math.ceil(this.visibleSlides) + 1;
        this.currentIndex = this.clonesCount;
        this.isTransitioning = false;

        this.init();
    }

    init() {
        // 1. Actualizar texto de total
        if (this.totalSpan) this.totalSpan.textContent = this.totalOriginal;

        // 2. Crear Clones para el efecto infinito
        this.createClones();

        // 3. Recalcular dimensiones iniciales
        this.updateDimensions();

        // 4. Event Listeners
        this.nextBtn.addEventListener('click', () => this.move('next'));
        this.prevBtn.addEventListener('click', () => this.move('prev'));

        // Detectar fin de transición para el "salto silencioso"
        this.track.addEventListener('transitionend', () => this.handleTransitionEnd());

        // Manejar redimensionamiento de ventana
        window.addEventListener('resize', () => {
            this.updateDimensions();
            this.updatePosition(false);
        });

        // ResizeObserver para detectar cuando se vuelven visibles
        const resizeObserver = new ResizeObserver(() => {
            this.updateDimensions();
            this.updatePosition(false);
        });
        resizeObserver.observe(this.track);

        // NUEVO: Agregar event listeners a las tarjetas para scroll suave
        this.setupCardClickListeners();
    }

    createClones() {
        // Clones al final (del principio original)
        for (let i = 0; i < this.clonesCount; i++) {
            const clone = this.originalCards[i % this.totalOriginal].cloneNode(true);
            clone.classList.add('clone');
            this.track.appendChild(clone);
        }

        // Clones al principio (del final original)
        for (let i = 0; i < this.clonesCount; i++) {
            const index = (this.totalOriginal - 1 - (i % this.totalOriginal));
            const clone = this.originalCards[index].cloneNode(true);
            clone.classList.add('clone');
            this.track.insertBefore(clone, this.track.firstChild);
        }

        // Actualizar lista completa de slides (originales + clones)
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

        // Posicionar inicialmente
        this.updatePosition(false);
    }

    move(direction) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        this.track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        if (direction === 'next') {
            this.currentIndex++;
        } else {
            this.currentIndex--;
        }

        this.updatePosition(true);
        this.updatePagination();
    }

    updatePosition(animate = true) {
        if (!animate) {
            this.track.style.transition = 'none';
        }

        const translateValue = -this.currentIndex * this.slideWidth;
        this.track.style.transform = `translate3d(${translateValue}px, 0, 0)`;
    }

    handleTransitionEnd() {
        this.isTransitioning = false;

        // Lógica del Bucle Infinito (Teletransportación)
        if (this.currentIndex >= this.totalOriginal + this.clonesCount) {
            this.currentIndex = this.clonesCount;
            this.updatePosition(false);
        } else if (this.currentIndex < this.clonesCount) {
            this.currentIndex = this.totalOriginal + this.clonesCount - 1;
            this.updatePosition(false);
        }
    }

    updatePagination() {
        let realIndex = this.currentIndex - this.clonesCount;

        if (realIndex < 0) {
            realIndex = this.totalOriginal - 1;
        } else if (realIndex >= this.totalOriginal) {
            realIndex = 0;
        }

        if (this.currentSpan) {
            this.currentSpan.textContent = realIndex + 1;
        }
    }

    // NUEVO: Configurar listeners para scroll suave al hacer click en tarjetas
    setupCardClickListeners() {
        const allCards = this.track.querySelectorAll('[data-project]');

        allCards.forEach(card => {
            card.addEventListener('click', () => {
                // Pequeño delay para que la información se cargue primero
                setTimeout(() => {
                    // Buscar el contenedor de información de proyectos
                    const infoContainer = document.querySelector('.carousel-information-container');

                    if (infoContainer) {
                        // Scroll suave hacia el contenedor de información
                        infoContainer.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                        });
                    }
                }, 100);
            });
        });
    }
}