// ====== SISTEMA DE TRADUCCIONES ======

const DEFAULT_LANGUAGE = 'es';

// Cargar traducciones desde archivo JSON
const loadTranslations = async (language) => {
    try {
        const response = await fetch(`/languages/${language}.json`);
        if (!response.ok) {
            console.error(`Translation file not found: ${language}.json`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading translations:', error);
        return null;
    }
};

// Actualizar contenido de elementos con traducciones
const updateContent = (translations) => {
    if (!translations) {
        console.warn('No translations provided');
        return;
    }

    const elements = document.querySelectorAll('[data-translate]');
    console.log(`Found ${elements.length} translatable elements`);

    elements.forEach(element => {
        const key = element.dataset.translate;
        const keys = key.split('.');

        let value = translations;
        for (const k of keys) {
            value = value?.[k];
        }

        if (value) {
            // Determinar si es un input o textarea
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = value;
                } else {
                    element.value = value;
                }
            } else {
                element.textContent = value;
            }
        } else {
            console.warn(`Missing translation: ${key}`);
        }
    });

    // Actualizar tooltips de los íconos sociales
    const tooltipElements = document.querySelectorAll('[data-tooltip-translate]');
    tooltipElements.forEach(element => {
        const key = element.dataset.tooltipTranslate;
        const keys = key.split('.');

        let value = translations;
        for (const k of keys) {
            value = value?.[k];
        }

        if (value) {
            element.dataset.tooltip = value;
        }
    });
};

// Actualizar botón activo
const updateActiveButton = (language) => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === language);
    });
};

// Cambiar idioma
const changeLanguage = async (language) => {
    console.log(`Changing language to: ${language}`);

    const translations = await loadTranslations(language);

    if (translations) {
        localStorage.setItem('preferredLanguage', language);
        document.documentElement.lang = language;
        updateContent(translations);
        updateActiveButton(language);
        console.log(`✓ Language changed successfully to: ${language}`);
    } else {
        console.error(`Failed to change language to: ${language}`);
    }
};

// Verificar traducciones faltantes (útil para desarrollo)
const checkMissingTranslations = (translations) => {
    const elements = document.querySelectorAll('[data-translate]');
    const missingTranslations = [];

    elements.forEach(element => {
        const key = element.dataset.translate;
        const keys = key.split('.');

        let value = translations;
        for (const k of keys) {
            value = value?.[k];
        }

        if (!value) {
            missingTranslations.push(key);
        }
    });

    if (missingTranslations.length > 0) {
        console.group('⚠️ Missing Translations');
        missingTranslations.forEach(missing => console.warn(missing));
        console.groupEnd();
    } else {
        console.log('✓ All translations are present');
    }
};

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing translation system...');

    // Cargar idioma guardado o usar el predeterminado
    const savedLanguage = localStorage.getItem('preferredLanguage') || DEFAULT_LANGUAGE;
    await changeLanguage(savedLanguage);

    // Agregar event listeners a los botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const language = btn.dataset.lang;

            // Prevenir cambio si ya está activo
            if (btn.classList.contains('active')) {
                return;
            }

            await changeLanguage(language);
        });
    });

    console.log('✓ Translation system initialized');
});