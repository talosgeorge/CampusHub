using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CampusHub.Server.Data;
using CampusHub.Server.Models;

namespace CampusHub.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AcademicYearsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AcademicYearsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AcademicYear>>> GetAll()
        {
            return await _context.AcademicYears.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AcademicYear>> GetById(int id)
        {
            var year = await _context.AcademicYears.FindAsync(id);
            if (year == null) return NotFound();
            return year;
        }

        [HttpPost]
        public async Task<ActionResult<AcademicYear>> Create(AcademicYear year)
        {
            _context.AcademicYears.Add(year);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = year.Id }, year);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AcademicYear year)
        {
            if (id != year.Id)
                return BadRequest();

            _context.Entry(year).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var year = await _context.AcademicYears.FindAsync(id);
            if (year == null) return NotFound();

            _context.AcademicYears.Remove(year);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
