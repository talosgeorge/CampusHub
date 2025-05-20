import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grade } from '../grades/grades-page/grades-page.component';

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  private readonly apiUrl = 'https://localhost:7284/api/grades';

  constructor(private http: HttpClient) { }

  getGradesByUser(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.apiUrl}/getMyGrades`);
  }
}
