using System.Globalization;
using DocScanner.Models;

namespace DocScanner.Services;

public class IdCardParserService
{
    public RomanianId ParseTextToIdRecord(string text, string userId)
    {
        var record = new RomanianId { UserId = userId };

        string? mrz = ExtractMrz(text);
        Dictionary<string, string?> mrzData = ParseRomanianIdMrz(mrz);

        record.Nume = mrzData["Nume"];
        record.Prenume = mrzData["Prenume"];
        record.Cnp = mrzData["CNP"];
        record.Sex = mrzData["Sex"];
        record.Cetatenie = mrzData["Cetatenie"];
        record.Serie = mrzData["Serie"];
        record.Numar = mrzData["NR"];

        if (DateTime.TryParseExact(mrzData["DataNasterii"], "dd/MM/yyyy", CultureInfo.InvariantCulture,
                DateTimeStyles.None, out var parsedBirth))
            record.DataNasterii = DateTime.SpecifyKind(parsedBirth, DateTimeKind.Utc);

        if (DateTime.TryParseExact(mrzData["Validitate"], "dd/MM/yyyy", CultureInfo.InvariantCulture,
                DateTimeStyles.None, out var parsedValid))
            record.Validitate = DateTime.SpecifyKind(parsedValid, DateTimeKind.Utc);

        record.LocNastere = ExtractField(text, "Place of birth", "Domiciliu");
        record.Domiciliu = ExtractField(text, "Address", "evo TM");

        return record;
    }

    private static string? ExtractMrz(string input)
    {
        int startIndex = input.IndexOf("IDROU", StringComparison.Ordinal);
        if (startIndex == -1) return null;
        var mrz = input.Substring(startIndex).Trim();
        return mrz.Length > 128 ? mrz.Substring(0, 128) : mrz;
    }

    private static string ExtractField(string text, string start, string end)
    {
        try
        {
            var startIndex = text.IndexOf(start, StringComparison.Ordinal) + start.Length;
            var endIndex = text.IndexOf(end, StringComparison.Ordinal);
            return text.Substring(startIndex, endIndex - startIndex).Trim();
        }
        catch
        {
            return string.Empty;
        }
    }

    private static string ParseYymmddToDate(string yymmdd)
    {
        if (yymmdd.Length != 6)
            throw new ArgumentException("Input must be 6 digits in YYMMDD format.");

        int year = int.Parse(yymmdd[..2]);
        int month = int.Parse(yymmdd[2..4]);
        int day = int.Parse(yymmdd[4..6]);
        year += year >= 50 ? 1900 : 2000;

        return new DateTime(year, month, day).ToString("dd/MM/yyyy");
    }

    private static Dictionary<string, string?> ParseRomanianIdMrz(string? mrz)
    {
        var result = new Dictionary<string, string?>();
        try
        {
            mrz = mrz?.Substring(5);
            var nameParts = mrz?.Split("<<");
            var lastName = nameParts?[0];
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
}
