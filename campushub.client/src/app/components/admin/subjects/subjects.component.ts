import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Subject {
  subjectId: number;
  subjectName: string;
  credits: number;
  facultyId: number;
}

interface Faculty {
  id: number;
  name: string;
}

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {
  subjects: Subject[] = [];
  faculties: Faculty[] = [];
  newSubject: Partial<Subject> = {};
  editSubject: Subject | null = null;
  apiUrl = 'https://localhost:7284/api/subjects';
  facultiesApiUrl = 'https://localhost:7284/api/faculties';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSubjects();
    this.fetchFaculties();
  }

  fetchSubjects(): void {
    this.http.get<Subject[]>(this.apiUrl + '/getAllSubjects').subscribe({
      next: (data) => this.subjects = data,
      error: (err) => console.error('Failed to load subjects:', err)
    });
  }

  fetchFaculties(): void {
    this.http.get<Faculty[]>(this.facultiesApiUrl).subscribe({
      next: (data) => this.faculties = data,
      error: (err) => console.error('Failed to load faculties:', err)
    });
  }

  addSubject(): void {
    if (!this.newSubject.subjectName?.trim() || !this.newSubject.credits || !this.newSubject.facultyId) return;

    this.http.post<Subject>(this.apiUrl + '/addSubject', this.newSubject).subscribe({
      next: () => {
        this.newSubject = {};
        this.fetchSubjects();
      },
      error: (err) => console.error('Failed to add subject:', err)
    });
  }

  editSubjectMode(subject: Subject): void {
    this.editSubject = { ...subject };
  }

  saveEdit(): void {
    if (!this.editSubject || !this.editSubject.subjectName?.trim() || !this.editSubject.credits || !this.editSubject.facultyId) return;

    this.http.put(`${this.apiUrl}/updateSubject/${this.editSubject.subjectId}`, this.editSubject).subscribe({
      next: () => {
        this.editSubject = null;
        this.fetchSubjects();
      },
      error: (err) => console.error('Failed to update subject:', err)
    });
  }

  cancelEdit(): void {
    this.editSubject = null;
  }

  deleteSubject(id: number): void {
    this.http.delete(`${this.apiUrl}/deleteSubject?id=${id}`).subscribe({
      next: () => this.fetchSubjects(),
      error: (err) => console.error('Failed to delete subject:', err)
    });
  }

  getFacultyName(facultyId: number): string {
    const faculty = this.faculties.find(f => f.id === facultyId);
    return faculty ? faculty.name : 'Unknown';
  }
}
