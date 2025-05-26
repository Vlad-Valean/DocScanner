using System.IO;
using System.Threading.Tasks;

namespace DocScanner.Services
{
    public interface IOcrService
    {
        Task<string> ExtractTextAsync(Stream imageStream);
    }
}