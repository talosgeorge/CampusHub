import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegisterService]
    });

    service = TestBed.inject(RegisterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // verificăm că nu există requesturi neterminate
  });

  it('should send POST request to register endpoint', () => {
    const mockResponse = { message: 'User created' };

    service.register('john', 'john@example.com', '123456').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://localhost:7284/api/reg/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'john',
      email: 'john@example.com',
      password: '123456'
    });

    req.flush(mockResponse);
  });
});
