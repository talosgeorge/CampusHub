import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifică că nu au rămas requesturi deschise
  });

  it('should send POST request to login endpoint', () => {
    const dummyResponse = { token: 'fake-token', userId: '123', role: 'student' };

    service.login('john@example.com', '123456').subscribe(res => {
      expect(res).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne('https://localhost:7284/api/account/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      emailOrUsername: 'john@example.com',
      password: '123456'
    });

    req.flush(dummyResponse);
  });
});
