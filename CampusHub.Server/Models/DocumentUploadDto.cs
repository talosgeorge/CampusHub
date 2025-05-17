using Microsoft.AspNetCore.Http;

namespace CampusHub.Server.Models
{
    public class DocumentUploadDto
    {
        public int TipDocumentId { get; set; }
        public string? Descriere { get; set; }
        public IFormFile File { get; set; }
        public string UserId { get; set; }
    }
}
