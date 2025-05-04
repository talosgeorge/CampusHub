using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using AngularApp1.Server.Data;
using AngularApp1.Server.Models;
using CampusHub.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace CampusHub.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/documente")]
    public class DocumenteController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public DocumenteController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet("user")]
        public IActionResult GetUserDocuments()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var documents = _context.Documente
                    .Where(d => d.UserId == userId)
                    .Select(d => new
                    {
                        d.Id,
                        d.FileName,
                        d.Descriere,
                        TipDocumentNume = d.TipDocument.Nume,
                        DataUpload = d.DataUpload.ToString("yyyy-MM-dd")
                    })
                    .ToList();

                return Ok(documents);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Eroare la extragerea documentelor: {ex.Message}");
            }
        }

        [HttpGet("tipuri")]
        public IActionResult GetTipuriDocumente()
        {
            try
            {
                var tipuri = _context.TipuriDocumente
                    .Select(t => new { t.Id, t.Nume })
                    .ToList();

                return Ok(tipuri);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Eroare la extragerea tipurilor: {ex.Message}");
            }
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] DocumentUploadDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (dto.File == null || dto.File.Length == 0)
                    return BadRequest("Fișierul este invalid.");

                var uploadsPath = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
                Directory.CreateDirectory(uploadsPath);

                var uniqueFileName = Guid.NewGuid() + Path.GetExtension(dto.File.FileName);
                var filePath = Path.Combine(uploadsPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.File.CopyToAsync(stream);
                }

                var document = new Document
                {
                    UserId = userId,
                    TipDocumentId = dto.TipDocumentId,
                    Descriere = dto.Descriere,
                    FileName = dto.File.FileName,
                    FilePath = "/uploads/" + uniqueFileName,
                    DataUpload = DateTime.Now
                };

                _context.Documente.Add(document);
                await _context.SaveChangesAsync();

                return Ok("Document încărcat cu succes!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Eroare la upload: {ex.Message}");
            }
        }

    }
}
