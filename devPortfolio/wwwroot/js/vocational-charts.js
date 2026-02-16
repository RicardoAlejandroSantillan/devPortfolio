// vocational-charts.js - Gráficos de estadísticas vocacionales

document.addEventListener('DOMContentLoaded', () => {
    console.log('Vocational charts system initialized');

    let charts = {};

    // Configuración de colores
    const colors = {
        realistic: '#e91e63',
        investigative: '#f06292',
        artistic: '#ffb74d',
        social: '#ff9800',
        enterprising: '#ff7043',
        conventional: '#ec407a',
        bar: '#4fc3f7'
    };

    // Datos del gráfico radar
    const radarData = {
        labels: ['Realista', 'Investigador', 'Artístico', 'Sociales', 'Emprendedor', 'Convencional'],
        datasets: [{
            label: 'Orientación Vocacional',
            data: [65, 85, 45, 70, 60, 75],
            backgroundColor: 'rgba(233, 30, 99, 0.2)',
            borderColor: '#e91e63',
            borderWidth: 2,
            pointBackgroundColor: '#e91e63',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#e91e63'
        }]
    };

    // Datos para habilidades de mayor relevancia
    const topSkillsData = {
        labels: ['Visualización', 'Gestión de datos', 'Administración'],
        datasets: [{
            label: 'Porcentaje',
            data: [91.89, 88.96, 88.78],
            backgroundColor: colors.bar,
            borderColor: 'rgba(79, 195, 247, 0.8)',
            borderWidth: 1
        }]
    };

    // Datos para habilidades de menor relevancia
    const lowSkillsData = {
        labels: ['Expresión', 'Físicas', 'Ayudar a otros'],
        datasets: [{
            label: 'Porcentaje',
            data: [1.25, 14.86, 18.92],
            backgroundColor: colors.bar,
            borderColor: 'rgba(79, 195, 247, 0.8)',
            borderWidth: 1
        }]
    };

    // Datos para intereses de mayor importancia
    const topInterestsData = {
        labels: ['Convencionales', 'Investigación', 'Emprendedor'],
        datasets: [{
            label: 'Porcentaje',
            data: [76.85, 62.16, 57.21],
            backgroundColor: colors.bar,
            borderColor: 'rgba(79, 195, 247, 0.8)',
            borderWidth: 1
        }]
    };

    // Datos para intereses de menor importancia
    const lowInterestsData = {
        labels: ['Artístico', 'Realistas', 'Sociales'],
        datasets: [{
            label: 'Porcentaje',
            data: [28.38, 30.63, 37.84],
            backgroundColor: colors.bar,
            borderColor: 'rgba(79, 195, 247, 0.8)',
            borderWidth: 1
        }]
    };

    // Datos para carreras de mayor importancia
    const topCareersData = {
        labels: ['Administración Pública', 'Mercadotecnia', 'Auditor'],
        datasets: [{
            label: 'Porcentaje',
            data: [78.38, 73.0, 71.6],
            backgroundColor: colors.bar,
            borderColor: 'rgba(79, 195, 247, 0.8)',
            borderWidth: 1
        }]
    };

    // Datos para carreras de menor importancia
    const lowCareersData = {
        labels: ['Planeación Territorial', 'Metalurgia y Materiales', 'Urbana'],
        datasets: [{
            label: 'Porcentaje',
            data: [24.3, 24.3, 24.3],
            backgroundColor: colors.bar,
            borderColor: 'rgba(79, 195, 247, 0.8)',
            borderWidth: 1
        }]
    };

    // Configuración común para gráficos de barras
    const barOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                callbacks: {
                    label: function (context) {
                        return context.parsed.x + '%';
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    font: {
                        size: 11
                    },
                    callback: function (value) {
                        return value + '%';
                    }
                }
            },
            y: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.85)',
                    font: {
                        size: 12,
                        weight: '500'
                    }
                }
            }
        }
    };

    // Configuración del gráfico radar
    const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1
            }
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                    color: 'rgba(255, 255, 255, 0.6)',
                    backdropColor: 'transparent',
                    font: {
                        size: 10
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.15)'
                },
                pointLabels: {
                    color: 'rgba(255, 255, 255, 0.9)',
                    font: {
                        size: 12,
                        weight: '600'
                    }
                },
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.15)'
                }
            }
        }
    };

    // Función para crear los gráficos
    function createCharts() {
        // Gráfico Radar
        const radarCtx = document.getElementById('vocationalRadarChart');
        if (radarCtx) {
            charts.radar = new Chart(radarCtx, {
                type: 'radar',
                data: radarData,
                options: radarOptions
            });
        }

        // Gráficos de barras - Mayor relevancia
        const topSkillsCtx = document.getElementById('topSkillsChart');
        if (topSkillsCtx) {
            charts.topSkills = new Chart(topSkillsCtx, {
                type: 'bar',
                data: topSkillsData,
                options: barOptions
            });
        }

        const topInterestsCtx = document.getElementById('topInterestsChart');
        if (topInterestsCtx) {
            charts.topInterests = new Chart(topInterestsCtx, {
                type: 'bar',
                data: topInterestsData,
                options: barOptions
            });
        }

        const topCareersCtx = document.getElementById('topCareersChart');
        if (topCareersCtx) {
            charts.topCareers = new Chart(topCareersCtx, {
                type: 'bar',
                data: topCareersData,
                options: barOptions
            });
        }

        // Gráficos de barras - Menor relevancia
        const lowSkillsCtx = document.getElementById('lowSkillsChart');
        if (lowSkillsCtx) {
            charts.lowSkills = new Chart(lowSkillsCtx, {
                type: 'bar',
                data: lowSkillsData,
                options: barOptions
            });
        }

        const lowInterestsCtx = document.getElementById('lowInterestsChart');
        if (lowInterestsCtx) {
            charts.lowInterests = new Chart(lowInterestsCtx, {
                type: 'bar',
                data: lowInterestsData,
                options: barOptions
            });
        }

        const lowCareersCtx = document.getElementById('lowCareersChart');
        if (lowCareersCtx) {
            charts.lowCareers = new Chart(lowCareersCtx, {
                type: 'bar',
                data: lowCareersData,
                options: barOptions
            });
        }

        console.log('✓ Vocational charts created');
    }

    // Función para destruir los gráficos
    function destroyCharts() {
        Object.keys(charts).forEach(key => {
            if (charts[key]) {
                charts[key].destroy();
            }
        });
        charts = {};
    }

    // Observar cambios en la sección de estadísticas vocacionales
    const vocationalStatsContent = document.getElementById('vocational-stats-content');
    if (vocationalStatsContent) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (vocationalStatsContent.classList.contains('active')) {
                        setTimeout(() => {
                            destroyCharts();
                            createCharts();
                        }, 100);
                    }
                }
            });
        });

        observer.observe(vocationalStatsContent, {
            attributes: true
        });

        // Crear gráficos si la sección ya está activa
        if (vocationalStatsContent.classList.contains('active')) {
            setTimeout(createCharts, 100);
        }
    }

    console.log('✓ Vocational charts system ready');
});