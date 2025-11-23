// ====== SISTEMA DE NAVEGACIÓN ENTRE SECCIONES ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Navigation system initialized');

    // Obtener todos los botones de navegación
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');

    // Función para cambiar de sección
    const changeSection = (targetSection) => {
        console.log(`Changing to section: ${targetSection}`);

        // Remover la clase active de los botones
        navButtons.forEach(btn => btn.classList.remove('active'));

        // Remover la clase active
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // actualizar la clase active
        const activeButton = document.querySelector(`[data-section="${targetSection}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Mostrar las secciones correspondientes
        const activeSection = document.querySelector(`[data-content="${targetSection}"]`);
        if (activeSection) {
            setTimeout(() => {
                activeSection.classList.add('active');

                // Scroll al panel de inicio
                const panelContent = document.querySelector('.panel-content');
                if (panelContent) {
                    panelContent.scrollTop = 0;
                }
            }, 50);
        }
    };

    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = button.dataset.section;

            if (!button.classList.contains('active')) {
                changeSection(targetSection);
            }
        });
    });
});