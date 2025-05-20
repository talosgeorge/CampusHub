import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GradesService } from '../grades.service';

export interface Grade {
  gradeId: number;
  value: number;
  date: string;
  semesterId: number;
  subjectName: string;
  credits: number;
}


@Component({
  selector: 'app-grades-page',
  standalone: true,
  templateUrl: './grades-page.component.html',
  styleUrls: ['./grades-page.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class GradesPageComponent implements OnInit {
  grades: Grade[] = [];
  filteredGrades: Grade[] = [];
  semesters: number[] = [];
  selectedSemester: number | null = null;

  constructor(private gradesService: GradesService) { }

  ngOnInit(): void {
    this.gradesService.getGradesByUser().subscribe({
      next: (grades: Grade[]) => {
        this.grades = grades;
        this.semesters = [...new Set(grades.map(g => g.semesterId))];
        this.filteredGrades = grades;
      },
      error: (err: any) => {
        console.error('Failed to fetch grades', err);
      }
    });
  }

  filterBySemester(): void {
    const selected = Number(this.selectedSemester);
    if (!selected) {
      this.filteredGrades = this.grades;
    } else {
      this.filteredGrades = this.grades.filter(g => g.semesterId === selected);
    }
  }
}
