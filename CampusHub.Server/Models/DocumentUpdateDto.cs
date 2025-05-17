namespace CampusHub.Server.Models
{
    public class DocumentUpdateDto
    {
        public int TipDocumentId { get; set; }
        public string Descriere { get; set; } = string.Empty;
    }
}
