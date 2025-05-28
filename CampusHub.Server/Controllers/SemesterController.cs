using CampusHub.Server.Data;
using CampusHub.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CampusHub.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SemestersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SemestersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Semester>>> GetSemesters()
        {
            return await _context.Semesters.Include(s => s.AcademicYear).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Semester>> CreateSemester(Semester semester)
        {
            _context.Semesters.Add(semester);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSemesters), new { id = semester.Id }, semester);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSemester(int id, Semester semester)
        {
            if (id != semester.Id)
                return BadRequest();

            _context.Entry(semester).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSemester(int id)
        {
            var semester = await _context.Semesters.FindAsync(id);
            if (semester == null) return NotFound();

            _context.Semesters.Remove(semester);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
