// ====== SISTEMA DE MENÚ HAMBURGUESA ======

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

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        panelIzq.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = panelIzq.classList.contains('active') ? 'hidden' : '';
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        panelIzq.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenu);

    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (window.innerWidth <= 1024) {
                closeMenu();
            }
        });
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && panelIzq.classList.contains('active')) {
            closeMenu();
        }
    });
});

// ====== SISTEMA DE NAVEGACIÓN ENTRE SECCIONES ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Navigation system initialized');

    const navButtons = document.querySelectorAll('.nav-button');
    const contentSections = document.querySelectorAll('.content-section');

    const changeSection = (targetSection) => {
        console.log(`Changing to section: ${targetSection}`);

        navButtons.forEach(btn => btn.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        const activeButton = document.querySelector(`[data-section="${targetSection}"]`);
        if (activeButton) activeButton.classList.add('active');

        const activeSection = document.querySelector(`[data-content="${targetSection}"]`);
        if (activeSection) {
            setTimeout(() => {
                activeSection.classList.add('active');
                const panelContent = document.querySelector('.panel-content');
                if (panelContent) panelContent.scrollTop = 0;
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

    const initializeFromURL = () => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const section = document.querySelector(`[data-section="${hash}"]`);
            if (section) changeSection(hash);
        }
    };

    initializeFromURL();
    window.addEventListener('hashchange', initializeFromURL);

    console.log('✓ Navigation system ready');
});

// ====== SISTEMA DE TOGGLE PARA SKILLS ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Skills toggle system initialized');

    const hardSkillsBtn = document.getElementById('hard-skills');
    const softSkillsBtn = document.getElementById('soft-skills');
    const vocationalStatsBtn = document.getElementById('vocational-stats');
    const hardSkillsContent = document.getElementById('hard-skills-content');
    const softSkillsContent = document.getElementById('soft-skills-content');
    const vocationalStatsContent = document.getElementById('vocational-stats-content');

    if (!hardSkillsBtn || !softSkillsBtn || !vocationalStatsBtn ||
        !hardSkillsContent || !softSkillsContent || !vocationalStatsContent) {
        console.log('Skills elements not found on this page');
        return;
    }

    const showHardSkills = () => {
        hardSkillsBtn.classList.add('active');
        softSkillsBtn.classList.remove('active');
        vocationalStatsBtn.classList.remove('active');
        hardSkillsContent.classList.add('active');
        softSkillsContent.classList.remove('active');
        vocationalStatsContent.classList.remove('active');
    };

    const showSoftSkills = () => {
        softSkillsBtn.classList.add('active');
        hardSkillsBtn.classList.remove('active');
        vocationalStatsBtn.classList.remove('active');
        softSkillsContent.classList.add('active');
        hardSkillsContent.classList.remove('active');
        vocationalStatsContent.classList.remove('active');
    };

    const showVocationalStats = () => {
        vocationalStatsBtn.classList.add('active');
        hardSkillsBtn.classList.remove('active');
        softSkillsBtn.classList.remove('active');
        vocationalStatsContent.classList.add('active');
        hardSkillsContent.classList.remove('active');
        softSkillsContent.classList.remove('active');
    };

    hardSkillsBtn.addEventListener('click', (e) => { e.preventDefault(); showHardSkills(); });
    softSkillsBtn.addEventListener('click', (e) => { e.preventDefault(); showSoftSkills(); });
    vocationalStatsBtn.addEventListener('click', (e) => { e.preventDefault(); showVocationalStats(); });

    console.log('✓ Skills toggle system ready');
});

// ====== SISTEMA DE TOGGLE PARA PROJECTS ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Projects toggle system initialized');

    const professionalBtn = document.getElementById('professional-work-btn');
    const personalBtn = document.getElementById('personal-project-btn');
    const professionalContent = document.querySelector('.professional-work');
    const personalContent = document.querySelector('.personal-project');

    if (!professionalBtn || !personalBtn || !professionalContent || !personalContent) {
        console.log('Project elements not found on this page');
        return;
    }

    professionalContent.classList.add('active');

    const showProfessionalWork = () => {
        professionalBtn.classList.add('active');
        personalBtn.classList.remove('active');
        professionalContent.classList.add('active');
        personalContent.classList.remove('active');
    };

    const showPersonalProjects = () => {
        personalBtn.classList.add('active');
        professionalBtn.classList.remove('active');
        personalContent.classList.add('active');
        professionalContent.classList.remove('active');
    };

    professionalBtn.addEventListener('click', (e) => { e.preventDefault(); showProfessionalWork(); });
    personalBtn.addEventListener('click', (e) => { e.preventDefault(); showPersonalProjects(); });

    console.log('✓ Projects toggle system ready');
});

