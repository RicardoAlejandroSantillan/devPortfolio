// Ejecutar inmediatamente para configurar las variables CSS antes de que se renderice
(function () {
    const width = 2560;
    const height = 2560;

    function generateStars(numStars, width, height, opacity) {
        return Array.from({ length: numStars }, () => {
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);
            return `${x}px ${y}px rgba(255, 255, 255, ${opacity})`;
        }).join(", ");
    }

    // Configurar las variables CSS inmediatamente
    document.documentElement.style.setProperty('--smallStars', generateStars(1700, width, height, 0.5));
    document.documentElement.style.setProperty('--mediumStars', generateStars(700, width, height, 0.8));
    document.documentElement.style.setProperty('--largeStars', generateStars(200, width, height, 1));
})();

// Función para crear estrellas fugaces
function createShootingStar() {
    const shootingStar = document.createElement("div");
    shootingStar.classList.add("shooting-star");

    shootingStar.style.top = `${Math.random() * window.innerHeight * 0.7}px`;
    shootingStar.style.left = `${Math.random() * window.innerWidth * 0.7}px`;

    const shootingStarsContainer = document.querySelector(".shooting-stars");
    if (shootingStarsContainer) {
        shootingStarsContainer.appendChild(shootingStar);

        shootingStar.addEventListener("animationend", () => {
            shootingStar.remove();
        });
    }
}

// Inicializar las estrellas fugaces cuando el DOM esté listo
function randomizeShootingStars() {
    setInterval(() => {
        if (Math.random() > 0.7) {
            createShootingStar();
        }
    }, Math.random() * 2000 + 1000);
}

// Esperar a que el DOM esté listo para las estrellas fugaces
document.addEventListener("DOMContentLoaded", () => {
    randomizeShootingStars();
});