using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DocScanner.Data;
using DocScanner.Models;
using DocScanner.Services;

namespace DocScanner.Controllers;



[Authorize]
public class AdminController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly IOcrService _ocrService; // your OCR service interface

    public AdminController(ApplicationDbContext context, IOcrService ocrService)
    {
        _context = context;
        _ocrService = ocrService;
    }

    [HttpGet]
    public IActionResult Upload() => View();

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile photo)
    {
        if (photo == null || photo.Length == 0)
            return View();

        using var stream = photo.OpenReadStream();
        var extractedText = await _ocrService.ExtractTextAsync(stream);

        Console.WriteLine(extractedText);  // or debug breakpoint here
        
        var idRecord = ParseTextToIdRecord(extractedText);

        _context.RomanianIds.Add(idRecord);
        await _context.SaveChangesAsync();

        return RedirectToAction("Index"); // or show success message
    }

    private RomanianIdRecord ParseTextToIdRecord(string text)
    {
        var lines = text.Split('\n') // Split into lines
            .Select(l => l.Trim()) // Remove extra spaces
            .Where(l => !string.IsNullOrWhiteSpace(l)) // Skip empty lines
            .ToList();

        var record = new RomanianIdRecord();

        foreach (var line in lines)
        {
            if (line.StartsWith("Nume", StringComparison.OrdinalIgnoreCase))
                record.Nume = line.Replace("Nume", "", StringComparison.OrdinalIgnoreCase).Trim();

            else if (line.StartsWith("Prenume", StringComparison.OrdinalIgnoreCase))
                record.Prenume = line.Replace("Prenume", "", StringComparison.OrdinalIgnoreCase).Trim();

            else if (line.Contains("CNP"))
                record.CNP = line.Replace("CNP", "", StringComparison.OrdinalIgnoreCase).Trim();

            else if (line.StartsWith("Sex", StringComparison.OrdinalIgnoreCase))
                record.Sex = line.Replace("Sex", "", StringComparison.OrdinalIgnoreCase).Trim();

            else if (line.StartsWith("Domiciliu", StringComparison.OrdinalIgnoreCase))
                record.Domiciliu = line.Replace("Domiciliu", "", StringComparison.OrdinalIgnoreCase).Trim();

            else if (line.Contains("Seria"))
                record.Serie = line.Replace("Seria", "", StringComparison.OrdinalIgnoreCase).Trim();

            else if (line.Contains("Nr"))
                record.Numar = line.Replace("Nr", "", StringComparison.OrdinalIgnoreCase).Trim();
        }

        return record;
    }
}