// ====== SISTEMA DE VISUALIZACIÓN DE INFORMACIÓN DE PROYECTOS ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Project info display system initialized');

    const professionalCards = document.querySelectorAll('.carousel-professional-work-card');
    const personalCards = document.querySelectorAll('.carousel-personal-project-card');
    const infoCards = document.querySelectorAll('.project-info-card');

    const showProjectInfo = (projectId) => {
        console.log(`Showing info for project: ${projectId}`);
        infoCards.forEach(card => card.classList.remove('active'));

        const targetInfo = document.getElementById(`${projectId}-info`);
        if (targetInfo) {
            targetInfo.classList.add('active');
            setTimeout(() => {
                targetInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        } else {
            console.error(`Info card not found for: ${projectId}-info`);
        }
    };

    professionalCards.forEach(card => {
        card.addEventListener('click', () => showProjectInfo(card.getAttribute('data-project')));
    });

    personalCards.forEach(card => {
        card.addEventListener('click', () => showProjectInfo(card.getAttribute('data-project')));
    });

    console.log('✓ Project info display system ready');
});

// ====== MODAL DE IMAGEN COMPLETA ======

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

    const openModal = (imageSrc, imageAlt) => {
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        modal.classList.add('active');
        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) modalContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (!modal.classList.contains('active')) modalImage.src = '';
        }, 300);
    };

    projectImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(img.src, img.alt);
        });
    });

    modalCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); closeModal(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    console.log('✓ Image modal system ready');
});

// ====== SISTEMA DE TOGGLE PARA EDUCATION ======

document.addEventListener('DOMContentLoaded', () => {
    console.log('Education toggle system initialized');

    const preparationBtn = document.getElementById('preparation-btn');
    const certificatesBtn = document.getElementById('certificates-btn');
    const preparationContent = document.getElementById('preparation-content');
    const certificatesContent = document.getElementById('certificates-content');

    if (!preparationBtn || !certificatesBtn || !preparationContent || !certificatesContent) {
        console.log('Education elements not found on this page');
        return;
    }

    const showPreparation = () => {
        preparationBtn.classList.add('active');
        certificatesBtn.classList.remove('active');
        preparationContent.classList.add('active');
        certificatesContent.classList.remove('active');
    };

    const showCertificates = () => {
        certificatesBtn.classList.add('active');
        preparationBtn.classList.remove('active');
        certificatesContent.classList.add('active');
        preparationContent.classList.remove('active');
    };

    preparationBtn.addEventListener('click', (e) => { e.preventDefault(); showPreparation(); });
    certificatesBtn.addEventListener('click', (e) => { e.preventDefault(); showCertificates(); });

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

        setTimeout(() => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) modalContent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const closeCertificateModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            if (!modal.classList.contains('active')) {
                modalImage.src = '';
                modalTitle.textContent = '';
                modalDate.textContent = '';
            }
        }, 300);
    };

    certificateCards.forEach(card => {
        card.addEventListener('click', (e) => { e.stopPropagation(); openCertificateModal(card); });
    });

    modalCloseBtn.addEventListener('click', (e) => { e.stopPropagation(); closeCertificateModal(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeCertificateModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeCertificateModal();
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

    // FIX: elimina la llamada HTTP al servidor — el idioma ya está en localStorage,
    // lo que evita latencia innecesaria y un punto de fallo adicional.
    const getCurrentLanguage = () => localStorage.getItem('preferredLanguage') || 'es';

    window.updateCVLink = () => {
        const currentLang = getCurrentLanguage();
        cvDownloadBtn.href = cvPaths[currentLang] || cvPaths.es;
        cvDownloadBtn.download = `RicardoAlejandroPerezSantillan_CV_${currentLang.toUpperCase()}.pdf`;
        console.log(`CV link updated to: ${cvPaths[currentLang]}`);
    };

    window.updateCVLink();

    // Actualizar CV link Y gráficos vocacionales al cambiar idioma
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Dar tiempo a translation.js para escribir en localStorage
            setTimeout(() => {
                window.updateCVLink();
                // Refrescar gráficos si están visibles (llama a la función expuesta en vocational-charts.js)
                if (typeof window.refreshVocationalCharts === 'function') {
                    window.refreshVocationalCharts();
                }
            }, 200);
        });
    });

    console.log('✓ CV download system ready');
});