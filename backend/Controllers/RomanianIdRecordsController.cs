using DocScanner.Data;
using DocScanner.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace @_.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/RomanianIdRecords")]
    public class RomanianIdRecordsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public RomanianIdRecordsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: RomanianIdRecords
        [HttpGet("")]
        public async Task<IActionResult> Index()
        {
            return View(await _context.RomanianIds.ToListAsync());
        }

        // GET: RomanianIdRecords/Details/5
        [HttpGet("Details/{id}")]
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var romanianIdRecord = await _context.RomanianIds
                .FirstOrDefaultAsync(m => m.Id == id);
            if (romanianIdRecord == null)
            {
                return NotFound();
            }

            return View(romanianIdRecord);
        }

        // GET: RomanianIdRecords/Create
        [HttpGet("Create")]
        public IActionResult Create()
        {
            return View();
        }

        // POST: RomanianIdRecords/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost("Create")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Nume,Prenume,CNP,Cetatenie,Sex,DataNasterii,Validitate,Domiciliu,Serie,Numar,LocNastere")] RomanianIdRecord romanianIdRecord)
        {
            if (ModelState.IsValid)
            {
                _context.Add(romanianIdRecord);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(romanianIdRecord);
        }

        // GET: RomanianIdRecords/Edit/5
        [HttpGet("Edit/{id}")]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var romanianIdRecord = await _context.RomanianIds.FindAsync(id);
            if (romanianIdRecord == null)
            {
                return NotFound();
            }
            return View(romanianIdRecord);
        }

        // POST: RomanianIdRecords/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost("Edit/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Nume,Prenume,CNP,Cetatenie,Sex,DataNasterii,Validitate,Domiciliu,Serie,Numar,LocNastere")] RomanianIdRecord romanianIdRecord)
        {
            if (id != romanianIdRecord.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(romanianIdRecord);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RomanianIdRecordExists(romanianIdRecord.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(romanianIdRecord);
        }

        // GET: RomanianIdRecords/Delete/5
        [HttpGet("Delete/{id}")]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var romanianIdRecord = await _context.RomanianIds
                .FirstOrDefaultAsync(m => m.Id == id);
            if (romanianIdRecord == null)
            {
                return NotFound();
            }

            return View(romanianIdRecord);
        }

        // POST: RomanianIdRecords/Delete/5
        [HttpPost("Delete/{id}"), ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var romanianIdRecord = await _context.RomanianIds.FindAsync(id);
            if (romanianIdRecord != null)
            {
                _context.RomanianIds.Remove(romanianIdRecord);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool RomanianIdRecordExists(int id)
        {
            return _context.RomanianIds.Any(e => e.Id == id);
        }
    }
}
