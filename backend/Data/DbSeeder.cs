using DocScanner.Models;
using Microsoft.AspNetCore.Identity;

namespace DocScanner.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            await context.Database.EnsureCreatedAsync();

            // --- Seed Roles ---
            var roles = new[] { "User", "Reviewer", "Admin" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // --- Seed Admin User ---
            var adminEmail = "admin@local";
            var adminUser = await userManager.FindByNameAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new IdentityUser { UserName = adminEmail, Email = adminEmail, EmailConfirmed = true };
                await userManager.CreateAsync(adminUser, "Admin123!"); // Change password later!
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            // --- Seed Menu Items ---
            if (!context.MenuItems.Any())
            {
                var menuItems = new List<MenuItem>
                {
                    new MenuItem { Name = "Login", Path = "/login", Roles = "", Type = MenuType.Setting },
                    new MenuItem { Name = "Register", Path = "/register", Roles = "", Type = MenuType.Setting },
                    new MenuItem { Name = "Logout", Path = "/logout", Roles = "User,Reviewer,Admin", Type = MenuType.Setting },
                };

                context.MenuItems.AddRange(menuItems);
                await context.SaveChangesAsync();
            }
        }
    }
}
