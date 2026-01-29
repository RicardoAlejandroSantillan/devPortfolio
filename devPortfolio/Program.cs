using Microsoft.AspNetCore.Localization;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// ===== CONFIGURACIÓN DE LOCALIZACIÓN =====
var supportedCultures = new[]
{
    new CultureInfo("es"),
    new CultureInfo("en")
};

builder.Services.Configure<RequestLocalizationOptions>(options =>
{
    options.DefaultRequestCulture = new RequestCulture("es");
    options.SupportedCultures = supportedCultures;
    options.SupportedUICultures = supportedCultures;

    // Configurar proveedores de cultura en orden de prioridad
    options.RequestCultureProviders = new List<IRequestCultureProvider>
    {
        new QueryStringRequestCultureProvider(), // ?culture=es
        new CookieRequestCultureProvider(),      // Cookie
        new AcceptLanguageHeaderRequestCultureProvider() // Header del navegador
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// ===== USAR LOCALIZACIÓN =====
app.UseRequestLocalization();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// ===== RUTA ADICIONAL PARA IDIOMAS =====
app.MapControllerRoute(
    name: "language",
    pattern: "{lang}/{controller=Home}/{action=Index}/{id?}",
    constraints: new { lang = "es|en" });

app.Run();
