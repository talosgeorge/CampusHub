using CampusHub.Server.Data;
using CampusHub.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CampusHub.Server.Controllers
{
    [ApiController]
    [Route("api/faculties")]
    public class FacultiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FacultiesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/faculties
        [HttpGet]
        public async Task<IActionResult> GetFaculties()
        {
            var faculties = await _context.Faculties.ToListAsync();
            return Ok(faculties);
        }

        // GET: api/faculties/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFaculty(int id)
        {
            var faculty = await _context.Faculties.FindAsync(id);
            if (faculty == null)
                return NotFound();

            return Ok(faculty);
        }

        // POST: api/faculties
        [HttpPost]
        public async Task<IActionResult> AddFaculty([FromBody] Faculty faculty)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _context.Faculties.AddAsync(faculty);
            await _context.SaveChangesAsync();

            return Ok(faculty);
        }

        // PUT: api/faculties/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFaculty(int id, [FromBody] Faculty updatedFaculty)
        {
            var faculty = await _context.Faculties.FindAsync(id);
            if (faculty == null)
                return NotFound();

            faculty.Name = updatedFaculty.Name;

            await _context.SaveChangesAsync();
            return Ok(faculty);
        }

        // DELETE: api/faculties/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFaculty(int id)
        {
            var faculty = await _context.Faculties.FindAsync(id);
            if (faculty == null)
                return NotFound();

            _context.Faculties.Remove(faculty);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Faculty deleted successfully." });
        }
    }
}

