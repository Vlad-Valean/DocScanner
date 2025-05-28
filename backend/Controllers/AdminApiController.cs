using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace @_.Controllers;

[Authorize(Roles = "Admin")]
[Route("api")]
public class AdminPanelController : Controller
{
    [HttpGet("")]
    public IActionResult Index()
    {
        // ReSharper disable once Mvc.ViewNotResolved
        return View(); // Returns Views/AdminPanel/Index.cshtml
    }
}
