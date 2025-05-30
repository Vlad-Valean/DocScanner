using System.Globalization;
using System.Text.Json;
using DocScanner.Data;
using DocScanner.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace @_.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "User")]
public class UserApiController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;

    public UserApiController(ApplicationDbContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromForm] IFormFile? photo)
    {
        if (photo == null || photo.Length == 0)
            return BadRequest("No file uploaded.");

        using var client = _httpClientFactory.CreateClient();
        using var content = new MultipartFormDataContent();
        await using var stream = photo.OpenReadStream();
        content.Add(new StreamContent(stream), "photo", photo.FileName);

        var response = await client.PostAsync("http://localhost:8000/ocr", content);
        if (!response.IsSuccessStatusCode)
            return StatusCode(500, "Failed to OCR image.");

        var json = await response.Content.ReadAsStringAsync();
        var data = JsonSerializer.Deserialize<OcrResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        var record = ParseTextToIdRecord(data?.Text ?? "");
        _context.RomanianIds.Add(record);
        await _context.SaveChangesAsync();

        return Ok(record);
    }

    private RomanianIdRecord ParseTextToIdRecord(string text)
    {
        var record = new RomanianIdRecord();

        string? ExtractMrz(string input)
        {
            int startIndex = input.IndexOf("IDROU", StringComparison.Ordinal);
            if (startIndex == -1) return null;
            var mrz = input.Substring(startIndex).Trim();
            int maxLength = 128;
            return mrz.Length > maxLength ? mrz.Substring(0, maxLength) : mrz;
        }

        // ReSharper disable once ReturnTypeCanBeNotNullable
        string? ParseYymmddToDate(string yymmdd)
        {
            if (yymmdd.Length != 6)
                throw new ArgumentException("Input must be 6 digits in YYMMDD format.");

            int year = int.Parse(yymmdd.Substring(0, 2));
            int month = int.Parse(yymmdd.Substring(2, 2));
            int day = int.Parse(yymmdd.Substring(4, 2));
            year += year >= 50 ? 1900 : 2000;

            return new DateTime(year, month, day).ToString("dd/MM/yyyy");
        }

        Dictionary<string, string?> ParseRomanianIdmrz(string? mrz)
        {
            var result = new Dictionary<string, string?>();
            try
            {
                mrz = mrz?.Substring(5);
                // ReSharper disable once UseCollectionExpression
                string?[]? nameParts = mrz?.Split(separator: new[] { "<<" }, StringSplitOptions.None);
                string? lastName = nameParts?[0];
                var firstName = nameParts?[1]?.Replace("<", "");

                result["Nume"] = lastName;
                result["Prenume"] = firstName;

                if (mrz != null)
                {
                    int serieIndex = mrz.IndexOf("TZ", StringComparison.Ordinal);
                    if (serieIndex == -1) throw new Exception("Serie not found");

                    var serie = mrz.Substring(serieIndex, 2);
                    var nr = mrz.Substring(serieIndex + 2, 6);
                    result["Serie"] = serie;
                    result["NR"] = nr;

                    string rest = mrz.Substring(serieIndex + 10);
                    var cetatenie = rest.Substring(0, 3);
                    string birthDate = rest.Substring(3, 6);
                    char sex = rest[10];
                    string invalidationDate = rest.Substring(11, 6);
                    string lastCnpDigits = rest.Substring(rest.Length - 7, 6);
                    // ReSharper disable once UseIndexFromEndExpression
                    char firstCnpDigit = rest[rest.Length - 8];
                    var cnp = $"{firstCnpDigit}{birthDate}{lastCnpDigits}";

                    result["Cetatenie"] = cetatenie;
                    result["DataNasterii"] = ParseYymmddToDate(birthDate);
                    result["Validitate"] = ParseYymmddToDate(invalidationDate);
                    result["Sex"] = sex.ToString();
                    result["CNP"] = cnp;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error parsing MRZ: " + ex.Message);
            }
            return result;
        }

        Dictionary<string, string?> mrzData = ParseRomanianIdmrz(ExtractMrz(text));
        record.Nume = mrzData["Nume"];
        record.Prenume = mrzData["Prenume"];
        record.CNP = mrzData["CNP"];
        record.Sex = mrzData["Sex"];

        var locIndex = text.IndexOf("Place of birth", StringComparison.Ordinal) + "Place of birth".Length;
        var locLen = text.IndexOf("Domiciliu", StringComparison.Ordinal) - locIndex;
        record.LocNastere = text.Substring(locIndex, locLen).Trim();

        var domIndex = text.IndexOf("Address", StringComparison.Ordinal) + "Address".Length;
        var domLen = text.IndexOf("evo TM", StringComparison.Ordinal) - domIndex - 4;
        record.Domiciliu = text.Substring(domIndex, domLen).Trim();

        if (DateTime.TryParseExact(mrzData["DataNasterii"], "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedBirth))
            record.DataNasterii = DateTime.SpecifyKind(parsedBirth, DateTimeKind.Utc);

        if (DateTime.TryParseExact(mrzData["Validitate"], "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedValid))
            record.Validitate = DateTime.SpecifyKind(parsedValid, DateTimeKind.Utc);

        record.Cetatenie = mrzData["Cetatenie"];
        record.Serie = mrzData["Serie"];
        record.Numar = mrzData["NR"];

        return record;
    }
}
