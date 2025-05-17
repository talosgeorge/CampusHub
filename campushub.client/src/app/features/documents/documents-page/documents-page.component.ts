import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DocumentDto {
  id: number;
  fileName: string;
  descriere: string;
  tipDocumentNume: string;
  dataUpload: string;

  // Opționale - pentru editare inline
  isEditing?: boolean;
  newDescriere?: string;
  newTipDocumentId?: number;
}

interface TipDocument {
  id: number;
  nume: string;
}

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './documents-page.component.html',
  styleUrl: './documents-page.component.scss',
})
export class DocumentsPageComponent implements OnInit {
  documents: DocumentDto[] = [];
  tipuriDocumente: TipDocument[] = [];
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  userId: string = '';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.uploadForm = this.fb.group({
      tipDocumentId: [''],
      descriere: ['']
    });
  }

  ngOnInit() {
    this.userId = localStorage.getItem('userId') || '';
    this.getDocuments();
    this.getTipuriDocumente();
  }

  getDocuments() {
    if (!this.userId) {
      console.warn('User ID lipsă - documentele nu pot fi încărcate');
      return;
    }

    this.http.get<DocumentDto[]>(`/api/documente?userId=${this.userId}`).subscribe({
      next: (res) => {
        this.documents = [...res]; // 👈 forțăm referință nouă
        console.log('📥 Documente încărcate:', this.documents); // 🧪 LOG
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
    if (!this.selectedFile || !this.userId) {
      alert('Please select a file and ensure userId is present!');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('tipDocumentId', this.uploadForm.value.tipDocumentId);
    formData.append('descriere', this.uploadForm.value.descriere || '');
    formData.append('userId', this.userId);

    this.http.post('/api/documente/upload', formData).subscribe({
      next: () => {
        this.uploadForm.reset();
        this.selectedFile = null;
        this.getDocuments(); // 🔁 fetch complet pentru siguranță
      },
      error: (err) => console.error('Upload error:', err)
    });
  }

  deleteDocument(id: number) {
    if (!confirm('Are you sure you want to delete this document?')) return;

    this.http.delete(`/api/documente/${id}`).subscribe({
      next: () => {
        this.documents = this.documents.filter(d => d.id !== id);
        console.log('❌ După ștergere:', this.documents); // 🧪 LOG
      },
      error: err => console.error('Delete failed:', err)
    });
  }

  toggleEdit(doc: DocumentDto) {
    doc.isEditing = !doc.isEditing;
    if (doc.isEditing) {
      doc.newDescriere = doc.descriere;
      doc.newTipDocumentId = this.tipuriDocumente.find(t => t.nume === doc.tipDocumentNume)?.id || 1;
    }
  }

  updateDocument(doc: DocumentDto) {
    const payload = {
      descriere: doc.newDescriere || '',
      tipDocumentId: doc.newTipDocumentId || 1
    };

    this.http.put(`/api/documente/${doc.id}`, payload).subscribe({
      next: () => {
        doc.descriere = payload.descriere;
        doc.tipDocumentNume = this.tipuriDocumente.find(t => t.id === payload.tipDocumentId)?.nume || doc.tipDocumentNume;
        doc.isEditing = false;
        console.log('✅ Document updated locally');
      },
      error: err => console.error('Update error:', err)
    });
  }
}
