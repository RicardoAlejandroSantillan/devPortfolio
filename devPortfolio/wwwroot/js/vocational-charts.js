document.addEventListener('DOMContentLoaded', () => {
    console.log('Vocational charts system initialized');

    let charts = {};

    // ── FUNCIÓN PARA OBTENER TRADUCCIONES DE CHARTS ──────────────────────────
    // Lee el JSON de idioma ya cargado (localStorage) o usa español por defecto
    function getChartTranslations() {
        const lang = localStorage.getItem('preferredLanguage') || 'es';
        // Las traducciones ya están en window.__vocationalT si translation.js las expuso,
        return window.__vocationalT || null;
    }

    // cuando cambie de idioma. Inicializamos con español como fallback.
    const LABELS = {
        es: {
            radar: ['Mecánica', 'Destreza manual', 'Físicas', 'Científicas', 'Visualización',
                'Investigación', 'Creatividad', 'Expresión', 'Comunicación', 'Ayudar a otros',
                'Enseñar', 'Conocer gente', 'Negocios', 'Emprendedor', 'Dirigir gente',
                'Administración', 'Organización', 'Gestión de datos'],
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
            aptitudesDesarrolladas: [
                'Capacidad numérica',
                'Analizar para encontrar soluciones a problemas o situaciones',
                'Inclinación a la lectura y al estudio',
                'Capacidad de observación',
                'Organizar y dirigir actividades'
            ],
            competenciasEspecificas: [
                'Trabajo en Equipo',
                'Confianza y seguridad',
                'Independencia',
                'Iniciativa',
                'Solución de Problemas'
            ],
            aptitudesPorDesarrollar: [
                'Autoridad',
                'Buen estado físico (Deportes)',
                'Convencer o persuadir a otros',
                'Reflejos rápidos, intuición, vivacidad',
                'Sangre fría ante situaciones extremas'
            ],
            competenciasPorDesarrollar: [
                'Optimismo',
                'Paciencia',
                'Empatía',
                'Competitividad',
                'Creatividad'
            ],
            valoresOcupacionales: ['Esfuerzo', 'Honestidad', 'Respeto', 'Responsabilidad', 'Servicio']
        },
        en: {
            radar: ['Mechanical', 'Manual dexterity', 'Physical', 'Scientific', 'Visualization',
                'Research', 'Creativity', 'Expression', 'Communication', 'Helping others',
                'Teaching', 'Meeting people', 'Business', 'Entrepreneurial', 'Leading people',
                'Administration', 'Organization', 'Data management'],
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
            aptitudesDesarrolladas: [
                'Numerical ability',
                'Analyzing to find solutions to problems or situations',
                'Inclination toward reading and studying',
                'Capacity for observation',
                'Organizing and directing activities'
            ],
            competenciasEspecificas: [
                'Teamwork',
                'Confidence and self-assurance',
                'Independence',
                'Initiative',
                'Problem Solving'
            ],
            aptitudesPorDesarrollar: [
                'Authority',
                'Good physical fitness (Sports)',
                'Convincing or persuading others',
                'Quick reflexes, intuition, sharpness',
                'Composure in extreme situations'
            ],
            competenciasPorDesarrollar: [
                'Optimism',
                'Patience',
                'Empathy',
                'Competitiveness',
                'Creativity'
            ],
            valoresOcupacionales: ['Effort', 'Honesty', 'Respect', 'Responsibility', 'Service']
        }
    };

    function getCurrentLang() {
        return localStorage.getItem('preferredLanguage') || 'es';
    }

    function getL() {
        return LABELS[getCurrentLang()] || LABELS.es;
    }

    // ── PALETA RIASEC ───────────────────────
    const RIASEC_COLORS = {
        realistic: { border: '#c2185b', fill: 'rgba(194,24,91,0.18)', point: '#c2185b' },
        investigative: { border: '#e91e63', fill: 'rgba(233,30,99,0.18)', point: '#e91e63' },
        artistic: { border: '#ffb74d', fill: 'rgba(255,183,77,0.18)', point: '#ffb74d' },
        social: { border: '#ff9800', fill: 'rgba(255,152,0,0.18)', point: '#ff9800' },
        enterprising: { border: '#ff7043', fill: 'rgba(255,112,67,0.22)', point: '#ff7043' },
        conventional: { border: '#ec407a', fill: 'rgba(236,64,122,0.15)', point: '#ec407a' },
    };

    // ── VALORES NUMÉRICOS (sin labels, éstos vienen de LABELS) ───
    function makeEmpty(len) { return new Array(len).fill(0); }

    function buildRadarData(l) {
        const len = l.radar.length;
        const realisticVals = makeEmpty(len); realisticVals[0] = 50; realisticVals[1] = 44; realisticVals[2] = 14;
        const investigativeVals = makeEmpty(len); investigativeVals[3] = 56; investigativeVals[4] = 91; investigativeVals[5] = 37;
        const artisticVals = makeEmpty(len); artisticVals[6] = 33; artisticVals[7] = 0;
        const socialVals = makeEmpty(len); socialVals[8] = 36; socialVals[10] = 70; socialVals[11] = 54;
        const enterprisingVals = makeEmpty(len); enterprisingVals[12] = 55; enterprisingVals[13] = 68; enterprisingVals[14] = 47;
        const conventionalVals = makeEmpty(len); conventionalVals[15] = 83; conventionalVals[16] = 62; conventionalVals[17] = 83;

        return {
            labels: l.radar,
            datasets: [
                { label: l.datasets.realistic, data: realisticVals, backgroundColor: RIASEC_COLORS.realistic.fill, borderColor: RIASEC_COLORS.realistic.border, borderWidth: 1.5, pointBackgroundColor: RIASEC_COLORS.realistic.point, pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 5 },
                { label: l.datasets.investigative, data: investigativeVals, backgroundColor: RIASEC_COLORS.investigative.fill, borderColor: RIASEC_COLORS.investigative.border, borderWidth: 1.5, pointBackgroundColor: RIASEC_COLORS.investigative.point, pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 5 },
                { label: l.datasets.artistic, data: artisticVals, backgroundColor: RIASEC_COLORS.artistic.fill, borderColor: RIASEC_COLORS.artistic.border, borderWidth: 1.5, pointBackgroundColor: RIASEC_COLORS.artistic.point, pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 5 },
                { label: l.datasets.social, data: socialVals, backgroundColor: RIASEC_COLORS.social.fill, borderColor: RIASEC_COLORS.social.border, borderWidth: 1.5, pointBackgroundColor: RIASEC_COLORS.social.point, pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 5 },
                { label: l.datasets.enterprising, data: enterprisingVals, backgroundColor: RIASEC_COLORS.enterprising.fill, borderColor: RIASEC_COLORS.enterprising.border, borderWidth: 1.5, pointBackgroundColor: RIASEC_COLORS.enterprising.point, pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 5 },
                { label: l.datasets.conventional, data: conventionalVals, backgroundColor: RIASEC_COLORS.conventional.fill, borderColor: RIASEC_COLORS.conventional.border, borderWidth: 1.5, pointBackgroundColor: RIASEC_COLORS.conventional.point, pointBorderColor: '#fff', pointRadius: 3, pointHoverRadius: 5 },
            ]
        };
    }

    // ── OPCIONES RADAR ────
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

    // ── COLORES BARRAS ──────
    const BAR_TOP = { bg: 'rgba(79,195,247,0.75)', border: 'rgba(79,195,247,1)' };
    const BAR_LOW = { bg: 'rgba(236,64,122,0.70)', border: 'rgba(236,64,122,1)' };
    const BAR_NEUTRAL = { bg: 'rgba(156,39,176,0.70)', border: 'rgba(156,39,176,1)' };

    function makeBarDataset(data, color) {
        return [{
            label: 'Porcentaje', data,
            backgroundColor: color.bg, borderColor: color.border,
            borderWidth: 1.5, borderRadius: 6, borderSkipped: false
        }];
    }

    // ── DATOS DE BARRAS (labels desde getL()) ─────
    function buildBarData(l) {
        return {
            topSkills: { labels: l.topSkills, datasets: makeBarDataset([91.89, 88.96, 88.78], BAR_TOP) },
            topInterests: { labels: l.topInterests, datasets: makeBarDataset([76.85, 62.16], BAR_TOP) },
            topCareers: { labels: l.topCareers, datasets: makeBarDataset([78.38, 73.0, 71.6], BAR_TOP) },
            lowSkills: { labels: l.lowSkills, datasets: makeBarDataset([1.25, 14.86, 18.92], BAR_LOW) },
            lowInterests: { labels: l.lowInterests, datasets: makeBarDataset([28.38, 30.63, 37.84], BAR_LOW) },
            lowCareers: { labels: l.lowCareers, datasets: makeBarDataset([24.3, 24.3, 24.3], BAR_LOW) },
            aptitudesDesarrolladas: { labels: l.aptitudesDesarrolladas, datasets: makeBarDataset([90, 85, 88, 82, 87], BAR_TOP) },
            competenciasEspecificas: { labels: l.competenciasEspecificas, datasets: makeBarDataset([85, 88, 80, 83, 90], BAR_TOP) },
            aptitudesPorDesarrollar: { labels: l.aptitudesPorDesarrollar, datasets: makeBarDataset([45, 40, 50, 48, 42], BAR_NEUTRAL) },
            competenciasPorDesarrollar: { labels: l.competenciasPorDesarrollar, datasets: makeBarDataset([60, 55, 58, 52, 65], BAR_NEUTRAL) },
            valoresOcupacionales: { labels: l.valoresOcupacionales, datasets: makeBarDataset([95, 98, 96, 97, 90], BAR_TOP) },
        };
    }

    // ── OPCIONES DE BARRAS ───────
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
                ticks: { color: 'rgba(255,255,255,0.45)', font: { size: 10 }, callback: v => v + '%', maxTicksLimit: 5 }
            },
            y: {
                grid: { display: false },
                border: { display: false },
                ticks: { color: 'rgba(255,255,255,0.9)', font: { size: 11, weight: '600' }, padding: 6 }
            }
        },
        layout: { padding: { right: 8 } },
        animation: { duration: 700, easing: 'easeInOutQuart' }
    };

    // ── CREAR / DESTRUIR GRÁFICOS ───
    function createCharts() {
        const l = getL();
        const bar = buildBarData(l);

        const radarCtx = document.getElementById('vocationalRadarChart');
        if (radarCtx) {
            charts.radar = new Chart(radarCtx, { type: 'radar', data: buildRadarData(l), options: radarOptions });
        }

        const pairs = [
            ['topSkillsChart', bar.topSkills],
            ['topInterestsChart', bar.topInterests],
            ['topCareersChart', bar.topCareers],
            ['lowSkillsChart', bar.lowSkills],
            ['lowInterestsChart', bar.lowInterests],
            ['lowCareersChart', bar.lowCareers],
            ['aptitudesDesarrolladasChart', bar.aptitudesDesarrolladas],
            ['competenciasEspecificasChart', bar.competenciasEspecificas],
            ['aptitudesPorDesarrollarChart', bar.aptitudesPorDesarrollar],
            ['competenciasPorDesarrollarChart', bar.competenciasPorDesarrollar],
            ['valoresOcupacionalesChart', bar.valoresOcupacionales],
        ];

        pairs.forEach(([id, data]) => {
            const ctx = document.getElementById(id);
            if (ctx) charts[id] = new Chart(ctx, { type: 'bar', data, options: barOptions });
        });

        console.log('✓ Vocational charts created (' + getCurrentLang() + ')');
    }

    function destroyCharts() {
        Object.keys(charts).forEach(k => { if (charts[k]) charts[k].destroy(); });
        charts = {};
    }

    // ── EXPONER FUNCIÓN PARA QUE translation.js LA LLAME AL CAMBIAR IDIOMA ──
    window.refreshVocationalCharts = function () {
        const statsContent = document.getElementById('vocational-stats-content');
        if (statsContent && statsContent.classList.contains('active')) {
            destroyCharts();
            createCharts();
        }
    };

    // ── SISTEMA DE FILTROS DE SECCIONES ────
    const sectionButtons = document.querySelectorAll('.vocational-section-btn');
    const sectionContents = document.querySelectorAll('.vocational-section-content');

    sectionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSection = btn.getAttribute('data-section');
            sectionButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            sectionContents.forEach(content => {
                content.classList.toggle('active', content.getAttribute('data-section-content') === targetSection);
            });
            setTimeout(() => { destroyCharts(); createCharts(); }, 150);
        });
    });

    // ── INICIALIZACIÓN ────
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