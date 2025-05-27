import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Faculty {
  id: number;
  name: string;
}

@Component({
  selector: 'app-faculties',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.css']
})
export class FacultiesComponent implements OnInit {
  faculties: Faculty[] = [];
  newFacultyName: string = '';
  editFaculty: Faculty | null = null;
  apiUrl = 'https://localhost:7284/api/faculties';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchFaculties();
  }

  fetchFaculties(): void {
    this.http.get<Faculty[]>(this.apiUrl).subscribe({
      next: (data) => this.faculties = data,
      error: (err) => console.error('Failed to load faculties:', err)
    });
  }

  addFaculty(): void {
    if (!this.newFacultyName.trim()) return;

    const newFaculty = { name: this.newFacultyName };
    this.http.post<Faculty>(this.apiUrl, newFaculty).subscribe({
      next: () => {
        this.newFacultyName = '';
        this.fetchFaculties();
      },
      error: (err) => console.error('Failed to add faculty:', err)
    });
  }

  editFacultyMode(faculty: Faculty): void {
    this.editFaculty = { ...faculty };
  }

  saveEdit(): void {
    if (this.editFaculty === null || !this.editFaculty.name.trim()) return;

    this.http.put(`${this.apiUrl}/${this.editFaculty.id}`, this.editFaculty).subscribe({
      next: () => {
        this.editFaculty = null;
        this.fetchFaculties();
      },
      error: (err) => console.error('Failed to update faculty:', err)
    });
  }

  cancelEdit(): void {
    this.editFaculty = null;
  }

  deleteFaculty(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.fetchFaculties(),
      error: (err) => console.error('Failed to delete faculty:', err)
    });
  }
}
