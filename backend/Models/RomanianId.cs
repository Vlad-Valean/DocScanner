using Microsoft.AspNetCore.Identity;

namespace DocScanner.Models;

public class RomanianId
{
    public int Id { get; set; }
    public string? UserId { get; set; }
    public IdentityUser? User { get; set; }
    public string? Nume { get; set; }
    public string? Prenume { get; set; }
    public string? Cnp { get; set; }
    public string? Cetatenie { get; set; }
    public string? Sex { get; set; }
    public DateTime? DataNasterii { get; set; }
    public DateTime? Validitate { get; set; }
    public string? Domiciliu { get; set; }
    public string? Serie { get; set; }
    public string? Numar { get; set; }
    public string? LocNastere { get; set; }
    public string? PhotoUrl { get; set; }
}