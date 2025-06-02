using System.Globalization;
using System.Security.Claims;
using System.Text.Json;
using DocScanner.Data;
using DocScanner.Models;
using DocScanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
}
