using CampusHub.Server.Data;
using CampusHub.Server.DTOs;
using CampusHub.Server.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CampusHub.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class UserDetailsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<UserAccount> _userManager;
        private readonly ILogger<UserDetailsController> _logger;

        public UserDetailsController(
            AppDbContext context,
            UserManager<UserAccount> userManager,
            ILogger<UserDetailsController> logger)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet("my")]
        public async Task<ActionResult<UserDetails>> GetMyDetails()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var details = await _context.UserDetails
                    .Include(ud => ud.User)
                    .FirstOrDefaultAsync(ud => ud.UserId == userId);

                return details == null ? NotFound() : Ok(details);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user details");
                return StatusCode(500, "Internal server error");
            }
        }

        
        [HttpPost]
        public async Task<IActionResult> UpsertDetails([FromBody] UserDetailsDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var existingDetails = await _context.UserDetails
                    .FirstOrDefaultAsync(ud => ud.UserId == userId);

                if (existingDetails == null)
                {
                    var newDetails = new UserDetails
                    {
                        UserId = userId,
                        cnp = dto.Cnp,
                        nrMatricol = dto.NrMatricol,
                        facultate = dto.Facultate,
                        dataNasterii = dto.DataNasterii,
                        nume = dto.Nume,
                        prenume = dto.Prenume,
                        prenumeTata = dto.PrenumeTata,
                        prenumeMama = dto.PrenumeMama,
                        sex = dto.Sex,
                        judetulNasterii = dto.JudetulNasterii,
                        localitateaNasterii = dto.LocalitateaNasterii,
                        nationalitate = dto.Nationalitate,
                        seriaBuletin = dto.SeriaBuletin,
                        numarBuletin = dto.NumarBuletin,
                        adresa = dto.Adresa
                    };

                    _context.UserDetails.Add(newDetails);
                }
                else
                {
                    existingDetails.cnp = dto.Cnp;
                    existingDetails.nrMatricol = dto.NrMatricol;
                    existingDetails.facultate = dto.Facultate;
                    existingDetails.dataNasterii = dto.DataNasterii;
                    existingDetails.nume = dto.Nume;
                    existingDetails.prenume = dto.Prenume;
                    existingDetails.prenumeTata = dto.PrenumeTata;
                    existingDetails.prenumeMama = dto.PrenumeMama;
                    existingDetails.sex = dto.Sex;
                    existingDetails.judetulNasterii = dto.JudetulNasterii;
                    existingDetails.localitateaNasterii = dto.LocalitateaNasterii;
                    existingDetails.nationalitate = dto.Nationalitate;
                    existingDetails.seriaBuletin = dto.SeriaBuletin;
                    existingDetails.numarBuletin = dto.NumarBuletin;
                    existingDetails.adresa = dto.Adresa;
                }

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving user details");
                return StatusCode(500, "Internal server error");
            }
        }

    }
}