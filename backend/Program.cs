using DocScanner.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Register PostgreSQL + Identity
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDefaultIdentity<IdentityUser>(options =>
    {
        options.SignIn.RequireConfirmedAccount = false;
    })
    .AddRoles<IdentityRole>() // <- IMPORTANT: Add roles support
    .AddEntityFrameworkStores<ApplicationDbContext>();

// Add MVC + Razor
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages(); // needed for Identity and Blazor

var app = builder.Build();

// 🔐 Seed Roles and Users
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

    var roles = new[] { "User", "Reviewer", "Admin" };

    foreach (var role in roles)
    {
        if (!await roleManager.RoleExistsAsync(role))
        {
            await roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    // Seed Admin
    var admin = await userManager.FindByEmailAsync("admin@example.com");
    if (admin == null)
    {
        admin = new IdentityUser { UserName = "admin@example.com", Email = "admin@example.com", EmailConfirmed = true };
        await userManager.CreateAsync(admin, "Admin@123");
        await userManager.AddToRoleAsync(admin, "Admin");
    }

    // Seed Reviewer
    var reviewer = await userManager.FindByEmailAsync("reviewer@example.com");
    if (reviewer == null)
    {
        reviewer = new IdentityUser { UserName = "reviewer@example.com", Email = "reviewer@example.com", EmailConfirmed = true };
        await userManager.CreateAsync(reviewer, "Reviewer@123");
        await userManager.AddToRoleAsync(reviewer, "Reviewer");
    }

    // Seed Simple User
    var user = await userManager.FindByEmailAsync("user@example.com");
    if (user == null)
    {
        user = new IdentityUser { UserName = "user@example.com", Email = "user@example.com", EmailConfirmed = true };
        await userManager.CreateAsync(user, "User@123");
        await userManager.AddToRoleAsync(user, "User");
    }
}

// Middleware
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers(); // <-- this is required for API routes like /api/RomanianIdRecord

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
app.Logger.LogInformation("✅ Application started and routes are mapped.");

// Standard routes
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Admin route under /api
app.MapControllerRoute(
    name: "admin",
    pattern: "api/{controller=AdminPanel}/{action=Index}/{id?}");

// Identity + Razor Pages
app.MapRazorPages();

app.Run();