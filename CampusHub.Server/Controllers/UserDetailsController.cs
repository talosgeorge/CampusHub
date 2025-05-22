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
                {
                    _logger.LogWarning("GET /my: User not authenticated.");
                    return Unauthorized(new { Message = "User not authenticated" });
                }

                var details = await _context.UserDetails
                    .FirstOrDefaultAsync(ud => ud.UserId == userId);

                if (details == null)
                {
                    _logger.LogInformation("GET /my: No UserDetails found for userId {UserId}", userId);
                    return NotFound(new { Message = "User details not found" });
                }

                _logger.LogInformation("GET /my: UserDetails found for userId {UserId}", userId);
                return Ok(MapToDto(details));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GET /my: Unexpected error");
                return StatusCode(500, new
                {
                    Message = "Internal server error",
                    Error = ex.Message,
                    StackTrace = ex.StackTrace
                });
            }
        }


        [HttpPost]
        public async Task<IActionResult> UpsertDetails([FromBody] UserDetailsDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        Message = "Invalid data",
                        Errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)
                    });
                }

                // Validare: nu acceptăm data nașterii în viitor
                if (dto.DataNasterii > DateTime.UtcNow)
                {
                    return BadRequest(new { Message = "Data nașterii nu poate fi în viitor." });
                }

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { Message = "User not authenticated" });

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return NotFound(new { Message = "User not found" });

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
                        adresa = dto.Adresa,
                        Handicap = dto.Handicap
                    };

                    _logger.LogInformation("Adăugare UserDetails nou: {@Details}", newDetails);
                    await _context.UserDetails.AddAsync(newDetails);
                }
                else
                {
                    _logger.LogInformation("Actualizare UserDetails existent: {@Details}", existingDetails);

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
                    existingDetails.Handicap = dto.Handicap;

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
                    Message = "Unexpected server error",
                    Error = ex.Message,
                    Inner = ex.InnerException?.Message
                });
            }
        }
        [HttpDelete("my")]
        public async Task<IActionResult> DeleteMyDetails()
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

                _context.UserDetails.Remove(details);
                await _context.SaveChangesAsync();

                return NoContent(); // 204
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user details");
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
                Id = details.Id,
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
                Adresa = details.adresa,
                Handicap = details.Handicap
            };
        }
    }
}
