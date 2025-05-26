using System.IO;
using System.Threading.Tasks;
using Tesseract;

namespace DocScanner.Services
{
    public class TesseractOcrService : IOcrService
    {
        public async Task<string> ExtractTextAsync(Stream imageStream)
        {
            // Save the stream to a temp file (Tesseract needs a file path)
            var tempFile = Path.GetTempFileName();

            await using (var fileStream = File.Create(tempFile))
            {
                await imageStream.CopyToAsync(fileStream);
            }

            var resultText = "";

            using (var engine = new TesseractEngine(@"./tessdata", "ron", EngineMode.Default))
            {
                using (var img = Pix.LoadFromFile(tempFile))
                {
                    using (var page = engine.Process(img))
                    {
                        resultText = page.GetText();
                    }
                }
            }

            File.Delete(tempFile); // Clean up temp file
            return resultText;
        }
    }
}