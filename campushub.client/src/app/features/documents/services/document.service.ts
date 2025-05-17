import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DocumentDto {
  id: number;
  fileName: string;
  descriere: string;
  tipDocumentNume: string;
  dataUpload: string;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private apiUrl = 'https://localhost:7284/api/documente';

  constructor(private http: HttpClient) { }

  getUserDocuments(): Observable<DocumentDto[]> {
    return this.http.get<DocumentDto[]>(`${this.apiUrl}/user`);
  }
}
