using System.Text;
using DocScanner.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDefaultIdentity<IdentityUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddHttpClient();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// JWT configuration
var key = Encoding.ASCII.GetBytes("Q3VzdG9tU2VjdXJlS2V5MTIzIT8kJV4mKigpXy0r");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddAuthorization();

builder.Services.AddCoreAdmin(); // Optional: set admin password


var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();


app.UseCoreAdminCustomAuth(async (serviceProvider) =>
{
    var httpContext = serviceProvider.GetRequiredService<IHttpContextAccessor>().HttpContext;
    var authHeader = httpContext.Request.Headers["Authorization"].ToString();

    if (authHeader?.StartsWith("Basic ") == true)
    {
        var encodedCredentials = authHeader["Basic ".Length..].Trim();
        var credentialBytes = Convert.FromBase64String(encodedCredentials);
        var credentials = Encoding.UTF8.GetString(credentialBytes).Split(':', 2);

        if (credentials.Length == 2)
        {
            var username = credentials[0];
            var password = credentials[1];

            if (username == "admin" && password == "admin")
            {
                return true;
            }
        }
    }

    httpContext.Response.Headers["WWW-Authenticate"] = "Basic realm=\"AdminPanel\"";
    httpContext.Response.StatusCode = 401;
    await httpContext.Response.WriteAsync("Unauthorized");
    return false;
});

app.UseCoreAdminCustomUrl("adminpanel");


app.UseCors("AllowReactFrontend");

app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();
app.MapRazorPages();

app.UseStaticFiles();
app.MapDefaultControllerRoute();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "auth",
    pattern: "auth/{controller=Auth}/{action=Index}/{id?}");

app.Logger.LogInformation("✅ Application started and routes are mapped.");

app.Run();
