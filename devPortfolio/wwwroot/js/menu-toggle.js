// menu-toggle.js - Agregar este script a tu proyecto

document.addEventListener('DOMContentLoaded', function () {
    // Crear botón hamburguesa
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-label', 'Toggle menu');
    menuToggle.innerHTML = '<span></span><span></span><span></span>';

    // Crear overlay
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';

    // Insertar en el DOM
    document.body.prepend(menuToggle);
    document.body.prepend(menuOverlay);

    const panelIzq = document.querySelector('.panel-izq');
    const navButtons = document.querySelectorAll('.nav-button');

    // Toggle menu
    function toggleMenu() {
        menuToggle.classList.toggle('active');
        panelIzq.classList.toggle('active');
        menuOverlay.classList.toggle('active');

        // Prevenir scroll del body cuando el menú está abierto
        if (panelIzq.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Cerrar menú
    function closeMenu() {
        menuToggle.classList.remove('active');
        panelIzq.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners
    menuToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Cerrar menú al hacer click en un botón de navegación (solo en móvil)
    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (window.innerWidth <= 1024) {
                closeMenu();
            }
        });
    });

    // Cerrar menú al redimensionar a desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024) {
            closeMenu();
        }
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panelIzq.classList.contains('active')) {
            closeMenu();
        }
    });
});