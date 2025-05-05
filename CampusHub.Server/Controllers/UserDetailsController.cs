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
        public async Task<ActionResult<UserDetailsDto>> GetMyDetails()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Message = "User not authenticated" });

                var details = await _context.UserDetails
                    .FirstOrDefaultAsync(ud => ud.UserId == userId);

                if (details == null)
                    return NotFound(new { Message = "User details not found" });

                return Ok(MapToDto(details));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user details");
                return StatusCode(500, new
                {
                    Message = "Internal server error",
                    Error = ex.Message
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpsertDetails([FromBody] UserDetailsDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new
                    {
                        Message = "Invalid data",
                        Errors = ModelState.Values.SelectMany(v => v.Errors)
                    });

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Message = "User not authenticated" });

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return NotFound(new { Message = "User not found" });

                var dataNasterii = dto.DataNasterii; 

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
                        dataNasterii = dataNasterii,
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

                    await _context.UserDetails.AddAsync(newDetails);
                }
                else
                {
                    existingDetails.cnp = dto.Cnp;
                    existingDetails.nrMatricol = dto.NrMatricol;
                    existingDetails.facultate = dto.Facultate;
                    existingDetails.dataNasterii = dataNasterii;
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

                    _context.UserDetails.Update(existingDetails);
                }

                await _context.SaveChangesAsync();

                var updatedDetails = await _context.UserDetails
                    .FirstOrDefaultAsync(ud => ud.UserId == userId);

                return Ok(MapToDto(updatedDetails));
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while saving user details");
                return StatusCode(500, new
                {
                    Message = "Database save failed",
                    Error = ex.InnerException?.Message ?? ex.Message
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while saving user details");
                return StatusCode(500, new
                {
                    Message = "Internal server error",
                    Error = ex.Message
                });
            }
        }

        private UserDetailsDto MapToDto(UserDetails details)
        {
            return new UserDetailsDto
            {
                Cnp = details.cnp,
                NrMatricol = details.nrMatricol,
                Facultate = details.facultate,
                DataNasterii = details.dataNasterii,
                Nume = details.nume,
                Prenume = details.prenume,
                PrenumeTata = details.prenumeTata,
                PrenumeMama = details.prenumeMama,
                Sex = details.sex,
                JudetulNasterii = details.judetulNasterii,
                LocalitateaNasterii = details.localitateaNasterii,
                Nationalitate = details.nationalitate,
                SeriaBuletin = details.seriaBuletin,
                NumarBuletin = details.numarBuletin,
                Adresa = details.adresa
            };
        }
    }
}