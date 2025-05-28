using DocScanner.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace @_.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Reviewer")]
public class ReviewerApiController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReviewerApiController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("records")]
    public async Task<IActionResult> GetAllRecords()
    {
        var records = await _context.RomanianIds.ToListAsync();
        return Ok(records);
    }
}