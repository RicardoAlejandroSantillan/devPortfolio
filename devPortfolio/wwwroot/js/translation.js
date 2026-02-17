// ====== SISTEMA DE TRADUCCIONES CON BACKEND ======

const DEFAULT_LANGUAGE = 'es';

// Obtener el idioma actual del backend
const getCurrentLanguageFromBackend = async () => {
    try {
        const response = await fetch('/Home/GetCurrentLanguage');
        if (response.ok) {
            const data = await response.json();
            return data.language || DEFAULT_LANGUAGE;
        }
    } catch (error) {
        console.error('Error getting language from backend:', error);
    }
    return DEFAULT_LANGUAGE;
};

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

        // EXCLUIR el h1 del top-panel porque lo maneja el typewriter
        if (element.matches('.top-panel h1')) {
            return;
        }

        const keys = key.split('.');

        let value = translations;
        for (const k of keys) {
            value = value?.[k];
        }

        if (value) {
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

// Actualizar URL sin recargar
const updateURL = (language) => {
    const currentPath = window.location.pathname;
    let newPath;

    if (currentPath.startsWith('/es') || currentPath.startsWith('/en')) {
        newPath = currentPath.replace(/^\/(es|en)/, `/${language}`);
    } else {
        if (currentPath === '/' || currentPath === '') {
            newPath = `/${language}`;
        } else {
            newPath = `/${language}${currentPath}`;
        }
    }

    window.history.pushState({ language }, '', newPath);
};

// Cambiar idioma — las traducciones se aplican directamente sin depender
// del éxito del backend, evitando que un fallo de CSRF bloquee el cambio.
const changeLanguage = async (language) => {
    console.log(`Changing language to: ${language}`);

    // 1. Cargar y aplicar traducciones de inmediato
    const translations = await loadTranslations(language);

    if (translations) {
        localStorage.setItem('preferredLanguage', language);
        document.documentElement.lang = language;
        updateContent(translations);
        updateActiveButton(language);
        updateURL(language);

        if (window.updateCVLink) {
            window.updateCVLink();
        }

        if (window.initTypewriter) {
            window.initTypewriter(language);
        }

        console.log(`✓ Language applied: ${language}`);
    } else {
        console.error(`Could not load translations for: ${language}`);
        return;
    }

    // 2. Notificar al backend de forma asíncrona (fire-and-forget)
    try {
        const formData = new FormData();
        formData.append('language', language);
        formData.append('returnUrl', window.location.pathname);

        const response = await fetch('/Home/SetLanguage', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log(`✓ Backend notified of language change: ${language}`);
        } else {
            console.warn('Backend language update failed (translations already applied client-side)');
        }
    } catch (error) {
        console.warn('Could not notify backend of language change:', error);
    }
};

// Inicialización al cargar el DOM
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing translation system...');

    // Obtener idioma del backend
    let currentLanguage = await getCurrentLanguageFromBackend();

    // Si hay idioma en la URL, tiene prioridad
    const pathLanguage = window.location.pathname.match(/^\/(es|en)/)?.[1];
    if (pathLanguage) {
        currentLanguage = pathLanguage;
    }

    // Cargar traducciones para el idioma actual
    await changeLanguage(currentLanguage);

    // Event listeners en los botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const language = btn.dataset.lang;

            if (btn.classList.contains('active')) {
                return;
            }

            await changeLanguage(language);
        });
    });

    // Manejar navegación del navegador (botones atrás/adelante)
    window.addEventListener('popstate', async (event) => {
        if (event.state && event.state.language) {
            await changeLanguage(event.state.language);
        }
    });

    console.log('✓ Translation system initialized');
});