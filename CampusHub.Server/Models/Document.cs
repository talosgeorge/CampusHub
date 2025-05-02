using System;
using AngularApp1.Server.Models; // namespace unde e UserAccount

namespace CampusHub.Server.Models
{
    public class Document
    {
        public int Id { get; set; }

        public string UserId { get; set; }           // FK to AspNetUsers
        public UserAccount User { get; set; }

        public int TipDocumentId { get; set; }
        public TipDocument TipDocument { get; set; }

        public string? Descriere { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public DateTime DataUpload { get; set; }
    }
}
