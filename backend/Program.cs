using System.IdentityModel.Tokens.Jwt;
using System.Text;
using DocScanner.Data;
using DocScanner.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// --- Constants ---
const string adminUsername = "admin";
const string adminPassword = "admin";
const string corsPolicyName = "AllowReactFrontend";
var jwtSecret = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtSecret))
{
    throw new Exception("JWT secret is not configured. Please set Jwt:Key in appsettings.json.");
}

// --- Claim Mapping Fix ---
JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Remove("sub");

// --- Add Services ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDefaultIdentity<IdentityUser>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddScoped<IdCardParserService>();
builder.Services.AddHttpClient();

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSecret)),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddAuthorization();
builder.Services.AddRazorPages();
builder.Services.AddControllersWithViews();
builder.Services.AddCoreAdmin();

var app = builder.Build();

// --- Seed Roles, Admin, and MenuItems ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<ApplicationDbContext>();
    var userManager = services.GetRequiredService<UserManager<IdentityUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    await DbSeeder.SeedAsync(dbContext, userManager, roleManager);
}

// --- Middleware ---
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Redirect root "/" to "/panel"
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/")
    {
        context.Response.Redirect("/panel");
        return;
    }
    await next();
});

app.UseRouting();
app.UseCors(corsPolicyName);
app.UseAuthentication();
app.UseAuthorization();

// --- Admin Auth Middleware ---
app.UseCoreAdminCustomAuth(async services =>
{
    var httpContext = services.GetRequiredService<IHttpContextAccessor>().HttpContext;
    var authHeader = httpContext?.Request.Headers["Authorization"].ToString();

    if (authHeader?.StartsWith("Basic ") == true)
    {
        var credentials = Encoding.UTF8
            .GetString(Convert.FromBase64String(authHeader["Basic ".Length..].Trim()))
            .Split(':', 2);

        if (credentials is [adminUsername, adminPassword])
            return true;
    }

    if (httpContext != null)
    {
        httpContext.Response.Headers["WWW-Authenticate"] = "Basic realm=\"AdminPanel\"";
        httpContext.Response.StatusCode = 401;
        await httpContext.Response.WriteAsync("Unauthorized");
    }

    return false;
});

app.UseCoreAdminCustomUrl("panel");

// --- Route Mapping ---
app.MapControllers();
app.MapRazorPages();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "auth",
    pattern: "auth/{controller=Auth}/{action=Index}/{id?}");

app.Logger.LogInformation("✅ Application started and routes are mapped.");

await app.RunAsync();
