import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DocumentDto {
  id: number;
  fileName: string;
  descriere: string;
  tipDocumentNume: string;
  dataUpload: string;
}

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents-page.component.html',
  styleUrl: './documents-page.component.scss',
})
export class DocumentsPageComponent {
  documents: DocumentDto[] = [
    {
      id: 1,
      fileName: 'contract.pdf',
      descriere: 'Student contract',
      tipDocumentNume: 'Contract',
      dataUpload: '2025-05-04'
    },
    {
      id: 2,
      fileName: 'grades.pdf',
      descriere: 'Semester grades',
      tipDocumentNume: 'Grades',
      dataUpload: '2025-04-22'
    }
  ];
}
