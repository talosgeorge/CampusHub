using CampusHub.Server.Models;
using AngularApp1.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
<<<<<<< HEAD
=======
using AngularApp1.Server.Data;
using Microsoft.EntityFrameworkCore;
>>>>>>> main

namespace CampusHub.Server.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<UserAccount> _userManager;
        private readonly IConfiguration _configuration;
<<<<<<< HEAD

        public AccountController(UserManager<UserAccount> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
=======
        private readonly AppDbContext _context;

        public AccountController(UserManager<UserAccount> userManager, IConfiguration configuration, AppDbContext context)
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
>>>>>>> main
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            // Caută utilizatorul fie după username, fie după email
            var user = await _userManager.FindByNameAsync(model.EmailOrUsername)
                    ?? await _userManager.FindByEmailAsync(model.EmailOrUsername);

            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return Unauthorized("Username/email sau parolă incorectă.");

<<<<<<< HEAD
=======
            var roleId = await _context.UserRoles
               .Where(ur => ur.UserId == user.Id)
               .Select(ur => ur.RoleId)
               .FirstOrDefaultAsync();

            var roleName = await _context.Roles
                .Where(r => r.Id == roleId)
                .Select(r => r.Name)
                .FirstOrDefaultAsync();

>>>>>>> main
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName ?? ""),
<<<<<<< HEAD
=======
                 new Claim(ClaimTypes.Role, roleName ?? ""),
>>>>>>> main
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.UtcNow.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
<<<<<<< HEAD
                expiration = token.ValidTo
=======
                expiration = token.ValidTo,
                userId = user.Id.ToString(),
                role = roleName
>>>>>>> main
            });
        }
    }
}
