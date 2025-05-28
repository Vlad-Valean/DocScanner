using System.Text.Json;
using System.Text.RegularExpressions;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DocScanner.Data;
using DocScanner.Models;

namespace DocScanner.Controllers;

[Authorize]
public class AdminController : Controller
{
    private readonly ApplicationDbContext _context;

    public AdminController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Index() => View("Index");

    [HttpGet]
    public IActionResult Upload() => View();

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile photo)
    {
        if (photo == null || photo.Length == 0)
            return BadRequest("No file uploaded.");

        // Send the image to the OCR API
        using var client = new HttpClient();
        using var content = new MultipartFormDataContent();
        using var stream = photo.OpenReadStream();
        content.Add(new StreamContent(stream), "photo", photo.FileName);

        var response = await client.PostAsync("http://localhost:8000/ocr", content);
        if (!response.IsSuccessStatusCode)
            return StatusCode(500, "Failed to OCR image.");

        var json = await response.Content.ReadAsStringAsync();
        Console.WriteLine(json);
        var data = JsonSerializer.Deserialize<OcrResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

        var text = data?.Text ?? "";
        Console.WriteLine(text);
        var record = ParseTextToIdRecord(text);
        Console.WriteLine(record);
        // Optionally save to DB
        _context.RomanianIds.Add(record);
        await _context.SaveChangesAsync();

        return View("Index"); // View should accept a RomanianIdRecord model
    }


    private RomanianIdRecord ParseTextToIdRecord(string text)
    {
        var record = new RomanianIdRecord();
        
        string ExtractMRZ(string text)
        {
            // Find where the MRZ starts
            int startIndex = text.IndexOf("IDROU");
            if (startIndex == -1)
                return null;

            // Extract from start to the end of the line (or until you hit a newline or whitespace)
            string mrz = text.Substring(startIndex).Trim();

            // Optionally, if MRZ is always a fixed length (e.g. 64 characters), you can enforce that
            int maxLength = 128; // Adjust if needed
            if (mrz.Length > maxLength)
                mrz = mrz.Substring(0, maxLength);

            return mrz;
        }

        string ParseYYMMDDToDate(string yymmdd)
        {
            if (yymmdd.Length != 6)
                throw new ArgumentException("Input must be exactly 6 digits in YYMMDD format.");

            int pivot = 50;
            int year = int.Parse(yymmdd.Substring(0, 2));
            int month = int.Parse(yymmdd.Substring(2, 2));
            int day = int.Parse(yymmdd.Substring(4, 2));

            // Assume year 2000+ for 00-99
            year += (year >= pivot) ? 1900 : 2000;

            DateTime date;
            try
            {
                date = new DateTime(year, month, day);
            }
            catch (Exception ex)
            {
                throw new ArgumentException("Invalid date format: " + ex.Message);
            }

            return date.ToString("dd/MM/yyyy");
        }

        
        Dictionary<string, string> ParseRomanianIDMRZ(string mrz)
        {
            var result = new Dictionary<string, string>();

            try
            {
                mrz = mrz.Substring(5);

                string[] nameParts = mrz.Split(new[] { "<<" }, StringSplitOptions.None);
                string lastName = nameParts[0];
                string firstName = nameParts[1].Replace("<", "");

                result["Nume"] = lastName;
                result["Prenume"] = firstName;

                int serieIndex = mrz.IndexOf("TZ");
                if (serieIndex == -1)
                    throw new Exception("Serie not found");

                string serie = mrz.Substring(serieIndex, 2);
                string nr = mrz.Substring(serieIndex + 2, 6);
                
                result["Serie"] = serie;
                result["NR"] = nr;

                int restStart = serieIndex + 10;
                string rest = mrz.Substring(restStart);
                Console.WriteLine(rest);

                if (rest.Length < 20)
                    throw new Exception("Remaining MRZ too short");

                string cetatenie = rest.Substring(0, 3);       // starts after control digit
                string birthDate = rest.Substring(3, 6);     // birth date format
                char sex = rest[10];                           // 'M' or 'F'
                string invalidationDate = rest.Substring(11, 6);
                string lastCNPDigits = rest.Substring(rest.Length - 7, 6);  // last 6 digits of CNP
                char firstCNPDigit = rest[rest.Length - 8];                     // first digit of CNP

                string cnp = $"{firstCNPDigit}{birthDate}{lastCNPDigits}";

                result["Validitate"] = ParseYYMMDDToDate(invalidationDate);
                result["DataNasterii"] = ParseYYMMDDToDate(birthDate);
                result["Cetatenie"] = cetatenie;
                result["Sex"] = sex.ToString();
                result["CNP"] = cnp;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error parsing MRZ: " + ex.Message);
            }

            return result;
        }
        
        Dictionary<string, string> mrzData  = ParseRomanianIDMRZ(ExtractMRZ(text));
        record.Nume = mrzData["Nume"];
        record.Prenume = mrzData["Prenume"];
        record.CNP = mrzData["CNP"];
        record.Sex = mrzData["Sex"];

        var LocNastereIndex = text.IndexOf("Place of birth") + "Place of birth".Length;
        var LocNastereLength = text.IndexOf("Domiciliu") - LocNastereIndex;
        record.LocNastere = text.Substring(LocNastereIndex, LocNastereLength);

        var DomiciliuIndex = text.IndexOf("Address") + "Address".Length;
        var DomiciliuLength = text.IndexOf("evo TM") - DomiciliuIndex - 4;
        record.Domiciliu = text.Substring(DomiciliuIndex, DomiciliuLength);
        
        if (DateTime.TryParseExact(mrzData["DataNasterii"], "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedBirth))
        {
            record.DataNasterii = DateTime.SpecifyKind(parsedBirth, DateTimeKind.Utc);
        }
        if (DateTime.TryParseExact(mrzData["Validitate"], "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedValid))
        {
            record.Validitate = DateTime.SpecifyKind(parsedValid, DateTimeKind.Utc);
        }
        record.Cetatenie = mrzData["Cetatenie"];
        record.Serie = mrzData["Serie"];
        record.Numar = mrzData["NR"];

        return record;
    }

}
