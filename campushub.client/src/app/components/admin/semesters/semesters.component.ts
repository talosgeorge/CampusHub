import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Semester {
  id: number;
  name: string;
  academicYearId: number;
}

interface AcademicYear {
  id: number;
  yearLabel: string;
}

@Component({
  selector: 'app-semesters',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './semesters.component.html',
  styleUrls: ['./semesters.component.css']
})
export class SemestersComponent implements OnInit {
  semesters: Semester[] = [];
  academicYears: AcademicYear[] = [];
  newSemester: Partial<Semester> = {};
  editSemester: Semester | null = null;

  apiUrl = 'https://localhost:7284/api/semesters';
  academicYearsApi = 'https://localhost:7284/api/academicyears';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchSemesters();
    this.fetchAcademicYears();
  }

  fetchSemesters(): void {
    this.http.get<Semester[]>(this.apiUrl).subscribe({
      next: data => this.semesters = data,
      error: err => console.error('Failed to load semesters:', err)
    });
  }

  fetchAcademicYears(): void {
    this.http.get<AcademicYear[]>(this.academicYearsApi).subscribe({
      next: data => this.academicYears = data,
      error: err => console.error('Failed to load academic years:', err)
    });
  }

  addSemester(): void {
    if (!this.newSemester.name?.trim() || !this.newSemester.academicYearId) return;

    const semester: Semester = {
      id: 0,
      name: this.newSemester.name.trim(),
      academicYearId: this.newSemester.academicYearId
    };

    this.http.post<Semester>(this.apiUrl, semester).subscribe({
      next: () => {
        this.newSemester = {};
        this.fetchSemesters();
      },
      error: err => console.error('Failed to add semester:', err)
    });
  }

  editSemesterMode(semester: Semester): void {
    this.editSemester = { ...semester };
  }

  saveEdit(): void {
    if (!this.editSemester || !this.editSemester.name?.trim() || !this.editSemester.academicYearId) return;

    this.http.put(`${this.apiUrl}/${this.editSemester.id}`, this.editSemester).subscribe({
      next: () => {
        this.editSemester = null;
        this.fetchSemesters();
      },
      error: err => console.error('Failed to update semester:', err)
    });
  }

  cancelEdit(): void {
    this.editSemester = null;
  }

  deleteSemester(id: number): void {
    if (confirm('Are you sure you want to delete this semester?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.fetchSemesters(),
        error: err => console.error('Failed to delete semester:', err)
      });
    }
  }

  getAcademicYearLabel(id: number): string {
    const year = this.academicYears.find(y => y.id === id);
    return year ? year.yearLabel : 'Unknown';
  }
}
