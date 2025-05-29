import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

interface Grade {
  gradeId: number;
  value: number;
  date: string;
  userAccountId: string;
  subjectId: number;
  semesterId: number;
  subjectName: string;
  credits: number;
  fullName: string;
  academicYear: string;
  semesterName: string;
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
  fullName: string;
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
  filteredStudents: Student[] = [];
  studentSearch: string = '';
  selectedStudentId: string | null = null;

  selectedYear: string | null = null;
  selectedSemester: string | null = null;

  newGrade: NewGrade = {
    userAccountId: null,
    subjectId: null,
    semesterId: null,
    gradeValue: null,
    date: new Date().toISOString().split('T')[0]
  };

  editGrade: Grade | null = null;

  constructor(private http: HttpClient, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadSubjects();
    this.loadSemesters();
    this.loadStudents();
  }

  loadGrades(): void {
    if (!this.selectedStudentId) return;
    this.http.get<Grade[]>(`/api/grades/getGradesByStudentId?userId=${this.selectedStudentId}`).subscribe({
      next: data => this.grades = data,
      error: err => {
        console.error('Failed to load grades:', err);
        this.toastr.error('Failed to load grades ❌');
      }
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
      .subscribe(data => {
        this.students = data;
        this.filteredStudents = data;
      });
  }

  filterStudents(): void {
    const search = this.studentSearch.toLowerCase();
    this.filteredStudents = this.students.filter(s =>
      s.fullName?.toLowerCase().includes(search)
    );
  }

  selectStudent(student: Student): void {
    this.studentSearch = student.fullName;
    this.selectedStudentId = student.id;
    this.filteredStudents = [];
    this.loadGrades();
  }

  addGrade(): void {
    const body = {
      userAccountId: this.newGrade.userAccountId,
      subjectId: this.newGrade.subjectId,
      semesterId: this.newGrade.semesterId,
      gradeValue: this.newGrade.gradeValue,
      date: this.newGrade.date
    };

    this.http.post('/api/grades/addGrade', body).subscribe({
      next: () => {
        this.resetForm();
        this.loadGrades();
        this.toastr.success('✅ Grade added successfully');
      },
      error: (err) => {
        const rawError = err.error;
        let errorMessage = 'An unexpected error occurred.';

        if (typeof rawError === 'object' && rawError?.error) {
          errorMessage = rawError.error;
        } else if (typeof rawError === 'string') {
          errorMessage = rawError;
        }

        if (err.status === 400 && errorMessage.toLowerCase().includes("grade already exists")) {
          this.toastr.warning("⚠️ This student already has a grade for this subject");
        } else {
          this.toastr.error(`❌ Failed to add grade: ${errorMessage}`);
        }
      }
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
      .subscribe({
        next: () => {
          this.editGrade = null;
          this.loadGrades();
          this.toastr.info('ℹ️ Grade updated');
        },
        error: () => {
          this.toastr.error('❌ Failed to update grade');
        }
      });
  }

  cancelEdit(): void {
    this.editGrade = null;
  }

  deleteGrade(id: number): void {
    if (confirm('Are you sure you want to delete this grade?')) {
      this.http.delete(`/api/grades/deleteGrade/${id}`)
        .subscribe({
          next: () => {
            this.loadGrades();
            this.toastr.info('🗑️ Grade deleted');
          },
          error: () => {
            this.toastr.error('❌ Failed to delete grade');
          }
        });
    }
  }

  get filteredGrades(): Grade[] {
    return this.grades.filter(g => {
      const yearMatch = !this.selectedYear || g.academicYear === this.selectedYear;
      const semMatch = !this.selectedSemester || g.semesterName === this.selectedSemester;
      return yearMatch && semMatch;
    });
  }

  get uniqueAcademicYears(): string[] {
    return [...new Set(this.grades.map(g => g.academicYear))];
  }

  get uniqueSemesters(): string[] {
    return [...new Set(this.grades.map(g => g.semesterName))];
  }
}
