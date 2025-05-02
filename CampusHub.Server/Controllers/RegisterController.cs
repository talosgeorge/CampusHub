using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using CampusHub.Server.Models;
using AngularApp1.Server.Models;

namespace CampusHub.Server.Controllers
{
    [Route("api/reg")]
    [ApiController]
    public class RegisterController:ControllerBase
    {
        private readonly UserManager<UserAccount> _userManager;

        public RegisterController(UserManager<UserAccount> userManager)
        {
            _userManager = userManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new UserAccount { UserName = model.Username, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
                return Ok(new { Message = "User registered successfully" });

            return BadRequest(result.Errors);
        }
    }
}
