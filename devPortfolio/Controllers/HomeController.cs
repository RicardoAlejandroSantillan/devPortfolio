using System.Diagnostics;
using devPortfolio.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Localization;

namespace devPortfolio.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        // Ruta por defecto (español)
        public IActionResult Index()
        {
            SetLanguageCookie("es");
            return View();
        }

        // Ruta con idioma específico: /es o /en
        [Route("{lang}")]
        public IActionResult IndexWithLanguage(string lang)
        {
            // Validar que el idioma sea válido
            if (lang != "es" && lang != "en")
            {
                // Si el idioma no es válido, redirigir a español
                return RedirectToAction("Index");
            }

            SetLanguageCookie(lang);
            return View("Index");
        }

        // Método para cambiar idioma vía AJAX
        [HttpPost]
        public IActionResult SetLanguage(string language, string returnUrl)
        {
            if (string.IsNullOrEmpty(language) || (language != "es" && language != "en"))
            {
                language = "es";
            }

            SetLanguageCookie(language);

            if (!string.IsNullOrEmpty(returnUrl) && Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }

            return RedirectToAction("Index");
        }

        // Método privado para establecer la cookie
        private void SetLanguageCookie(string language)
        {
            Response.Cookies.Append(
                CookieRequestCultureProvider.DefaultCookieName,
                CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(language)),
                new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddYears(1),
                    HttpOnly = false, // Permitir acceso desde JavaScript
                    Secure = false, // Cambiar a true en producción con HTTPS
                    SameSite = SameSiteMode.Lax,
                    Path = "/"
                }
            );

            // También establecer ViewBag para usar en la vista
            ViewBag.CurrentLanguage = language;
        }

        // Obtener el idioma actual
        [HttpGet]
        public IActionResult GetCurrentLanguage()
        {
            var language = GetLanguageFromCookie() ?? "es";
            return Json(new { language });
        }

        // Método privado para leer la cookie
        private string? GetLanguageFromCookie()
        {
            var cookie = Request.Cookies[CookieRequestCultureProvider.DefaultCookieName];
            if (!string.IsNullOrEmpty(cookie))
            {
                var culture = CookieRequestCultureProvider.ParseCookieValue(cookie);
                return culture?.Cultures.FirstOrDefault().Value;
            }
            return null;
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}