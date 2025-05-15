using CampusHub.Server.Data;
using CampusHub.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CampusHub.Server.Controllers
{
    [Route("api/grades")]
    [ApiController]
    public class GradesController : ControllerBase
    {
        private readonly UserManager<UserAccount> _userManager;
        private readonly AppDbContext _context;
        public GradesController(UserManager<UserAccount> userManager, AppDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("getAllGrades")]
        public async Task<ActionResult<IEnumerable<Grade>>> GetAllGrades()
        {
            var subjects = await _context.Grades.ToListAsync();
            return Ok(subjects);
        }

        [HttpGet("getGradeById/{id}")]
        public async Task<ActionResult<Grade>> GetGradeById(int id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null)
            {
                return NotFound();
            }
            return Ok(grade);
        }

        [HttpPost("addGrade")]
        public async Task<IActionResult> AddGrade([FromBody] AddGradeModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Find the student (UserAccount) by their Id
            var user = await _userManager.FindByIdAsync(model.UserAccountId);
            if (user == null)
                return NotFound(new { Error = "User not found" });

            // Find the subject by Id
            var subject = await _context.Subjects.FindAsync(model.SubjectId);
            if (subject == null)
                return NotFound(new { Error = "Subject not found" });

            // Check if the student already has a grade for this subject
            var existingGrade = await _context.Grades
                .FirstOrDefaultAsync(g => g.UserAccountId == model.UserAccountId && g.SubjectId == model.SubjectId);

            if (existingGrade != null)
                return BadRequest(new { Error = "Grade already exists for this subject" });

            // Create a new grade
            var grade = new Grade
            {
                UserAccountId= (string) model.UserAccountId,
                SubjectId = model.SubjectId,
                Value = model.GradeValue
            };

            // Add the grade to the database
            await _context.Grades.AddAsync(grade);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Grade added successfully" });
        }


        [HttpGet("getGradesByStudentId")]
        public async Task<IActionResult> GetGradesForUser(string userId)
        {
            var grades = await _context.Grades
                .Where(g => g.UserAccountId == userId)
                .Include(g => g.Subject) // Optional: include related subject info
                .ToListAsync();

            if (grades == null || !grades.Any())
            {
                return NotFound(new { error = "No grades found for this user." });
            }

            return Ok(grades);
        }
    }
}
