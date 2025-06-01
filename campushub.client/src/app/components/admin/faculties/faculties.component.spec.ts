import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FacultiesComponent } from './faculties.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('FacultiesComponent', () => {
  let component: FacultiesComponent;
  let fixture: ComponentFixture<FacultiesComponent>;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://localhost:7284/api/faculties';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultiesComponent, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(FacultiesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch faculties on init', () => {
    const mockFaculties = [{ id: 1, name: 'Engineering' }];
    fixture.detectChanges();

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockFaculties);

    expect(component.faculties).toEqual(mockFaculties);
  });

  it('should add a faculty and refresh list', () => {
    component.newFacultyName = 'Law';

    component.addFaculty();

    const postReq = httpMock.expectOne(apiUrl);
    expect(postReq.request.method).toBe('POST');
    expect(postReq.request.body).toEqual({ name: 'Law' });
    postReq.flush({ id: 2, name: 'Law' });

    const getReq = httpMock.expectOne(apiUrl);
    getReq.flush([{ id: 1, name: 'Engineering' }, { id: 2, name: 'Law' }]);

    expect(component.newFacultyName).toBe('');
    expect(component.faculties.length).toBe(2);
  });

  it('should enter edit mode', () => {
    const faculty = { id: 1, name: 'Engineering' };
    component.editFacultyMode(faculty);
    expect(component.editFaculty).toEqual(faculty);
  });

  it('should save edited faculty and refresh list', () => {
    component.editFaculty = { id: 1, name: 'Engg' };

    component.saveEdit();

    const putReq = httpMock.expectOne(`${apiUrl}/1`);
    expect(putReq.request.method).toBe('PUT');
    expect(putReq.request.body).toEqual(component.editFaculty);
    putReq.flush({});

    const getReq = httpMock.expectOne(apiUrl);
    getReq.flush([{ id: 1, name: 'Engg' }]);

    expect(component.editFaculty).toBeNull();
  });

  it('should cancel edit mode', () => {
    component.editFaculty = { id: 1, name: 'Engineering' };
    component.cancelEdit();
    expect(component.editFaculty).toBeNull();
  });

  it('should delete a faculty and refresh list', () => {
    component.deleteFaculty(1);

    const delReq = httpMock.expectOne(`${apiUrl}/1`);
    expect(delReq.request.method).toBe('DELETE');
    delReq.flush({});

    const getReq = httpMock.expectOne(apiUrl);
    getReq.flush([]);
  });
});
