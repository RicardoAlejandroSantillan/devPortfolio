document.addEventListener('DOMContentLoaded', () => {
    console.log('Vocational charts system initialized');

    // ── DOS CICLOS DE VIDA SEPARADOS ─────────────────────────────────────────
    // radarChart  → instancia persistente mientras la tab Estadísticas esté abierta
    // barCharts   → se destruyen/crean al cambiar de sub-sección
    let radarChart = null;
    let barCharts = {};

    // ── ETIQUETAS BILINGUES ──────────────────────────────────────────────────
    const LABELS = {
        es: {
            radar: [
                'Mecánica', 'Destreza manual', 'Físicas', 'Científicas', 'Visualización',
                'Investigación', 'Creatividad', 'Expresión', 'Comunicación', 'Ayudar a otros',
                'Enseñar', 'Conocer gente', 'Negocios', 'Emprendedor', 'Dirigir gente',
                'Administración', 'Organización', 'Gestión de datos'
            ],
            datasets: {
                realistic: 'Realista', investigative: 'Investigador', artistic: 'Artístico',
                social: 'Sociales', enterprising: 'Emprendedor', conventional: 'Convencional'
            },
            topSkills: ['Visualización', 'Gestión de datos', 'Administración'],
            topInterests: ['Convencionales', 'Investigación'],
            topCareers: ['Administración Pública', 'Mercadotecnia', 'Auditor'],
            lowSkills: ['Expresión', 'Físicas', 'Ayudar a otros'],
            lowInterests: ['Artístico', 'Realistas', 'Sociales'],
            lowCareers: ['Planeación Territorial', 'Metalurgia y Materiales', 'Urbana'],
            valoresOcupacionales: ['Esfuerzo', 'Honestidad', 'Respeto', 'Responsabilidad', 'Servicio']
        },
        en: {
            radar: [
                'Mechanical', 'Manual dexterity', 'Physical', 'Scientific', 'Visualization',
                'Research', 'Creativity', 'Expression', 'Communication', 'Helping others',
                'Teaching', 'Meeting people', 'Business', 'Entrepreneurial', 'Leading people',
                'Administration', 'Organization', 'Data management'
            ],
            datasets: {
                realistic: 'Realistic', investigative: 'Investigative', artistic: 'Artistic',
                social: 'Social', enterprising: 'Enterprising', conventional: 'Conventional'
            },
            topSkills: ['Visualization', 'Data management', 'Administration'],
            topInterests: ['Conventional', 'Research'],
            topCareers: ['Public Administration', 'Marketing', 'Auditor'],
            lowSkills: ['Expression', 'Physical', 'Helping others'],
            lowInterests: ['Artistic', 'Realistic', 'Social'],
            lowCareers: ['Territorial Planning', 'Metallurgy & Materials', 'Urban Planning'],
            valoresOcupacionales: ['Effort', 'Honesty', 'Respect', 'Responsibility', 'Service']
        }
    };

    function getCurrentLang() { return localStorage.getItem('preferredLanguage') || 'es'; }
    function getL() { return LABELS[getCurrentLang()] || LABELS.es; }

    // ── PALETA RIASEC ────────────────────────────────────────────────────────
    const RIASEC_COLORS = {
        realistic: { border: '#c2185b', fill: 'rgba(194,24,91,0.18)', point: '#c2185b' },
        investigative: { border: '#e91e63', fill: 'rgba(233,30,99,0.18)', point: '#e91e63' },
        artistic: { border: '#ffb74d', fill: 'rgba(255,183,77,0.18)', point: '#ffb74d' },
        social: { border: '#ff9800', fill: 'rgba(255,152,0,0.18)', point: '#ff9800' },
        enterprising: { border: '#ff7043', fill: 'rgba(255,112,67,0.22)', point: '#ff7043' },
        conventional: { border: '#ec407a', fill: 'rgba(236,64,122,0.15)', point: '#ec407a' },
    };

    // ── DATOS RADAR ──────────────────────────────────────────────────────────
    // Índices 0-17:
    // 0  Mecánica          1  Destreza manual   2  Físicas
    // 3  Científicas       4  Visualización     5  Investigación
    // 6  Creatividad       7  Expresión         8  Comunicación
    // 9  Ayudar a otros    10 Enseñar           11 Conocer gente
    // 12 Negocios          13 Emprendedor       14 Dirigir gente
    // 15 Administración    16 Organización      17 Gestión de datos
    function makeEmpty(len) { return new Array(len).fill(0); }

    function buildRadarData(l) {
        const len = l.radar.length;

        const realisticVals = makeEmpty(len);
        realisticVals[0] = 50; realisticVals[1] = 44; realisticVals[2] = 14;

        const investigativeVals = makeEmpty(len);
        investigativeVals[3] = 56; investigativeVals[4] = 91; investigativeVals[5] = 37;

        const artisticVals = makeEmpty(len);
        artisticVals[6] = 33; artisticVals[7] = 0;

        const socialVals = makeEmpty(len);
        socialVals[8] = 36; socialVals[9] = 18; socialVals[10] = 70; socialVals[11] = 54;

        const enterprisingVals = makeEmpty(len);
        enterprisingVals[12] = 55; enterprisingVals[13] = 68; enterprisingVals[14] = 47;

        const conventionalVals = makeEmpty(len);
        conventionalVals[15] = 83; conventionalVals[16] = 62; conventionalVals[17] = 83;

        const makeDs = (label, vals, col) => ({
            label,
            data: vals,
            backgroundColor: col.fill,
            borderColor: col.border,
            borderWidth: 1.5,
            pointBackgroundColor: col.point,
            pointBorderColor: '#fff',
            pointRadius: 3,
            pointHoverRadius: 5
        });

        return {
            labels: l.radar,
            datasets: [
                makeDs(l.datasets.realistic, realisticVals, RIASEC_COLORS.realistic),
                makeDs(l.datasets.investigative, investigativeVals, RIASEC_COLORS.investigative),
                makeDs(l.datasets.artistic, artisticVals, RIASEC_COLORS.artistic),
                makeDs(l.datasets.social, socialVals, RIASEC_COLORS.social),
                makeDs(l.datasets.enterprising, enterprisingVals, RIASEC_COLORS.enterprising),
                makeDs(l.datasets.conventional, conventionalVals, RIASEC_COLORS.conventional),
            ]
        };
    }

    // ── OPCIONES RADAR ───────────────────────────────────────────────────────
    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10,3,47,0.92)',
                titleColor: '#fff',
                bodyColor: 'rgba(255,255,255,0.85)',
                borderColor: 'rgba(255,255,255,0.15)',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.r}%` }
            }
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: { stepSize: 20, color: 'rgba(0,0,0,0)', backdropColor: 'transparent', font: { size: 9 } },
                grid: { color: 'rgba(255,255,255,0.15)', circular: true },
                pointLabels: { color: 'rgb(160,161,163)', font: { size: 12, weight: '600' }, padding: 12 },
                angleLines: { color: 'rgba(255,255,255,0.12)' }
            }
        },
        animation: { duration: 800, easing: 'easeInOutQuart' }
    };

    // ── DATOS BARRAS ─────────────────────────────────────────────────────────
    const BAR_TOP = { bg: 'rgba(79,195,247,0.75)', border: 'rgba(79,195,247,1)' };
    const BAR_LOW = { bg: 'rgba(236,64,122,0.70)', border: 'rgba(236,64,122,1)' };

    function makeBarDataset(data, color) {
        return [{
            label: 'Porcentaje',
            data,
            backgroundColor: color.bg,
            borderColor: color.border,
            borderWidth: 1.5,
            borderRadius: 6,
            borderSkipped: false
        }];
    }

    function buildBarData(l) {
        return {
            topSkills: { labels: l.topSkills, datasets: makeBarDataset([91.89, 88.96, 88.78], BAR_TOP) },
            topInterests: { labels: l.topInterests, datasets: makeBarDataset([76.85, 62.16], BAR_TOP) },
            topCareers: { labels: l.topCareers, datasets: makeBarDataset([78.38, 73.0, 71.6], BAR_TOP) },
            lowSkills: { labels: l.lowSkills, datasets: makeBarDataset([1.25, 14.86, 18.92], BAR_LOW) },
            lowInterests: { labels: l.lowInterests, datasets: makeBarDataset([28.38, 30.63, 37.84], BAR_LOW) },
            lowCareers: { labels: l.lowCareers, datasets: makeBarDataset([24.3, 24.3, 24.3], BAR_LOW) },
            valoresOcupacionales: { labels: l.valoresOcupacionales, datasets: makeBarDataset([95, 98, 96, 97, 90], BAR_TOP) },
        };
    }

    // ── OPCIONES BARRAS ──────────────────────────────────────────────────────
    const barOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10,3,47,0.92)', padding: 12, titleColor: '#fff',
                bodyColor: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.15)',
                borderWidth: 1, cornerRadius: 8,
                callbacks: { label: ctx => '  ' + ctx.parsed.x.toFixed(1) + '%' }
            }
        },
        scales: {
            x: {
                beginAtZero: true, max: 100,
                grid: { color: 'rgba(255,255,255,0.06)', drawBorder: false },
                border: { display: false },
                ticks: { color: 'rgba(255,255,255,0.45)', font: { size: 10 }, callback: v => v + '%', maxTicksLimit: 5 }
            },
            y: {
                grid: { display: false }, border: { display: false },
                ticks: { color: 'rgba(255,255,255,0.9)', font: { size: 11, weight: '600' }, padding: 6 }
            }
        },
        layout: { padding: { right: 8 } },
        animation: { duration: 700, easing: 'easeInOutQuart' }
    };

    // ── CANVAS DE BARRAS POR SUB-SECCIÓN ─────────────────────────────────────
    // El radar NO aparece aquí — tiene su propio ciclo de vida independiente.
    const SECTION_BAR_CHARTS = {
        profile: ['topSkillsChart', 'topInterestsChart', 'topCareersChart',
            'lowSkillsChart', 'lowInterestsChart', 'lowCareersChart'],
        aptitudes: ['valoresOcupacionalesChart'],  // movido desde "proyecto"
        proyecto: []                              // solo texto, sin canvas
    };

    function getActiveSectionKey() {
        const el = document.querySelector('.vocational-section-content.active');
        return el ? el.getAttribute('data-section-content') : 'profile';
    }

    // ════════════════════════════════════════════════════════════════════════
    // CICLO DE VIDA: RADAR — independiente de las sub-secciones
    // ════════════════════════════════════════════════════════════════════════

    function createRadar() {
        if (radarChart) return; // Ya existe, no recrear
        const ctx = document.getElementById('vocationalRadarChart');
        if (!ctx) return;
        radarChart = new Chart(ctx, {
            type: 'radar',
            data: buildRadarData(getL()),
            options: radarOptions
        });
        console.log(`✓ Radar creado (${getCurrentLang()})`);
    }

    function destroyRadar() {
        if (radarChart) {
            radarChart.destroy();
            radarChart = null;
            console.log('✓ Radar destruido');
        }
    }

    // Actualiza etiquetas in-place al cambiar idioma (sin destruir/recrear, sin parpadeo)
    function updateRadarLabels() {
        if (!radarChart) return;
        radarChart.data = buildRadarData(getL());
        radarChart.update();
        console.log(`✓ Radar actualizado a idioma: ${getCurrentLang()}`);
    }

    // ════════════════════════════════════════════════════════════════════════
    // CICLO DE VIDA: BARRAS — rotativo según sub-sección activa
    // ════════════════════════════════════════════════════════════════════════

    function destroyBarCharts() {
        Object.keys(barCharts).forEach(k => {
            if (barCharts[k] && typeof barCharts[k].destroy === 'function') {
                barCharts[k].destroy();
            }
        });
        barCharts = {};
    }

    function createBarCharts() {
        const l = getL();
        const bar = buildBarData(l);
        const sectionKey = getActiveSectionKey();
        const allowedIds = SECTION_BAR_CHARTS[sectionKey] || [];

        if (!allowedIds.length) {
            console.log(`✓ Sub-sección "${sectionKey}" no tiene canvas de barras.`);
            return;
        }

        const allPairs = [
            ['topSkillsChart', bar.topSkills],
            ['topInterestsChart', bar.topInterests],
            ['topCareersChart', bar.topCareers],
            ['lowSkillsChart', bar.lowSkills],
            ['lowInterestsChart', bar.lowInterests],
            ['lowCareersChart', bar.lowCareers],
            ['valoresOcupacionalesChart', bar.valoresOcupacionales],
        ];

        allPairs.forEach(([id, data]) => {
            if (!allowedIds.includes(id)) return;
            const ctx = document.getElementById(id);
            if (ctx) {
                barCharts[id] = new Chart(ctx, { type: 'bar', data, options: barOptions });
            }
        });

        console.log(`✓ Barras creadas — sub-sección: ${sectionKey} (${getCurrentLang()})`);
    }

    // ── API PÚBLICA: CAMBIO DE IDIOMA ────────────────────────────────────────
    window.refreshVocationalCharts = function () {
        const statsContent = document.getElementById('vocational-stats-content');
        if (!statsContent || !statsContent.classList.contains('active')) return;
        updateRadarLabels();   // Radar: actualización suave in-place
        destroyBarCharts();
        createBarCharts();     // Barras: recrear con nuevas etiquetas
    };

    // ── FILTROS DE SUB-SECCIONES ─────────────────────────────────────────────
    const sectionButtons = document.querySelectorAll('.vocational-section-btn');
    const sectionContents = document.querySelectorAll('.vocational-section-content');

    sectionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.getAttribute('data-section');

            sectionButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sectionContents.forEach(content => {
                content.classList.toggle(
                    'active',
                    content.getAttribute('data-section-content') === targetSection
                );
            });

            // Solo las barras rotan; el radar permanece intacto y visible
            setTimeout(() => {
                destroyBarCharts();
                createBarCharts();
            }, 150);
        });
    });

    // ── OBSERVER: ENTRADA / SALIDA DE LA TAB "ESTADÍSTICAS" ─────────────────
    const vocationalStatsContent = document.getElementById('vocational-stats-content');

    if (vocationalStatsContent) {
        let wasActive = vocationalStatsContent.classList.contains('active');

        const observer = new MutationObserver(() => {
            const isActive = vocationalStatsContent.classList.contains('active');

            if (!wasActive && isActive) {
                // Entró a la tab → crear radar persistente + barras de la sub-sección activa
                setTimeout(() => {
                    createRadar();
                    destroyBarCharts();
                    createBarCharts();
                }, 150);
            } else if (wasActive && !isActive) {
                // Salió de la tab → liberar todo
                destroyBarCharts();
                destroyRadar();
            }

            wasActive = isActive;
        });

        observer.observe(vocationalStatsContent, { attributes: true, attributeFilter: ['class'] });

        // Si la tab ya está activa al cargar
        if (wasActive) {
            setTimeout(() => {
                createRadar();
                createBarCharts();
            }, 150);
        }
    }
});