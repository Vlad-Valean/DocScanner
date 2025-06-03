using System.Security.Claims;
using System.Text.Json;
using DocScanner.Data;
using DocScanner.Models;
using DocScanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DocScanner.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User")]
public class UserApiController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IdCardParserService _parserService;
    private readonly IConfiguration _configuration;

    public UserApiController(
        ApplicationDbContext context,
        IHttpClientFactory httpClientFactory,
        IdCardParserService parserService,
        IConfiguration configuration)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _parserService = parserService;
        _configuration = configuration;
    }


    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] IFormFile? photo)
    {
        if (photo == null || photo.Length == 0)
            return BadRequest("No file uploaded.");

        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        foreach (var claim in User.Claims)
        {
            Console.WriteLine($"Claim: {claim.Type} = {claim.Value}");
        }

        if (userId == null)
        {
            return Unauthorized("User ID not found in token.");
        }

        using var client = _httpClientFactory.CreateClient();
        using var content = new MultipartFormDataContent();
        await using var stream = photo.OpenReadStream();
        content.Add(new StreamContent(stream), "photo", photo.FileName);

        string ocrServiceUrl = _configuration["OcrService:Url"] ?? "http://localhost:8000/ocr";

        var response = await client.PostAsync(ocrServiceUrl, content);
        if (!response.IsSuccessStatusCode)
            return StatusCode(500, "Failed to OCR image.");

        var json = await response.Content.ReadAsStringAsync();
        var data = JsonSerializer.Deserialize<OcrResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        var record = _parserService.ParseTextToIdRecord(data?.Text ?? string.Empty, userId);

        _context.RomanianIds.Add(record);
        await _context.SaveChangesAsync();

        return Ok(record);
    }

    [HttpPost("update")]
    public async Task<IActionResult> Update([FromBody] RomanianId updatedRecord)
    {
        var userId = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return Unauthorized("User ID not found.");

        var existingRecord = await _context.RomanianIds
            .FirstOrDefaultAsync(r => r.UserId == userId && r.Id == updatedRecord.Id);

        if (existingRecord == null)
            return NotFound("Record not found for user.");

        // Optional validation
        if (updatedRecord.Serie?.Length != 2 || updatedRecord.Numar?.Length != 6)
            return BadRequest("Invalid ID data.");

        // Update actual fields
        existingRecord.Nume = updatedRecord.Nume;
        existingRecord.Prenume = updatedRecord.Prenume;
        existingRecord.Cnp = updatedRecord.Cnp;
        existingRecord.Cetatenie = updatedRecord.Cetatenie;
        existingRecord.Sex = updatedRecord.Sex;
        existingRecord.DataNasterii = updatedRecord.DataNasterii;
        existingRecord.Validitate = updatedRecord.Validitate;
        existingRecord.Domiciliu = updatedRecord.Domiciliu;
        existingRecord.Serie = updatedRecord.Serie;
        existingRecord.Numar = updatedRecord.Numar;
        existingRecord.LocNastere = updatedRecord.LocNastere;

        await _context.SaveChangesAsync();

        return Ok(existingRecord);
    }
}
