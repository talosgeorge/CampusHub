import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Grade {
  gradeId: number;
  value: number;
  date: string;
  userAccountId: string;
  subjectId: number;
  semesterId: number;
  subjectName: string;
  credits: number;
}

interface NewGrade {
  userAccountId: string | null;
  subjectId: number | null;
  semesterId: number | null;
  gradeValue: number | null;
  date: string;
}

interface Subject {
  subjectId: number;
  subjectName: string;
  credits: number;
}

interface Semester {
  id: number;
  name: string;
}

interface Student {
  id: string;
  email: string;
}

@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {
  grades: Grade[] = [];
  subjects: Subject[] = [];
  semesters: Semester[] = [];
  students: Student[] = [];
  selectedStudentId: string | null = null;

  newGrade: NewGrade = {
    userAccountId: null,
    subjectId: null,
    semesterId: null,
    gradeValue: null,
    date: new Date().toISOString().split('T')[0]
  };

  editGrade: Grade | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadSubjects();
    this.loadSemesters();
    this.loadStudents();
  }

  loadGrades(): void {
    if (!this.selectedStudentId) return;

    this.http.get<Grade[]>(`/api/grades/getGradesByStudentId?userId=${this.selectedStudentId}`).subscribe({
      next: (data) => this.grades = data,
      error: (err) => console.error('Failed to load grades:', err)
    });
  }

  loadSubjects(): void {
    this.http.get<Subject[]>('/api/subjects/getAllSubjects')
      .subscribe(data => this.subjects = data);
  }

  loadSemesters(): void {
    this.http.get<Semester[]>('/api/semesters')
      .subscribe(data => this.semesters = data);
  }

  loadStudents(): void {
    this.http.get<Student[]>('/api/grades/getAllStudentsBasic')
      .subscribe(data => this.students = data);
  }

  getStudentEmail(id: string): string {
    const student = this.students.find(s => s.id === id);
    return student ? student.email : 'Unknown';
  }

  addGrade(): void {
    const body = {
      userAccountId: this.newGrade.userAccountId,
      subjectId: this.newGrade.subjectId,
      semesterId: this.newGrade.semesterId,
      gradeValue: this.newGrade.gradeValue,
      date: this.newGrade.date
    };

    this.http.post('/api/grades/addGrade', body).subscribe(() => {
      this.resetForm();
      this.loadGrades();
    });
  }

  resetForm(): void {
    this.newGrade = {
      userAccountId: null,
      subjectId: null,
      semesterId: null,
      gradeValue: null,
      date: new Date().toISOString().split('T')[0]
    };
  }

  editGradeMode(grade: Grade): void {
    this.editGrade = { ...grade };
  }

  saveEdit(): void {
    if (!this.editGrade) return;

    const model = {
      userAccountId: this.editGrade.userAccountId,
      subjectId: this.editGrade.subjectId,
      semesterId: this.editGrade.semesterId,
      gradeValue: this.editGrade.value,
      date: this.editGrade.date
    };

    this.http.put(`/api/grades/updateGrade/${this.editGrade.gradeId}`, model)
      .subscribe(() => {
        this.editGrade = null;
        this.loadGrades();
      });
  }

  cancelEdit(): void {
    this.editGrade = null;
  }

  deleteGrade(id: number): void {
    if (confirm('Are you sure you want to delete this grade?')) {
      this.http.delete(`/api/grades/deleteGrade/${id}`)
        .subscribe(() => this.loadGrades());
    }
  }
}
