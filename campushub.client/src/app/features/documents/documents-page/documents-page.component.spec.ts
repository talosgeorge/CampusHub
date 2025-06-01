import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentsPageComponent } from './documents-page.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('DocumentsPageComponent', () => {
  let component: DocumentsPageComponent;
  let fixture: ComponentFixture<DocumentsPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DocumentsPageComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'userId') return '123';
      return null;
    });

    fixture.detectChanges();

    // Așteaptă GET-urile inițiale
    httpMock.expectOne('/api/documente?userId=123').flush([]);
    httpMock.expectOne('/api/documente/tipuri').flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should upload a document and refresh list', () => {
    const mockFile = new File(['dummy'], 'test.pdf', { type: 'application/pdf' });

    component.selectedFile = mockFile;
    component.uploadForm.setValue({
      tipDocumentId: '1',
      descriere: 'Test descriere'
    });

    component.uploadDocument();

    const uploadReq = httpMock.expectOne('/api/documente/upload');
    expect(uploadReq.request.method).toBe('POST');
    expect(uploadReq.request.body instanceof FormData).toBeTrue();

    uploadReq.flush({}); // răspuns gol la upload

    const getReq = httpMock.expectOne('/api/documente?userId=123');
    expect(getReq.request.method).toBe('GET');
    getReq.flush([]); // răspuns gol pentru documente
  });

  it('should delete a document and update the list', () => {
    spyOn(window, 'confirm').and.returnValue(true); // simulăm confirm

    component.documents = [
      {
        id: 1,
        fileName: 'test.pdf',
        descriere: 'Un test',
        tipDocumentNume: 'Curs',
        dataUpload: '2024-01-01'
      }
    ];

    component.deleteDocument(1);

    const req = httpMock.expectOne('/api/documente/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({}); // răspuns gol la delete

    expect(component.documents.length).toBe(0);
  });
});
