class TypewriterEffect {
    constructor(element, phrases, prefix, options = {}) {
        this.element = element;
        this.phrases = phrases;
        this.prefix = prefix; 
        this.currentPhraseIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.timeoutId = null;

        this.config = {
            typingSpeed: options.typingSpeed || 100,
            deletingSpeed: options.deletingSpeed || 50,
            pauseAfterTyping: options.pauseAfterTyping || 2000,
            pauseAfterDeleting: options.pauseAfterDeleting || 500,
            loop: options.loop !== undefined ? options.loop : true
        };
    }

    start() {
        this.type();
    }

    stop() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    type() {
        const currentPhrase = this.phrases[this.currentPhraseIndex];

        if (this.isDeleting) {
            // Borrar letra por letra
            this.currentText = currentPhrase.substring(0, this.currentText.length - 1);
        } else {
            // Escribir letra por letra
            this.currentText = currentPhrase.substring(0, this.currentText.length + 1);
        }

        this.element.textContent = this.prefix + this.currentText;
        let speed = this.isDeleting ? this.config.deletingSpeed : this.config.typingSpeed;

        if (!this.isDeleting && this.currentText === currentPhrase) {
            // Delay
            speed = this.config.pauseAfterTyping;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            // despues de borrar
            this.isDeleting = false;
            this.currentPhraseIndex++;

            // Loop
            if (this.currentPhraseIndex >= this.phrases.length) {
                if (this.config.loop) {
                    this.currentPhraseIndex = 0;
                } else {
                    return;
                }
            }

            speed = this.config.pauseAfterDeleting;
        }

        this.timeoutId = setTimeout(() => this.type(), speed);
    }
}

// ====== GESTOR GLOBAL DE TYPEWRITER ======

let typewriterInstance = null;

const initTypewriter = (language = 'es') => {
    const h1Element = document.querySelector('.top-panel h1');

    if (!h1Element) {
        console.warn('No se encontró el elemento h1');
        return;
    }

    if (typewriterInstance) {
        typewriterInstance.stop();
        typewriterInstance = null;
    }

    // Configuración por idioma
    const config = {
        es: {
            prefix: "Soy ",
            phrases: [
                "Ricardo Alejandro Pérez Santillán",
                "un amante de los Datos",
                "un loco por las automatizaciones"
            ]
        },
        en: {
            prefix: "I'm ",
            phrases: [
                "Ricardo Alejandro Pérez Santillán",
                "a Data enthusiast",
                "an automation fanatic"
            ]
        }
    };

    // Configuración del efecto
    const typewriterConfig = {
        typingSpeed: 100,
        deletingSpeed: 50,
        pauseAfterTyping: 2000,
        pauseAfterDeleting: 500,
        loop: true
    };
    const languageConfig = config[language];

    typewriterInstance = new TypewriterEffect(
        h1Element,
        languageConfig.phrases,
        languageConfig.prefix,
        typewriterConfig
    );
    typewriterInstance.start();

    console.log(`✓ Typewriter iniciado en idioma: ${language} con prefijo: "${languageConfig.prefix}"`);
};

window.TypewriterEffect = TypewriterEffect;
window.initTypewriter = initTypewriter;

document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'es';

    setTimeout(() => {
        initTypewriter(savedLanguage);
    }, 200);
});