document.addEventListener('DOMContentLoaded', () => {
    console.log('Vocational charts system initialized');

    let charts = {};

    // ── Paleta RIASEC ──────────────────────────────────────────────────────
    const RIASEC_COLORS = {
        realistic: { border: '#c2185b', fill: 'rgba(194,24,91,0.18)', point: '#c2185b' },
        investigative: { border: '#e91e63', fill: 'rgba(233,30,99,0.18)', point: '#e91e63' },
        artistic: { border: '#ffb74d', fill: 'rgba(255,183,77,0.18)', point: '#ffb74d' },
        social: { border: '#ff9800', fill: 'rgba(255,152,0,0.18)', point: '#ff9800' },
        enterprising: { border: '#ff7043', fill: 'rgba(255,112,67,0.22)', point: '#ff7043' },
        conventional: { border: '#ec407a', fill: 'rgba(236,64,122,0.15)', point: '#ec407a' },
    };

    // ── Ejes del radar ─────────────────────────────────────────────────────
    // Índice → Etiqueta
    //  0  Mecánica
    //  1  Destreza manual
    //  2  Físicas
    //  3  Científicas
    //  4  Visualización
    //  5  Investigación
    //  6  Creatividad
    //  7  Expresión
    //  8  Comunicación
    //  9  Ayudar a otros
    // 10  Enseñar
    // 11  Conocer gente
    // 12  Negocios
    // 13  Emprendedor
    // 14  Dirigir gente
    // 15  Administración
    // 16  Organización
    // 17  Gestión de datos
    const RADAR_LABELS = [
        'Mecánica',
        'Destreza manual',
        'Físicas',
        'Científicas',
        'Visualización',
        'Investigación',
        'Creatividad',
        'Expresión',
        'Comunicación',
        'Ayudar a otros',
        'Enseñar',
        'Conocer gente',
        'Negocios',
        'Emprendedor',
        'Dirigir gente',
        'Administración',
        'Organización',
        'Gestión de datos',
    ];

    function makeEmpty() {
        return new Array(RADAR_LABELS.length).fill(0);
    }

    // ── Realista: Mecánica, Destreza manual, Físicas ───────────────────────
    const realisticVals = makeEmpty();
    realisticVals[0] = 50;   // Mecánica
    realisticVals[1] = 44;   // Destreza manual
    realisticVals[2] = 14;   // Físicas

    // ── Investigador: Científicas, Investigación, Visualización ───────────
    const investigativeVals = makeEmpty();
    investigativeVals[3] = 56;  // Científicas
    investigativeVals[4] = 91;  // Visualización
    investigativeVals[5] = 37;  // Investigación

    // ── Artístico: Creatividad, Expresión ─────────────────────────────────
    const artisticVals = makeEmpty();
    artisticVals[6] = 33;  // Creatividad
    artisticVals[7] = 0;   // Expresión (sin dato)

    // ── Social: Comunicación, Enseñar, Conocer gente ──────────────────────
    const socialVals = makeEmpty();
    socialVals[8] = 36;  // Comunicación
    socialVals[10] = 70;  // Enseñar
    socialVals[11] = 54;  // Conocer gente

    // ── Emprendedor: Negocios, Emprendedor, Dirigir gente ─────────────────
    const enterprisingVals = makeEmpty();
    enterprisingVals[12] = 55;  // Negocios
    enterprisingVals[13] = 68;  // Emprendedor
    enterprisingVals[14] = 47;  // Dirigir gente

    // ── Convencional: Administración, Organización, Gestión de datos ──────
    const conventionalVals = makeEmpty();
    conventionalVals[15] = 83;  // Administración
    conventionalVals[16] = 62;  // Organización
    conventionalVals[17] = 83;  // Gestión de datos

    const radarData = {
        labels: RADAR_LABELS,
        datasets: [
            {
                label: 'Realista',
                data: realisticVals,
                backgroundColor: RIASEC_COLORS.realistic.fill,
                borderColor: RIASEC_COLORS.realistic.border,
                borderWidth: 1.5,
                pointBackgroundColor: RIASEC_COLORS.realistic.point,
                pointBorderColor: '#fff',
                pointRadius: 3,
                pointHoverRadius: 5,
            },
            {
                label: 'Investigador',
                data: investigativeVals,
                backgroundColor: RIASEC_COLORS.investigative.fill,
                borderColor: RIASEC_COLORS.investigative.border,
                borderWidth: 1.5,
                pointBackgroundColor: RIASEC_COLORS.investigative.point,
                pointBorderColor: '#fff',
                pointRadius: 3,
                pointHoverRadius: 5,
            },
            {
                label: 'Artístico',
                data: artisticVals,
                backgroundColor: RIASEC_COLORS.artistic.fill,
                borderColor: RIASEC_COLORS.artistic.border,
                borderWidth: 1.5,
                pointBackgroundColor: RIASEC_COLORS.artistic.point,
                pointBorderColor: '#fff',
                pointRadius: 3,
                pointHoverRadius: 5,
            },
            {
                label: 'Sociales',
                data: socialVals,
                backgroundColor: RIASEC_COLORS.social.fill,
                borderColor: RIASEC_COLORS.social.border,
                borderWidth: 1.5,
                pointBackgroundColor: RIASEC_COLORS.social.point,
                pointBorderColor: '#fff',
                pointRadius: 3,
                pointHoverRadius: 5,
            },
            {
                label: 'Emprendedor',
                data: enterprisingVals,
                backgroundColor: RIASEC_COLORS.enterprising.fill,
                borderColor: RIASEC_COLORS.enterprising.border,
                borderWidth: 1.5,
                pointBackgroundColor: RIASEC_COLORS.enterprising.point,
                pointBorderColor: '#fff',
                pointRadius: 3,
                pointHoverRadius: 5,
            },
            {
                label: 'Convencional',
                data: conventionalVals,
                backgroundColor: RIASEC_COLORS.conventional.fill,
                borderColor: RIASEC_COLORS.conventional.border,
                borderWidth: 1.5,
                pointBackgroundColor: RIASEC_COLORS.conventional.point,
                pointBorderColor: '#fff',
                pointRadius: 3,
                pointHoverRadius: 5,
            },
        ]
    };

    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255,255,255,0.95)',
                titleColor: '#333',
                bodyColor: '#555',
                borderColor: 'rgba(0,0,0,0.1)',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: ctx => `${ctx.dataset.label}: ${ctx.parsed.r}%`
                }
            }
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                    color: 'rgba(0,0,0,0)',
                    backdropColor: 'transparent',
                    font: { size: 9 }
                },
                grid: {
                    color: 'rgba(150,150,150,0.25)',
                    circular: true,
                },
                pointLabels: {
                    color: '#555',
                    font: { size: 11, weight: '400' },
                    padding: 8,
                },
                angleLines: {
                    color: 'rgba(150,150,150,0.2)',
                }
            }
        },
        animation: {
            duration: 800,
            easing: 'easeInOutQuart'
        }
    };

    // ── Datos barras ───────────────────────────────────────────────────────
    const barColor = '#4fc3f7';
    const barBorder = 'rgba(79,195,247,0.8)';

    const topSkillsData = {
        labels: ['Visualización', 'Gestión de datos', 'Administración'],
        datasets: [{ label: 'Porcentaje', data: [91.89, 88.96, 88.78], backgroundColor: barColor, borderColor: barBorder, borderWidth: 1 }]
    };
    const lowSkillsData = {
        labels: ['Expresión', 'Físicas', 'Ayudar a otros'],
        datasets: [{ label: 'Porcentaje', data: [1.25, 14.86, 18.92], backgroundColor: barColor, borderColor: barBorder, borderWidth: 1 }]
    };
    const topInterestsData = {
        labels: ['Convencionales', 'Investigación', 'Emprendedor'],
        datasets: [{ label: 'Porcentaje', data: [76.85, 62.16, 57.21], backgroundColor: barColor, borderColor: barBorder, borderWidth: 1 }]
    };
    const lowInterestsData = {
        labels: ['Artístico', 'Realistas', 'Sociales'],
        datasets: [{ label: 'Porcentaje', data: [28.38, 30.63, 37.84], backgroundColor: barColor, borderColor: barBorder, borderWidth: 1 }]
    };
    const topCareersData = {
        labels: ['Administración Pública', 'Mercadotecnia', 'Auditor'],
        datasets: [{ label: 'Porcentaje', data: [78.38, 73.0, 71.6], backgroundColor: barColor, borderColor: barBorder, borderWidth: 1 }]
    };
    const lowCareersData = {
        labels: ['Planeación Territorial', 'Metalurgia y Materiales', 'Urbana'],
        datasets: [{ label: 'Porcentaje', data: [24.3, 24.3, 24.3], backgroundColor: barColor, borderColor: barBorder, borderWidth: 1 }]
    };

    const barOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1,
                callbacks: { label: ctx => ctx.parsed.x + '%' }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'rgba(255,255,255,0.1)' },
                border: { display: false },
                ticks: {
                    color: 'rgba(255,255,255,0.7)',
                    font: { size: 11 },
                    callback: v => v + '%'
                }
            },
            y: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: 'rgba(255,255,255,0.85)',
                    font: { size: 12, weight: '500' }
                }
            }
        }
    };

    // ── Crear todos los gráficos ───────────────────────────────────────────
    function createCharts() {
        const radarCtx = document.getElementById('vocationalRadarChart');
        if (radarCtx) {
            charts.radar = new Chart(radarCtx, { type: 'radar', data: radarData, options: radarOptions });
        }

        const pairs = [
            ['topSkillsChart', topSkillsData],
            ['topInterestsChart', topInterestsData],
            ['topCareersChart', topCareersData],
            ['lowSkillsChart', lowSkillsData],
            ['lowInterestsChart', lowInterestsData],
            ['lowCareersChart', lowCareersData],
        ];
        pairs.forEach(([id, data]) => {
            const ctx = document.getElementById(id);
            if (ctx) charts[id] = new Chart(ctx, { type: 'bar', data, options: barOptions });
        });

        console.log('✓ Vocational charts created');
    }

    function destroyCharts() {
        Object.keys(charts).forEach(k => { if (charts[k]) charts[k].destroy(); });
        charts = {};
    }

    const vocationalBtn = document.getElementById('vocational-stats');
    if (vocationalBtn) {
        vocationalBtn.addEventListener('click', () => {
            setTimeout(() => { destroyCharts(); createCharts(); }, 150);
        });
    }

    const vocationalStatsContent = document.getElementById('vocational-stats-content');
    if (vocationalStatsContent) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (m.type === 'attributes' && m.attributeName === 'class') {
                    if (vocationalStatsContent.classList.contains('active')) {
                        setTimeout(() => { destroyCharts(); createCharts(); }, 100);
                    }
                }
            });
        });
        observer.observe(vocationalStatsContent, { attributes: true });

        if (vocationalStatsContent.classList.contains('active')) {
            setTimeout(createCharts, 100);
        }
    }
});