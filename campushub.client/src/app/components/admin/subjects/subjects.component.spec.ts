import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubjectsComponent } from './subjects.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('SubjectsComponent', () => {
  let component: SubjectsComponent;
  let fixture: ComponentFixture<SubjectsComponent>;
  let httpMock: HttpTestingController;

  const subjectsMock = [
    { subjectId: 1, subjectName: 'Math', credits: 5, facultyId: 1 },
    { subjectId: 2, subjectName: 'Physics', credits: 4, facultyId: 2 }
  ];
  const facultiesMock = [
    { id: 1, name: 'Science' },
    { id: 2, name: 'Engineering' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectsComponent, HttpClientTestingModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SubjectsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();

    // Primele fetch-uri apelate în ngOnInit()
    const subjectsReq = httpMock.expectOne('https://localhost:7284/api/subjects/getAllSubjects');
    subjectsReq.flush(subjectsMock);
    const facultiesReq = httpMock.expectOne('https://localhost:7284/api/faculties');
    facultiesReq.flush(facultiesMock);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch subjects', () => {
    component.fetchSubjects();

    const req = httpMock.expectOne('https://localhost:7284/api/subjects/getAllSubjects');
    expect(req.request.method).toBe('GET');
    req.flush(subjectsMock);

    expect(component.subjects.length).toBe(2);
    expect(component.subjects[0].subjectName).toBe('Math');
  });

  it('should fetch faculties', () => {
    component.fetchFaculties();

    const req = httpMock.expectOne('https://localhost:7284/api/faculties');
    expect(req.request.method).toBe('GET');
    req.flush(facultiesMock);

    expect(component.faculties.length).toBe(2);
    expect(component.faculties[1].name).toBe('Engineering');
  });

  it('should add a new subject and refresh subjects list', () => {
    component.newSubject = {
      subjectName: 'Chemistry',
      credits: 3,
      facultyId: 1
    };

    component.addSubject();

    const postReq = httpMock.expectOne('https://localhost:7284/api/subjects/addSubject');
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body).toEqual(component.newSubject);
    postReq.flush({ subjectId: 10, ...component.newSubject });

    const getReq = httpMock.expectOne('https://localhost:7284/api/subjects/getAllSubjects');
    getReq.flush(subjectsMock);

    expect(component.newSubject).toEqual({});
  });

  it('should enter edit mode and copy subject to editSubject', () => {
    const subject = subjectsMock[0];
    component.editSubjectMode(subject);
    expect(component.editSubject).toEqual(subject);
  });

  it('should save edits and refresh subjects list', () => {
    component.editSubject = {
      subjectId: 1,
      subjectName: 'Advanced Math',
      credits: 6,
      facultyId: 1
    };

    component.saveEdit();

    const putReq = httpMock.expectOne('https://localhost:7284/api/subjects/updateSubject/1');
    expect(putReq.request.method).toBe('PUT');
    expect(putReq.request.body.subjectName).toBe('Advanced Math');
    putReq.flush({});

    const getReq = httpMock.expectOne('https://localhost:7284/api/subjects/getAllSubjects');
    getReq.flush(subjectsMock);

    expect(component.editSubject).toBeNull();
  });

  it('should not save edit if editSubject invalid', () => {
    component.editSubject = {
      subjectId: 1,
      subjectName: '', // invalid name
      credits: 6,
      facultyId: 1
    };

    component.saveEdit();

    httpMock.expectNone('https://localhost:7284/api/subjects/updateSubject/1');
  });

  it('should cancel edit mode', () => {
    component.editSubject = subjectsMock[0];
    component.cancelEdit();
    expect(component.editSubject).toBeNull();
  });

  it('should delete subject and refresh list', () => {
    component.deleteSubject(2);

    const deleteReq = httpMock.expectOne('https://localhost:7284/api/subjects/deleteSubject?id=2');
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({});

    const getReq = httpMock.expectOne('https://localhost:7284/api/subjects/getAllSubjects');
    getReq.flush(subjectsMock);
  });

  it('should return faculty name by id', () => {
    const name = component.getFacultyName(1);
    expect(name).toBe('Science');

    const unknownName = component.getFacultyName(99);
    expect(unknownName).toBe('Unknown');
  });
});
