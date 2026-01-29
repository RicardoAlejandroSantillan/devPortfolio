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

// ====== SISTEMA DE NAVEGACIÓN ENTRE SECCIONES ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Navigation system initialized');

    // Obtener todos los botones de navegación
    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');

    // Función para cambiar de sección
    const changeSection = (targetSection) => {
        console.log(`Changing to section: ${targetSection}`);

        // Remover clase active de todos los botones
        navButtons.forEach(btn => btn.classList.remove('active'));

        // Remover clase active de todas las secciones
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Agregar clase active al botón correspondiente
        const activeButton = document.querySelector(`[data-section="${targetSection}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }

        // Mostrar la sección correspondiente
        const activeSection = document.querySelector(`[data-content="${targetSection}"]`);
        if (activeSection) {
            // Pequeño delay para que la animación se vea mejor
            setTimeout(() => {
                activeSection.classList.add('active');

                // Scroll al inicio del panel de contenido
                const panelContent = document.querySelector('.panel-content');
                if (panelContent) {
                    panelContent.scrollTop = 0;
                }
            }, 50);
        }
    };

    // Agregar event listeners a todos los botones
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = button.dataset.section;

            // Solo cambiar si no está ya activo
            if (!button.classList.contains('active')) {
                changeSection(targetSection);
            }
        });
    });

    // Función para obtener la sección activa desde la URL (opcional)
    const initializeFromURL = () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const section = document.querySelector(`[data-section="${hash}"]`);
            if (section) {
                changeSection(hash);
            }
        }
    };

    // Inicializar desde URL si existe hash
    initializeFromURL();

    // Actualizar URL cuando cambia la sección (opcional)
    window.addEventListener('hashchange', initializeFromURL);

    console.log('✓ Navigation system ready');
});

/* Filtros de Skills */

// ====== SISTEMA DE TOGGLE PARA SKILLS ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Skills toggle system initialized');

    // Obtener los botones y las secciones
    const hardSkillsBtn = document.getElementById('hard-skills');
    const softSkillsBtn = document.getElementById('soft-skills');
    const hardSkillsContent = document.getElementById('hard-skills-content');
    const softSkillsContent = document.getElementById('soft-skills-content');

    // Verificar que existan los elementos
    if (!hardSkillsBtn || !softSkillsBtn || !hardSkillsContent || !softSkillsContent) {
        console.log('Skills elements not found on this page');
        return;
    }

    // Función para mostrar habilidades técnicas
    const showHardSkills = () => {
        hardSkillsBtn.classList.add('active');
        softSkillsBtn.classList.remove('active');
        hardSkillsContent.classList.add('active');
        softSkillsContent.classList.remove('active');
    };

    // Función para mostrar habilidades blandas
    const showSoftSkills = () => {
        softSkillsBtn.classList.add('active');
        hardSkillsBtn.classList.remove('active');
        softSkillsContent.classList.add('active');
        hardSkillsContent.classList.remove('active');
    };

    // Event listeners
    hardSkillsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showHardSkills();
    });

    softSkillsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSoftSkills();
    });

    console.log('✓ Skills toggle system ready');
});

// ====== SISTEMA DE TOGGLE PARA PROJECTS ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Projects toggle system initialized');

    // Obtener los botones y las secciones
    const professionalBtn = document.getElementById('professional-work-btn');
    const personalBtn = document.getElementById('personal-project-btn');
    const professionalContent = document.querySelector('.professional-work');
    const personalContent = document.querySelector('.personal-project');

    // Verificar que existan los elementos
    if (!professionalBtn || !personalBtn || !professionalContent || !personalContent) {
        console.log('Project elements not found on this page');
        return;
    }

    // Mostrar trabajos profesionales por defecto
    professionalContent.classList.add('active');

    // Función para mostrar trabajos profesionales
    const showProfessionalWork = () => {
        professionalBtn.classList.add('active');
        personalBtn.classList.remove('active');
        professionalContent.classList.add('active');
        personalContent.classList.remove('active');
    };

    // Función para mostrar proyectos personales
    const showPersonalProjects = () => {
        personalBtn.classList.add('active');
        professionalBtn.classList.remove('active');
        personalContent.classList.add('active');
        professionalContent.classList.remove('active');
    };

    // Event listeners
    professionalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showProfessionalWork();
    });

    personalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPersonalProjects();
    });

    console.log('✓ Projects toggle system ready');
});

// ====== SISTEMA DE VISUALIZACIÓN DE INFORMACIÓN DE PROYECTOS ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Project info display system initialized');

    // Obtener todas las tarjetas y los contenedores de información
    const professionalCards = document.querySelectorAll('.carousel-professional-work-card');
    const personalCards = document.querySelectorAll('.carousel-personal-project-card');
    const infoCards = document.querySelectorAll('.project-info-card');

    // Función para mostrar la información del proyecto
    const showProjectInfo = (projectId) => {
        console.log(`Showing info for project: ${projectId}`); // Debug

        // Ocultar todas las tarjetas de información
        infoCards.forEach(card => {
            card.classList.remove('active');
        });

        // Mostrar la tarjeta de información correspondiente
        const targetInfo = document.getElementById(`${projectId}-info`);
        if (targetInfo) {
            targetInfo.classList.add('active');

            // Scroll suave hacia la información
            setTimeout(() => {
                targetInfo.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        } else {
            console.error(`Info card not found for: ${projectId}-info`); // Debug
        }
    };

    // Event listeners para tarjetas de trabajo profesional
    professionalCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project'); // CAMBIO AQUÍ
            showProjectInfo(projectId);
        });
    });

    // Event listeners para tarjetas de proyectos personales
    personalCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project'); // CAMBIO AQUÍ
            showProjectInfo(projectId);
        });
    });

    console.log('✓ Project info display system ready');
});

// ====== MODAL Ventana Modal ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Image modal system initialized');

    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const projectImages = document.querySelectorAll('.left-pnl.img-pnl img');

    if (!modal || !modalImage || !modalCloseBtn) {
        console.log('Modal elements not found');
        return;
    }

    // Función para abrir el modal
    const openModal = (imageSrc, imageAlt, targetElement) => {
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        modal.classList.add('active');

        // Scroll hacia el modal después de abrirlo
        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);
    };

    // Función para cerrar el modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll

        // Limpiar imagen después de la animación
        setTimeout(() => {
            if (!modal.classList.contains('active')) {
                modalImage.src = '';
            }
        }, 300);
    };

    // Event listeners para cada imagen del proyecto
    projectImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(img.src, img.alt, img);
        });
    });

    // Cerrar al hacer clic en el botón de cerrar
    modalCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });

    // Cerrar al hacer clic fuera del contenido del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    console.log('✓ Image modal system ready');
});

// ====== SISTEMA DE TOGGLE PARA EDUCATION ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Education toggle system initialized');

    // Obtener los botones y las secciones
    const preparationBtn = document.getElementById('preparation-btn');
    const certificatesBtn = document.getElementById('certificates-btn');
    const preparationContent = document.getElementById('preparation-content');
    const certificatesContent = document.getElementById('certificates-content');

    // Verificar que existan los elementos
    if (!preparationBtn || !certificatesBtn || !preparationContent || !certificatesContent) {
        console.log('Education elements not found on this page');
        return;
    }

    // Función para mostrar preparación
    const showPreparation = () => {
        preparationBtn.classList.add('active');
        certificatesBtn.classList.remove('active');
        preparationContent.classList.add('active');
        certificatesContent.classList.remove('active');
    };

    // Función para mostrar certificados
    const showCertificates = () => {
        certificatesBtn.classList.add('active');
        preparationBtn.classList.remove('active');
        certificatesContent.classList.add('active');
        preparationContent.classList.remove('active');
    };

    // Event listeners
    preparationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPreparation();
    });

    certificatesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showCertificates();
    });

    console.log('✓ Education toggle system ready');
});

// ====== SISTEMA DE MODAL PARA CERTIFICADOS ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Certificate modal system initialized');

    const modal = document.getElementById('certificateModal');
    const modalImage = document.getElementById('certificateModalImage');
    const modalTitle = document.getElementById('certificateModalTitle');
    const modalDate = document.getElementById('certificateModalDate');
    const modalCloseBtn = document.getElementById('certificateModalCloseBtn');
    const certificateCards = document.querySelectorAll('.certificate-card');

    if (!modal || !modalImage || !modalCloseBtn) {
        console.log('Certificate modal elements not found');
        return;
    }

    // Abrir el modal
    const openCertificateModal = (card) => {
        const img = card.querySelector('.certificate-image-container img');
        const titleText = card.querySelector('.certificate-info p').textContent;
        const dateText = card.querySelector('.certificate-info span').textContent;

        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalTitle.textContent = titleText;
        modalDate.textContent = dateText;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Scroll hacia el modal después de abrirlo
        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);
    };

    // Función para cerrar el modal
    const closeCertificateModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Limpiar contenido después de la animación
        setTimeout(() => {
            if (!modal.classList.contains('active')) {
                modalImage.src = '';
                modalTitle.textContent = '';
                modalDate.textContent = '';
            }
        }, 300);
    };

    // Event listeners para cada tarjeta de certificado
    certificateCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            openCertificateModal(card);
        });
    });

    // Cerrar al hacer clic en el botón de cerrar
    modalCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeCertificateModal();
    });

    // Cerrar al hacer clic fuera del contenido del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCertificateModal();
        }
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeCertificateModal();
        }
    });

    console.log('✓ Certificate modal system ready');
});

// ====== SISTEMA DE DESCARGA DE CV ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('CV download system initialized');

    const cvDownloadBtn = document.getElementById('cvDownloadBtn');

    if (!cvDownloadBtn) {
        console.log('CV download button not found');
        return;
    }

    const cvPaths = {
        es: '/files/RicardoAlejandroPerezSantillan_AnalistaDeDatos.pdf',
        en: '/files/RicardoAlejandroPerezSantillan_DataAnalyst.pdf'
    };

    // Obtener el idioma actual
    const getCurrentLanguage = async () => {
        try {
            const response = await fetch('/Home/GetCurrentLanguage');
            if (response.ok) {
                const data = await response.json();
                return data.language || 'es';
            }
        } catch (error) {
            console.error('Error getting language:', error);
        }

        return localStorage.getItem('preferredLanguage') || 'es';
    };

    // Función para actualizar el link de descarga
    window.updateCVLink = async () => {
        const currentLang = await getCurrentLanguage();
        cvDownloadBtn.href = cvPaths[currentLang];
        cvDownloadBtn.download = `RicardoAlejandroPerezSantillan_CV_${currentLang.toUpperCase()}.pdf`;
        console.log(`CV link updated to: ${cvPaths[currentLang]}`);
    };
    window.updateCVLink();

    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(window.updateCVLink, 200);
        });
    });

    console.log('✓ CV download system ready');
});