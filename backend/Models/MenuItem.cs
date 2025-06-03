namespace DocScanner.Models
{
    public enum MenuType
    {
        Setting,
        Page
    }

    public class MenuItem
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public string Path { get; set; } = "";
        public string? Roles { get; set; } = "";
        public MenuType Type { get; set; }
    }
}

