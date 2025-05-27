import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface AcademicYear {
  id: number;
  yearLabel: string;
}

@Component({
  selector: 'app-academic-years',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './academic-years.component.html',
  styleUrls: ['./academic-years.component.css']
})
export class AcademicYearsComponent implements OnInit {
  academicYears: AcademicYear[] = [];
  newYearLabel: string = '';
  editYear: AcademicYear | null = null;
  apiUrl = 'https://localhost:7284/api/AcademicYears';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchAcademicYears();
  }

  fetchAcademicYears(): void {
    this.http.get<AcademicYear[]>(this.apiUrl).subscribe({
      next: data => this.academicYears = data,
      error: err => console.error('Failed to load academic years:', err)
    });
  }

  addAcademicYear(): void {
    if (!this.newYearLabel.trim()) return;

    const newYear: AcademicYear = {
      id: 0,
      yearLabel: this.newYearLabel.trim()
    };

    this.http.post<AcademicYear>(this.apiUrl, newYear).subscribe({
      next: () => {
        this.newYearLabel = '';
        this.fetchAcademicYears();
      },
      error: err => console.error('Failed to add academic year:', err)
    });
  }

  editYearMode(year: AcademicYear): void {
    this.editYear = { ...year };
  }

  saveEdit(): void {
    if (!this.editYear || !this.editYear.yearLabel.trim()) return;

    this.http.put(`${this.apiUrl}/${this.editYear.id}`, this.editYear).subscribe({
      next: () => {
        this.editYear = null;
        this.fetchAcademicYears();
      },
      error: err => console.error('Failed to update academic year:', err)
    });
  }

  cancelEdit(): void {
    this.editYear = null;
  }

  deleteYear(id: number): void {
    if (confirm('Are you sure you want to delete this academic year?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => this.fetchAcademicYears(),
        error: err => console.error('Failed to delete academic year:', err)
      });
    }
  }
}
