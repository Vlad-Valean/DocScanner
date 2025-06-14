using DocScanner.Data;
using DocScanner.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DocScanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Requires user to be logged in
    public class UserSettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public UserSettingsController(ApplicationDbContext context, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        private string EnumToTheme(Theme theme)
        {
            switch (theme)
            {
                case Theme.System:
                    return "system";
                case Theme.Light:
                    return "light";
                case Theme.Dark:
                    return "dark";
                default:
                    return "system";
            }
        }

        private Theme ThemeToEnum(string theme)
        {
            switch (theme)
            {
                case "system":
                    return Theme.System;
                case "light":
                    return Theme.Light;
                case "dark":
                    return Theme.Dark;
                default:
                    return Theme.System;
            }
        }

        [HttpGet]
        public async Task<ActionResult<UserSettingDto>> GetSettings()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var setting = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == user.Id);

            if (setting == null)
            {
                setting = new UserSetting
                {
                    UserId = user.Id,
                    Theme = Theme.System
                };

                _context.UserSettings.Add(setting);
                await _context.SaveChangesAsync();
            }

            return Ok(new UserSettingDto
            {
                ProfilePictureUrl = setting.ProfilePictureUrl,
                Theme = EnumToTheme(setting.Theme)
            });
        }

        [HttpPost]
        public async Task<ActionResult> UpdateSettings(UserSettingDto dto)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var setting = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == user.Id);
            if (setting == null)
            {
                setting = new UserSetting { UserId = user.Id };
                _context.UserSettings.Add(setting);
            }

            setting.ProfilePictureUrl = dto.ProfilePictureUrl;
            setting.Theme = ThemeToEnum(dto.Theme.ToLower());

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("upload-profile-picture")]
        public async Task<IActionResult> UploadProfilePicture(IFormFile? file, [FromServices] IWebHostEnvironment env)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized();

            var uploadsFolder = Path.Combine(env.WebRootPath, "uploads");
            Directory.CreateDirectory(uploadsFolder); // Ensure folder exists

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var imageUrl = $"/uploads/{fileName}";

            // Save to user's settings
            var setting = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == user.Id);
            if (setting == null)
            {
                setting = new UserSetting { UserId = user.Id };
                _context.UserSettings.Add(setting);
            }

            setting.ProfilePictureUrl = imageUrl;
            await _context.SaveChangesAsync();

            return Ok(new { imageUrl });
        }
        
    }
}
