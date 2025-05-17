using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AngularApp1.Server.Data;
using AngularApp1.Server.Models;
using CampusHub.Server.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CampusHub.Server.Controllers
{
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

        // ✅ Upload document
        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] DocumentUploadDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.UserId))
                    return BadRequest(new { message = "userId este necesar." });

                if (dto.File == null || dto.File.Length == 0)
                    return BadRequest(new { message = "Fișierul este invalid." });

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
                    UserId = dto.UserId,
                    TipDocumentId = dto.TipDocumentId,
                    Descriere = dto.Descriere,
                    FileName = dto.File.FileName,
                    FilePath = "/uploads/" + uniqueFileName,
                    DataUpload = DateTime.Now
                };

                _context.Documente.Add(document);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Document încărcat cu succes!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Eroare la upload: {ex.Message}" });
            }
        }

        // ✅ Get documents by userId
        [HttpGet]
        public IActionResult GetDocumentsByUserId([FromQuery] string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                return BadRequest(new { message = "Trebuie să specifici userId în query." });

            var docs = _context.Documente
                .Include(d => d.TipDocument)
                .Where(d => d.UserId == userId)
                .Select(d => new
                {
                    d.Id,
                    d.FileName,
                    d.Descriere,
                    d.DataUpload,
                    TipDocument = d.TipDocument.Nume
                })
                .ToList();

            return Ok(docs);
        }

        // ✅ Get tipuri documente
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
                return StatusCode(500, new { message = $"Eroare la extragerea tipurilor: {ex.Message}" });
            }
        }

        // ✅ Download document
        [HttpGet("{id}")]
        public async Task<IActionResult> Download(int id)
        {
            var document = await _context.Documente.FindAsync(id);
            if (document == null)
                return NotFound(new { message = "Documentul nu a fost găsit." });

            var filePath = Path.Combine(_env.WebRootPath ?? "wwwroot", document.FilePath.TrimStart('/'));
            if (!System.IO.File.Exists(filePath))
                return NotFound(new { message = "Fișierul nu există pe server." });

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(fileBytes, "application/octet-stream", document.FileName);
        }

        // ✅ Delete document
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            try
            {
                var document = await _context.Documente.FindAsync(id);
                if (document == null)
                    return NotFound(new { message = "Documentul nu a fost găsit." });

                var filePath = Path.Combine(_env.WebRootPath ?? "wwwroot", document.FilePath.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);

                _context.Documente.Remove(document);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Document șters cu succes." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Eroare la ștergere: {ex.Message}" });
            }
        }

        // ✅ Update document
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDocument(int id, [FromBody] DocumentUpdateDto dto)
        {
            try
            {
                var document = await _context.Documente.FindAsync(id);
                if (document == null)
                    return NotFound(new { message = "Documentul nu a fost găsit." });

                document.Descriere = dto.Descriere;
                document.TipDocumentId = dto.TipDocumentId;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Document actualizat cu succes." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Eroare la actualizare: {ex.Message}" });
            }
        }
    }
}
