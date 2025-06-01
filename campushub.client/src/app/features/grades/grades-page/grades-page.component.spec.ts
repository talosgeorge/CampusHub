import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradesPageComponent, Grade } from './grades-page.component';
import { GradesService } from '../grades.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('GradesPageComponent', () => {
  let component: GradesPageComponent;
  let fixture: ComponentFixture<GradesPageComponent>;
  let gradesServiceMock: jasmine.SpyObj<GradesService>;

  const mockGrades: Grade[] = [
    { gradeId: 1, value: 9, date: '2024-01-10', semesterId: 1, subjectName: 'Math', credits: 5 },
    { gradeId: 2, value: 8, date: '2024-01-15', semesterId: 1, subjectName: 'Physics', credits: 4 },
    { gradeId: 3, value: 10, date: '2024-06-10', semesterId: 2, subjectName: 'Chemistry', credits: 3 },
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('GradesService', ['getGradesByUser']);

    await TestBed.configureTestingModule({
      imports: [GradesPageComponent, CommonModule, FormsModule],
      providers: [{ provide: GradesService, useValue: spy }]
    }).compileComponents();

    gradesServiceMock = TestBed.inject(GradesService) as jasmine.SpyObj<GradesService>;
    gradesServiceMock.getGradesByUser.and.returnValue(of(mockGrades));

    fixture = TestBed.createComponent(GradesPageComponent);
    component = fixture.componentInstance;
  });

  it('should load grades and semesters on init', () => {
    fixture.detectChanges(); // triggers ngOnInit()

    expect(component.grades.length).toBe(3);
    expect(component.semesters.length).toBe(2);
    expect(component.semesters).toContain(1);
    expect(component.semesters).toContain(2);
    expect(component.filteredGrades.length).toBe(3);
  });

  it('should handle error when loading grades', () => {
    gradesServiceMock.getGradesByUser.and.returnValue(throwError(() => new Error('Failed')));
    spyOn(console, 'error');

    fixture.detectChanges();

    expect(console.error).toHaveBeenCalledWith('Failed to fetch grades', jasmine.any(Error));
  });

  it('should filter grades by selected semester', () => {
    fixture.detectChanges();

    component.selectedSemester = 1;
    component.filterBySemester();

    expect(component.filteredGrades.length).toBe(2);
    expect(component.filteredGrades.every(g => g.semesterId === 1)).toBeTrue();

    component.selectedSemester = 2;
    component.filterBySemester();

    expect(component.filteredGrades.length).toBe(1);
    expect(component.filteredGrades[0].semesterId).toBe(2);
  });

  it('should reset filter when selectedSemester is null or 0', () => {
    fixture.detectChanges();

    component.selectedSemester = null;
    component.filterBySemester();
    expect(component.filteredGrades.length).toBe(3);

    component.selectedSemester = 0;
    component.filterBySemester();
    expect(component.filteredGrades.length).toBe(3);
  });
});
