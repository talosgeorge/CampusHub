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

        [HttpGet("getMyGrades")]
        [Authorize(Roles = "student")]
        public async Task<IActionResult> GetMyGrades()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { error = "User ID not found in token" });

            var grades = await _context.Grades
                .Include(g => g.Subject)
                .Where(g => g.UserAccountId == userId)
                .Select(g => new GradeDto
                {
                    GradeId = g.GradeId,
                    Value = g.Value,
                    Date = g.Date,
                    SemesterId = g.SemesterId,
                    SubjectName = g.Subject.SubjectName,
                    Credits = g.Subject.Credits
                })
                .ToListAsync();

            return Ok(grades);
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
                Value = model.GradeValue,
                SemesterId = model.SemesterId
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
                .Include(g => g.Subject)
                .Include(g => g.UserAccount)
                    .ThenInclude(u => u.UserDetails)
                .Select(g => new
                {
                    gradeId = g.GradeId,
                    value = g.Value,
                    date = g.Date,
                    userAccountId = g.UserAccountId,
                    subjectId = g.SubjectId,
                    semesterId = g.SemesterId,
                    subjectName = g.Subject.SubjectName,
                    credits = g.Subject.Credits,
                    fullName = g.UserAccount.UserDetails != null
                     ? $"{(g.UserAccount.UserDetails.prenume ?? "")} {(g.UserAccount.UserDetails.nume ?? "")}".Trim()
                     : "Unknown",
                    academicYear = g.Semester.AcademicYear.YearLabel,
                    semesterName = g.Semester.Name
                })
                .ToListAsync();

            if (!grades.Any())
                return NotFound(new { error = "No grades found for this user." });

            return Ok(grades);
        }



        [HttpPut("updateGrade/{id}")]
        public async Task<IActionResult> UpdateGrade(int id, [FromBody] AddGradeModel model)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null)
                return NotFound(new { error = "Grade not found" });

            grade.Value = model.GradeValue;
            grade.SubjectId = model.SubjectId;
            grade.SemesterId = model.SemesterId;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Grade updated successfully" });
        }

        [HttpDelete("deleteGrade/{id}")]
        public async Task<IActionResult> DeleteGrade(int id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null)
                return NotFound(new { error = "Grade not found" });

            _context.Grades.Remove(grade);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Grade deleted successfully" });
        }
        [HttpGet("getAllStudentsBasic")]
        public async Task<IActionResult> GetAllStudentsBasic()
        {
            var students = await _userManager.GetUsersInRoleAsync("student");

            var studentList = await _context.UserAccounts
                .Include(u => u.UserDetails)
                .Where(u => students.Select(s => s.Id).Contains(u.Id))
                .Select(u => new
                {
                    id = u.Id,
                    email = u.Email,
                    fullName = u.UserDetails != null && u.UserDetails.prenume != null && u.UserDetails.nume != null
                        ? $"{u.UserDetails.prenume} {u.UserDetails.nume}"
                        : u.Email ?? u.UserName
                })
                .ToListAsync();

            return Ok(studentList);
        }
    }
}
