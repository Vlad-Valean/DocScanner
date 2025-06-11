using Microsoft.AspNetCore.Identity;

namespace DocScanner.Models
{
    public enum Theme
    {
        // ReSharper disable once InconsistentNaming
        system,
        // ReSharper disable once InconsistentNaming
        light,
        // ReSharper disable once InconsistentNaming
        dark
    }

    public class UserSetting
    {
        public int Id { get; set; }

        public string? ProfilePictureUrl { get; set; }

        public Theme Theme { get; set; } = Theme.system;

        // Optional: Link to user if needed
        public string UserId { get; set; } = default!;
        public IdentityUser User { get; set; } = default!;
    }
}