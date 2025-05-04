using System;
using System.IO;
using System.Security.Claims;
using System.Threading.Tasks;
using CampusHub.Server.Data;
using CampusHub.Server.Models;
using CampusHub.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace CampusHub.Server.Controllers
{
    //[Authorize]
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

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] DocumentUploadDto dto)
        {
            try
            {
                var userId = "b17bcce2-1cf3-45e6-9f1f-6bab6a6d51e2"; // temporar hardcoded, ca să nu folosești JWT

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
