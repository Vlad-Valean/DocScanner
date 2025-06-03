// Controllers/MenuItemsController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DocScanner.Data;
using DocScanner.Models;

namespace DocScanner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MenuItemsController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public MenuItemsController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/menuitems?role=Reviewer
        [HttpGet]
        public async Task<ActionResult<List<MenuItem>>> GetAll([FromQuery] string? role)
        {
            var query = _dbContext.MenuItems.AsQueryable();

            if (!string.IsNullOrWhiteSpace(role))
            {
                var items = await query.ToListAsync();
                var filtered = items.Where(item =>
                        (string.IsNullOrEmpty(item.Roles) || item.Roles.Split(',').Any(r => r.Trim() == role))
                        && !(item.Name.Equals("Login") || item.Name.Equals("Register"))
                    ).ToList();

                return Ok(filtered);
            }
            else
            {
                var items = await query.ToListAsync();
                var filtered = items.Where(item => string.IsNullOrEmpty(item.Roles)).ToList();
                return Ok(filtered);
            }

        }
    }
}
