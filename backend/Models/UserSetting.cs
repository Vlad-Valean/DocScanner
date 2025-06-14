using Microsoft.AspNetCore.Identity;

namespace DocScanner.Models
{
    public enum Theme
    {
        System,
        Light,
        Dark
    }

    public class UserSetting
    {
        public int Id { get; set; }

        public string? ProfilePictureUrl { get; set; }

        public Theme Theme { get; set; } = Theme.System;

        // Optional: Link to user if needed
        public string UserId { get; set; } = default!;
        public IdentityUser User { get; set; } = default!;
    }
}