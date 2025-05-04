import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface DocumentDto {
  id: number;
  fileName: string;
  descriere: string;
  tipDocumentNume: string;
  dataUpload: string;
}

interface TipDocument {
  id: number;
  nume: string;
}

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './documents-page.component.html',
  styleUrl: './documents-page.component.scss',
})
export class DocumentsPageComponent implements OnInit {
  documents: DocumentDto[] = [];
  tipuriDocumente: TipDocument[] = [];
  uploadForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      tipDocumentId: [''],
      descriere: ['']
    });
  }

  ngOnInit() {
    this.getDocuments();
    this.getTipuriDocumente();
  }

  getDocuments() {
    this.http.get<DocumentDto[]>('/api/documente/user').subscribe({
      next: (res) => {
        this.documents = res;
      },
      error: (err) => {
        console.error('Eroare la preluarea documentelor:', err);
      }
    });
  }

  getTipuriDocumente() {
    this.http.get<TipDocument[]>('/api/documente/tipuri').subscribe({
      next: (res) => {
        this.tipuriDocumente = res;
      },
      error: (err) => {
        console.error('Eroare la tipuri documente:', err);
      }
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput?.files?.length) {
      this.selectedFile = fileInput.files[0];
    }
  }

  uploadDocument() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('tipDocumentId', this.uploadForm.value.tipDocumentId);
    formData.append('descriere', this.uploadForm.value.descriere || '');

    this.http.post('/api/documente/upload', formData).subscribe({
      next: () => {
        this.uploadForm.reset();
        this.selectedFile = null;
        this.getDocuments();
      },
      error: (err) => console.error(err)
    });
  }
}
