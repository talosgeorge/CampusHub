using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using CampusHub.Server.Models;
using CampusHub.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace CampusHub.Server.Controllers
{
    [Route("api/reg")]
    [ApiController]
    public class RegisterController : ControllerBase
    {
        private readonly UserManager<UserAccount> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RegisterController(UserManager<UserAccount> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Verifying if email exists in database 
            var emailExists = await _userManager.Users
                .AnyAsync(u => u.Email == model.Email);

            if (emailExists)
                return BadRequest(new { Error = "Email already exists" });

            var user = new UserAccount { UserName = model.Username, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Verifică dacă rolul "student" există
            if (!await _roleManager.RoleExistsAsync("student"))
            {
                await _roleManager.CreateAsync(new IdentityRole("student"));
            }

            // Adaugă utilizatorul în rolul "student"
            await _userManager.AddToRoleAsync(user, "student");

            return Ok(new { Message = "User registered successfully " });
        }
    }
}
