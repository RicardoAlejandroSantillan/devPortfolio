document.addEventListener('DOMContentLoaded', () => {
    console.log('Vocational charts system initialized');

    let charts = {};

    // PALETA RIASEC
    const RIASEC_COLORS = {
        realistic: { border: '#c2185b', fill: 'rgba(194,24,91,0.18)', point: '#c2185b' },
        investigative: { border: '#e91e63', fill: 'rgba(233,30,99,0.18)', point: '#e91e63' },
        artistic: { border: '#ffb74d', fill: 'rgba(255,183,77,0.18)', point: '#ffb74d' },
        social: { border: '#ff9800', fill: 'rgba(255,152,0,0.18)', point: '#ff9800' },
        enterprising: { border: '#ff7043', fill: 'rgba(255,112,67,0.22)', point: '#ff7043' },
        conventional: { border: '#ec407a', fill: 'rgba(236,64,122,0.15)', point: '#ec407a' },
    };

    // LABELS DEL RADAR
    const RADAR_LABELS = [
        'Mecánica', 'Destreza manual', 'Físicas', 'Científicas', 'Visualización',
        'Investigación', 'Creatividad', 'Expresión', 'Comunicación', 'Ayudar a otros',
        'Enseñar', 'Conocer gente', 'Negocios', 'Emprendedor', 'Dirigir gente',
        'Administración', 'Organización', 'Gestión de datos'
    ];

    function makeEmpty() {
        return new Array(RADAR_LABELS.length).fill(0);
    }

    // Realista
    const realisticVals = makeEmpty();
    realisticVals[0] = 50; realisticVals[1] = 44; realisticVals[2] = 14;
    // Investigador
    const investigativeVals = makeEmpty();
    investigativeVals[3] = 56; investigativeVals[4] = 91; investigativeVals[5] = 37;
    // Artístico
    const artisticVals = makeEmpty();
    artisticVals[6] = 33; artisticVals[7] = 0;
    // Social
    const socialVals = makeEmpty();
    socialVals[8] = 36; socialVals[10] = 70; socialVals[11] = 54;
    // Emprendedor
    const enterprisingVals = makeEmpty();
    enterprisingVals[12] = 55; enterprisingVals[13] = 68; enterprisingVals[14] = 47;
    // Convencional
    const conventionalVals = makeEmpty();
    conventionalVals[15] = 83; conventionalVals[16] = 62; conventionalVals[17] = 83;

    const radarData = {
        labels: RADAR_LABELS,
        datasets: [
            {
                label: 'Realista', data: realisticVals,
                backgroundColor: RIASEC_COLORS.realistic.fill,
                borderColor: RIASEC_COLORS.realistic.border,
                borderWidth: 1.5,
                pointBackgroundColor: RIASEC_COLORS.realistic.point,
                pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 5,
            },
            {
                label: 'Investigador', data: investigativeVals,
                backgroundColor: RIASEC_COLORS.investigative.fill,
                borderColor: RIASEC_COLORS.investigative.border,
                borderWidth: 1.5,
                pointBackgroundColor: RIASEC_COLORS.investigative.point,
                pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 5,
            },
            {
                label: 'Artístico', data: artisticVals,
                backgroundColor: RIASEC_COLORS.artistic.fill,
                borderColor: RIASEC_COLORS.artistic.border,
                borderWidth: 1.5,
                pointBackgroundColor: RIASEC_COLORS.artistic.point,
                pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 5,
            },
            {
                label: 'Sociales', data: socialVals,
                backgroundColor: RIASEC_COLORS.social.fill,
                borderColor: RIASEC_COLORS.social.border,
                borderWidth: 1.5,
                pointBackgroundColor: RIASEC_COLORS.social.point,
                pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 5,
            },
            {
                label: 'Emprendedor', data: enterprisingVals,
                backgroundColor: RIASEC_COLORS.enterprising.fill,
                borderColor: RIASEC_COLORS.enterprising.border,
                borderWidth: 1.5,
                pointBackgroundColor: RIASEC_COLORS.enterprising.point,
                pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 5,
            },
            {
                label: 'Convencional', data: conventionalVals,
                backgroundColor: RIASEC_COLORS.conventional.fill,
                borderColor: RIASEC_COLORS.conventional.border,
                borderWidth: 1.5,
                pointBackgroundColor: RIASEC_COLORS.conventional.point,
                pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 5,
            },
        ]
    };

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
                beginAtZero: true, max: 100,
                ticks: { stepSize: 20, color: 'rgba(0,0,0,0)', backdropColor: 'transparent', font: { size: 9 } },
                grid: { color: 'rgba(255,255,255,0.15)', circular: true },
                pointLabels: {
                    color: 'rgb(160, 161, 163)',
                    font: { size: 12, weight: '600' },
                    padding: 12,
                    backdropPadding: { x: 5, y: 2 },
                },
                angleLines: { color: 'rgba(255,255,255,0.12)' }
            }
        },
        animation: { duration: 800, easing: 'easeInOutQuart' }
    };

    // DATOS DE BARRAS
    const BAR_TOP = { bg: 'rgba(79,195,247,0.75)', border: 'rgba(79,195,247,1)' };
    const BAR_LOW = { bg: 'rgba(236,64,122,0.70)', border: 'rgba(236,64,122,1)' };
    const BAR_NEUTRAL = { bg: 'rgba(156,39,176,0.70)', border: 'rgba(156,39,176,1)' };

    // ── SECCIÓN 1: RESUMEN DE PERFIL ──
    const topSkillsData = {
        labels: ['Visualización', 'Gestión de datos', 'Administración'],
        datasets: [{
            label: 'Porcentaje', data: [91.89, 88.96, 88.78],
            backgroundColor: BAR_TOP.bg, borderColor: BAR_TOP.border,
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false
        }]
    };
    const topInterestsData = {
        labels: ['Convencionales', 'Investigación'],
        datasets: [{
            label: 'Porcentaje', data: [76.85, 62.16],
            backgroundColor: BAR_TOP.bg, borderColor: BAR_TOP.border,
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false
        }]
    };
    const topCareersData = {
        labels: ['Administración Pública', 'Mercadotecnia', 'Auditor'],
        datasets: [{
            label: 'Porcentaje', data: [78.38, 73.0, 71.6],
            backgroundColor: BAR_TOP.bg, borderColor: BAR_TOP.border,
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false
        }]
    };
    const lowSkillsData = {
        labels: ['Expresión', 'Físicas', 'Ayudar a otros'],
        datasets: [{
            label: 'Porcentaje', data: [1.25, 14.86, 18.92],
            backgroundColor: BAR_LOW.bg, borderColor: BAR_LOW.border,
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false
        }]
    };
    const lowInterestsData = {
        labels: ['Artístico', 'Realistas', 'Sociales'],
        datasets: [{
            label: 'Porcentaje', data: [28.38, 30.63, 37.84],
            backgroundColor: BAR_LOW.bg, borderColor: BAR_LOW.border,
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false
        }]
    };
    const lowCareersData = {
        labels: ['Planeación Territorial', 'Metalurgia y Materiales', 'Urbana'],
        datasets: [{
            label: 'Porcentaje', data: [24.3, 24.3, 24.3],
            backgroundColor: BAR_LOW.bg, borderColor: BAR_LOW.border,
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false
        }]
    };

    // SECCIÓN 2: APTITUDES Y COMPETENCIAS
    const aptitudesDesarrolladasData = {
        labels: ['Capacidad numérica', 'Análisis', 'Lectura y estudio', 'Observación', 'Organización'],
        datasets: [{
            label: 'Nivel', data: [90, 85, 88, 82, 87],
            backgroundColor: BAR_TOP.bg, borderColor: BAR_TOP.border,
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false
        }]
    };
    const competenciasEspecificasData = {
        labels: ['Trabajo en Equipo', 'Confianza', 'Independencia', 'Iniciativa', 'Solución de Problemas'],
        datasets: [{
            label: 'Nivel', data: [85, 88, 80, 83, 90],
            backgroundColor: BAR_TOP.bg, borderColor: BAR_TOP.border,
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false
        }]
    };
    const aptitudesPorDesarrollarData = {
        labels: ['Autoridad', 'Estado físico', 'Persuasión', 'Reflejos', 'Sangre fría'],
        datasets: [{
            label: 'Nivel', data: [45, 40, 50, 48, 42],
            backgroundColor: BAR_NEUTRAL.bg, borderColor: BAR_NEUTRAL.border,
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false
        }]
    };
    const competenciasPorDesarrollarData = {
        labels: ['Optimismo', 'Paciencia', 'Empatía', 'Competitividad', 'Creatividad'],
        datasets: [{
            label: 'Nivel', data: [60, 55, 58, 52, 65],
            backgroundColor: BAR_NEUTRAL.bg, borderColor: BAR_NEUTRAL.border,
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false
        }]
    };

    // SECCIÓN 3: PROYECTO DE VIDA
    const valoresOcupacionalesData = {
        labels: ['Esfuerzo', 'Honestidad', 'Respeto', 'Responsabilidad', 'Servicio'],
        datasets: [{
            label: 'Importancia', data: [95, 98, 96, 97, 90],
            backgroundColor: BAR_TOP.bg, borderColor: BAR_TOP.border,
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false
        }]
    };

    // OPCIONES DE BARRAS
    const barOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(10,3,47,0.92)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: 'rgba(255,255,255,0.85)',
                borderColor: 'rgba(255,255,255,0.15)',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: { label: ctx => '  ' + ctx.parsed.x.toFixed(1) + (ctx.dataset.label === 'Porcentaje' ? '%' : '') }
            }
        },
        scales: {
            x: {
                beginAtZero: true, max: 100,
                grid: { color: 'rgba(255,255,255,0.06)', drawBorder: false },
                border: { display: false },
                ticks: {
                    color: 'rgba(255,255,255,0.45)',
                    font: { size: 10 },
                    callback: v => v + '%',
                    maxTicksLimit: 5,
                }
            },
            y: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: 'rgba(255,255,255,0.9)',
                    font: { size: 11, weight: '600' },
                    padding: 6,
                }
            }
        },
        layout: { padding: { right: 8 } },
        animation: { duration: 700, easing: 'easeInOutQuart' }
    };

    // CREAR GRÁFICOS
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
            ['aptitudesDesarrolladasChart', aptitudesDesarrolladasData],
            ['competenciasEspecificasChart', competenciasEspecificasData],
            ['aptitudesPorDesarrollarChart', aptitudesPorDesarrollarData],
            ['competenciasPorDesarrollarChart', competenciasPorDesarrollarData],
            ['valoresOcupacionalesChart', valoresOcupacionalesData],
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

    // SISTEMA DE FILTROS DE SECCIONES
    const sectionButtons = document.querySelectorAll('.vocational-section-btn');
    const sectionContents = document.querySelectorAll('.vocational-section-content');

    sectionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.getAttribute('data-section');

            // Actualizar botones
            sectionButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Mostrar contenido correspondiente
            sectionContents.forEach(content => {
                if (content.getAttribute('data-section-content') === targetSection) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });

            // Recrear gráficos para la sección activa
            setTimeout(() => {
                destroyCharts();
                createCharts();
            }, 150);
        });
    });

    // INICIALIZACIÓN
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