document.addEventListener('DOMContentLoaded', () => {
    console.log('Vocational charts system initialized');

    // ── TRES CICLOS DE VIDA SEPARADOS ────────────────────────────────────────
    // radarChart     → instancia RIASEC persistente mientras la tab Estadísticas esté abierta
    // cognitiveChart → instancia cognitiva, activa solo en sub-sección "aptitudes"
    // barCharts      → se destruyen/crean al cambiar de sub-sección
    let radarChart     = null;
    let cognitiveChart = null;
    let barCharts      = {};

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
                realistic:    'Realista',
                investigative:'Investigador',
                artistic:     'Artístico',
                social:       'Sociales',
                enterprising: 'Emprendedor',
                conventional: 'Convencional'
            },
            topSkills:    ['Visualización', 'Gestión de datos', 'Administración'],
            topInterests: ['Convencionales', 'Investigación'],
            topCareers:   ['Administración Pública', 'Mercadotecnia', 'Auditor'],
            lowSkills:    ['Expresión', 'Físicas', 'Ayudar a otros'],
            lowInterests: ['Artístico', 'Realistas', 'Sociales'],
            lowCareers:   ['Planeación Territorial', 'Metalurgia y Materiales', 'Urbana'],
            valoresOcupacionales: ['Esfuerzo', 'Honestidad', 'Respeto', 'Responsabilidad', 'Servicio'],
            // Cognitivo
            cognitive:    ['Verbal', 'Numérico', 'Lógico'],
            cognitiveMe:  'Mi Resultado',
            cognitiveAvg: 'Promedio General'
        },
        en: {
            radar: [
                'Mechanical', 'Manual dexterity', 'Physical', 'Scientific', 'Visualization',
                'Research', 'Creativity', 'Expression', 'Communication', 'Helping others',
                'Teaching', 'Meeting people', 'Business', 'Entrepreneurial', 'Leading people',
                'Administration', 'Organization', 'Data management'
            ],
            datasets: {
                realistic:    'Realistic',
                investigative:'Investigative',
                artistic:     'Artistic',
                social:       'Social',
                enterprising: 'Enterprising',
                conventional: 'Conventional'
            },
            topSkills:    ['Visualization', 'Data management', 'Administration'],
            topInterests: ['Conventional', 'Research'],
            topCareers:   ['Public Administration', 'Marketing', 'Auditor'],
            lowSkills:    ['Expression', 'Physical', 'Helping others'],
            lowInterests: ['Artistic', 'Realistic', 'Social'],
            lowCareers:   ['Territorial Planning', 'Metallurgy & Materials', 'Urban Planning'],
            valoresOcupacionales: ['Effort', 'Honesty', 'Respect', 'Responsibility', 'Service'],
            // Cognitive
            cognitive:    ['Verbal', 'Numerical', 'Logical'],
            cognitiveMe:  'My Score',
            cognitiveAvg: 'General Average'
        }
    };

    function getCurrentLang() { return localStorage.getItem('preferredLanguage') || 'es'; }
    function getL()           { return LABELS[getCurrentLang()] || LABELS.es; }

    // ── PALETA RIASEC ────────────────────────────────────────────────────────
    const RIASEC_COLORS = {
        realistic:     { border: '#c2185b', fill: 'rgba(194,24,91,0.18)',   point: '#c2185b' },
        investigative: { border: '#e91e63', fill: 'rgba(233,30,99,0.18)',   point: '#e91e63' },
        artistic:      { border: '#ffb74d', fill: 'rgba(255,183,77,0.18)',  point: '#ffb74d' },
        social:        { border: '#ff9800', fill: 'rgba(255,152,0,0.18)',   point: '#ff9800' },
        enterprising:  { border: '#ff7043', fill: 'rgba(255,112,67,0.22)', point: '#ff7043' },
        conventional:  { border: '#ec407a', fill: 'rgba(236,64,122,0.15)', point: '#ec407a' },
    };

    // ── PALETA COGNITIVA ─────────────────────────────────────────────────────
    const COGNITIVE_COLORS = {
        mine: { border: '#4fc3f7', fill: 'rgba(79,195,247,0.22)',  point: '#4fc3f7' },
        avg:  { border: '#f06292', fill: 'rgba(240,98,146,0.15)', point: '#f06292' },
    };

    // ════════════════════════════════════════════════════════════════════════
    // DATOS RADAR RIASEC
    // ════════════════════════════════════════════════════════════════════════
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

        const realisticVals     = makeEmpty(len);
        realisticVals[0] = 50; realisticVals[1] = 44; realisticVals[2] = 14;

        const investigativeVals = makeEmpty(len);
        investigativeVals[3] = 56; investigativeVals[4] = 91; investigativeVals[5] = 37;

        const artisticVals      = makeEmpty(len);
        artisticVals[6] = 33; artisticVals[7] = 0;

        const socialVals        = makeEmpty(len);
        socialVals[8] = 36; socialVals[9] = 18; socialVals[10] = 70; socialVals[11] = 54;

        const enterprisingVals  = makeEmpty(len);
        enterprisingVals[12] = 55; enterprisingVals[13] = 68; enterprisingVals[14] = 47;

        const conventionalVals  = makeEmpty(len);
        conventionalVals[15] = 83; conventionalVals[16] = 62; conventionalVals[17] = 83;

        const makeDs = (label, vals, col) => ({
            label,
            data: vals,
            backgroundColor:     col.fill,
            borderColor:         col.border,
            borderWidth:         1.5,
            pointBackgroundColor:col.point,
            pointBorderColor:    '#fff',
            pointRadius:         3,
            pointHoverRadius:    5
        });

        return {
            labels: l.radar,
            datasets: [
                makeDs(l.datasets.realistic,     realisticVals,     RIASEC_COLORS.realistic),
                makeDs(l.datasets.investigative,  investigativeVals, RIASEC_COLORS.investigative),
                makeDs(l.datasets.artistic,       artisticVals,      RIASEC_COLORS.artistic),
                makeDs(l.datasets.social,         socialVals,        RIASEC_COLORS.social),
                makeDs(l.datasets.enterprising,   enterprisingVals,  RIASEC_COLORS.enterprising),
                makeDs(l.datasets.conventional,   conventionalVals,  RIASEC_COLORS.conventional),
            ]
        };
    }

    // ════════════════════════════════════════════════════════════════════════
    // DATOS COGNITIVOS
    // Escala real de la prueba: 0–60 pts por dimensión.
    // Mi resultado  → Verbal:47  Numérico:40  Lógico:47
    // Promedio gral → Verbal:44  Numérico:34  Lógico:51
    // ════════════════════════════════════════════════════════════════════════
    function buildCognitiveData(l) {
        return {
            labels: l.cognitive,
            datasets: [
                {
                    label:               l.cognitiveMe,
                    data:                [47, 40, 47],
                    backgroundColor:     COGNITIVE_COLORS.mine.fill,
                    borderColor:         COGNITIVE_COLORS.mine.border,
                    borderWidth:         2,
                    pointBackgroundColor:COGNITIVE_COLORS.mine.point,
                    pointBorderColor:    '#ffffff',
                    pointRadius:         5,
                    pointHoverRadius:    7,
                    pointBorderWidth:    2
                },
                {
                    label:               l.cognitiveAvg,
                    data:                [44, 34, 51],
                    backgroundColor:     COGNITIVE_COLORS.avg.fill,
                    borderColor:         COGNITIVE_COLORS.avg.border,
                    borderWidth:         2,
                    borderDash:          [6, 3],
                    pointBackgroundColor:COGNITIVE_COLORS.avg.point,
                    pointBorderColor:    '#ffffff',
                    pointRadius:         4,
                    pointHoverRadius:    6,
                    pointBorderWidth:    2
                }
            ]
        };
    }

    // ── OPCIONES RADAR RIASEC ────────────────────────────────────────────────
    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10,3,47,0.92)',
                titleColor:      '#fff',
                bodyColor:       'rgba(255,255,255,0.85)',
                borderColor:     'rgba(255,255,255,0.15)',
                borderWidth:     1,
                padding:         10,
                cornerRadius:    8,
                callbacks: { label: ctx => `${ctx.dataset.label}: ${ctx.parsed.r}%` }
            }
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize:       20,
                    color:          'rgba(0,0,0,0)',
                    backdropColor:  'transparent',
                    font:           { size: 9 }
                },
                grid:        { color: 'rgba(255,255,255,0.15)', circular: true },
                pointLabels: { color: 'rgb(160,161,163)', font: { size: 12, weight: '600' }, padding: 12 },
                angleLines:  { color: 'rgba(255,255,255,0.12)' }
            }
        },
        animation: { duration: 800, easing: 'easeInOutQuart' }
    };

    // ── OPCIONES RADAR COGNITIVO ─────────────────────────────────────────────
    const cognitiveOptions = {
        responsive:           true,
        maintainAspectRatio:  false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10,3,47,0.92)',
                titleColor:      '#fff',
                bodyColor:       'rgba(255,255,255,0.85)',
                borderColor:     'rgba(255,255,255,0.15)',
                borderWidth:     1,
                padding:         12,
                cornerRadius:    8,
                callbacks: {
                    label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.r} pts`
                }
            }
        },
        scales: {
            r: {
                beginAtZero: true,
                min:         0,
                max:         60,
                ticks: {
                    stepSize:      15,
                    color:         'rgba(255,255,255,0.35)',
                    backdropColor: 'transparent',
                    font:          { size: 9 }
                },
                grid:        { color: 'rgba(255,255,255,0.12)' },
                pointLabels: {
                    color: 'rgba(255,255,255,0.9)',
                    font:  { size: 13, weight: '700' },
                    padding: 14
                },
                angleLines: { color: 'rgba(255,255,255,0.1)' }
            }
        },
        animation: { duration: 900, easing: 'easeInOutQuart' }
    };

    // ── DATOS Y OPCIONES DE BARRAS ───────────────────────────────────────────
    const BAR_TOP = { bg: 'rgba(79,195,247,0.75)',  border: 'rgba(79,195,247,1)' };
    const BAR_LOW = { bg: 'rgba(236,64,122,0.70)',  border: 'rgba(236,64,122,1)' };

    function makeBarDataset(data, color) {
        return [{
            label:           'Porcentaje',
            data,
            backgroundColor: color.bg,
            borderColor:     color.border,
            borderWidth:     1.5,
            borderRadius:    6,
            borderSkipped:   false
        }];
    }

    function buildBarData(l) {
        return {
            topSkills:    { labels: l.topSkills,    datasets: makeBarDataset([91.89, 88.96, 88.78], BAR_TOP) },
            topInterests: { labels: l.topInterests, datasets: makeBarDataset([76.85, 62.16],         BAR_TOP) },
            topCareers:   { labels: l.topCareers,   datasets: makeBarDataset([78.38, 73.0, 71.6],   BAR_TOP) },
            lowSkills:    { labels: l.lowSkills,    datasets: makeBarDataset([1.25, 14.86, 18.92],  BAR_LOW) },
            lowInterests: { labels: l.lowInterests, datasets: makeBarDataset([28.38, 30.63, 37.84], BAR_LOW) },
            lowCareers:   { labels: l.lowCareers,   datasets: makeBarDataset([24.3, 24.3, 24.3],    BAR_LOW) },
            valoresOcupacionales: {
                labels:   l.valoresOcupacionales,
                datasets: makeBarDataset([95, 98, 96, 97, 90], BAR_TOP)
            },
        };
    }

    const barOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10,3,47,0.92)',
                padding:         12,
                titleColor:      '#fff',
                bodyColor:       'rgba(255,255,255,0.85)',
                borderColor:     'rgba(255,255,255,0.15)',
                borderWidth:     1,
                cornerRadius:    8,
                callbacks: { label: ctx => '  ' + ctx.parsed.x.toFixed(1) + '%' }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                grid:   { color: 'rgba(255,255,255,0.06)', drawBorder: false },
                border: { display: false },
                ticks:  { color: 'rgba(255,255,255,0.45)', font: { size: 10 }, callback: v => v + '%', maxTicksLimit: 5 }
            },
            y: {
                grid:   { display: false },
                border: { display: false },
                ticks:  { color: 'rgba(255,255,255,0.9)', font: { size: 11, weight: '600' }, padding: 6 }
            }
        },
        layout:    { padding: { right: 8 } },
        animation: { duration: 700, easing: 'easeInOutQuart' }
    };

    // ── CANVAS DE BARRAS POR SUB-SECCIÓN ─────────────────────────────────────
    // El radar RIASEC y el cognitivo NO aparecen aquí — tienen ciclos propios.
    const SECTION_BAR_CHARTS = {
        profile:   ['topSkillsChart', 'topInterestsChart', 'topCareersChart',
                    'lowSkillsChart', 'lowInterestsChart', 'lowCareersChart'],
        aptitudes: ['valoresOcupacionalesChart'],
        proyecto:  []
    };

    function getActiveSectionKey() {
        const el = document.querySelector('.vocational-section-content.active');
        return el ? el.getAttribute('data-section-content') : 'profile';
    }

    // ════════════════════════════════════════════════════════════════════════
    // CICLO DE VIDA: RADAR RIASEC — persistente mientras la tab esté abierta
    // ════════════════════════════════════════════════════════════════════════
    function createRadar() {
        if (radarChart) return;
        const ctx = document.getElementById('vocationalRadarChart');
        if (!ctx) return;
        radarChart = new Chart(ctx, {
            type:    'radar',
            data:    buildRadarData(getL()),
            options: radarOptions
        });
        console.log(`✓ Radar RIASEC creado (${getCurrentLang()})`);
    }

    function destroyRadar() {
        if (radarChart) {
            radarChart.destroy();
            radarChart = null;
            console.log('✓ Radar RIASEC destruido');
        }
    }

    // Actualización suave de etiquetas al cambiar idioma (sin parpadeo)
    function updateRadarLabels() {
        if (!radarChart) return;
        radarChart.data = buildRadarData(getL());
        radarChart.update();
        console.log(`✓ Radar RIASEC actualizado a idioma: ${getCurrentLang()}`);
    }

    // ════════════════════════════════════════════════════════════════════════
    // CICLO DE VIDA: RADAR COGNITIVO — activo solo en sub-sección "aptitudes"
    // ════════════════════════════════════════════════════════════════════════
    function createCognitiveChart() {
        if (cognitiveChart) return;
        const ctx = document.getElementById('cognitiveRadarChart');
        if (!ctx) return;
        cognitiveChart = new Chart(ctx, {
            type:    'radar',
            data:    buildCognitiveData(getL()),
            options: cognitiveOptions
        });
        console.log(`✓ Radar Cognitivo creado (${getCurrentLang()})`);
    }

    function destroyCognitiveChart() {
        if (cognitiveChart) {
            cognitiveChart.destroy();
            cognitiveChart = null;
            console.log('✓ Radar Cognitivo destruido');
        }
    }

    // Actualización suave de etiquetas al cambiar idioma
    function updateCognitiveLabels() {
        if (!cognitiveChart) return;
        cognitiveChart.data = buildCognitiveData(getL());
        cognitiveChart.update();
        console.log(`✓ Cognitivo actualizado a idioma: ${getCurrentLang()}`);
    }

    // Decide si crear o destruir el cognitivo según la sub-sección activa
    function syncCognitiveChart() {
        const sectionKey = getActiveSectionKey();
        if (sectionKey === 'aptitudes') {
            // Pequeño delay para que el DOM esté visible antes de medir el canvas
            setTimeout(createCognitiveChart, 100);
        } else {
            destroyCognitiveChart();
        }
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
        const l          = getL();
        const bar        = buildBarData(l);
        const sectionKey = getActiveSectionKey();
        const allowedIds = SECTION_BAR_CHARTS[sectionKey] || [];

        if (!allowedIds.length) {
            console.log(`✓ Sub-sección "${sectionKey}" no tiene canvas de barras.`);
            return;
        }

        const allPairs = [
            ['topSkillsChart',            bar.topSkills],
            ['topInterestsChart',         bar.topInterests],
            ['topCareersChart',           bar.topCareers],
            ['lowSkillsChart',            bar.lowSkills],
            ['lowInterestsChart',         bar.lowInterests],
            ['lowCareersChart',           bar.lowCareers],
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
    // Llamar desde el sistema de traducción cuando el usuario cambia de idioma.
    window.refreshVocationalCharts = function () {
        const statsContent = document.getElementById('vocational-stats-content');
        if (!statsContent || !statsContent.classList.contains('active')) return;

        updateRadarLabels();      // RIASEC: actualización suave in-place
        updateCognitiveLabels();  // Cognitivo: actualización suave in-place
        destroyBarCharts();
        createBarCharts();        // Barras: recrear con nuevas etiquetas
    };

    // ── FILTROS DE SUB-SECCIONES ─────────────────────────────────────────────
    const sectionButtons  = document.querySelectorAll('.vocational-section-btn');
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

            // Barras y cognitivo rotan; el radar RIASEC permanece intacto y visible
            setTimeout(() => {
                destroyBarCharts();
                createBarCharts();
                syncCognitiveChart();
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
                // Entró a la tab → crear radar RIASEC persistente + lo que toque por sub-sección
                setTimeout(() => {
                    createRadar();
                    destroyBarCharts();
                    createBarCharts();
                    syncCognitiveChart();
                }, 150);
            } else if (wasActive && !isActive) {
                // Salió de la tab → liberar todo
                destroyBarCharts();
                destroyRadar();
                destroyCognitiveChart();
            }

            wasActive = isActive;
        });

        observer.observe(vocationalStatsContent, { attributes: true, attributeFilter: ['class'] });

        // Si la tab ya está activa al cargar la página
        if (wasActive) {
            setTimeout(() => {
                createRadar();
                createBarCharts();
                syncCognitiveChart();
            }, 150);
        }
    }
});