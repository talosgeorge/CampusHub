import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoginService } from '../services/login.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockLoginService: any;

  beforeEach(async () => {
    mockLoginService = {
      login: jasmine.createSpy('login')
    };
    
    


    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,             // ✅ fiind standalone, îl importăm
        RouterTestingModule,        // ✅ rezolvă Router + RouterLink
        FormsModule,                // ✅ pentru [(ngModel)]
        CommonModule                // ✅ dacă ai *ngIf, etc.
      ],
      providers: [
        { provide: LoginService, useValue: mockLoginService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should detect student login and navigate on init', () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('userRole', 'student');

    const navigateSpy = spyOn(component['router'], 'navigate');
    component.ngOnInit();

    expect(component.isLoggedInAsStudent).toBeTrue();
    expect(navigateSpy).toHaveBeenCalledWith(['/students']);
  });

  it('should detect admin login and navigate on init', () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('userRole', 'admin');

    const navigateSpy = spyOn(component['router'], 'navigate');
    component.ngOnInit();

    expect(component.isLoggedInAsAdmin).toBeTrue();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin']);
  });

  it('should perform successful login', async () => {
    const fakeResponse = {
      token: 'abc123',
      userId: '1',
      role: 'student',
      username: 'testUser'
    };

    component.usernameOrEmail = 'test';
    component.password = 'pass';

    mockLoginService.login.and.returnValue(of(fakeResponse));

    const navigateByUrlSpy = spyOn(component['router'], 'navigateByUrl').and.returnValue(Promise.resolve(true));

    component.login();
    await fixture.whenStable();

    expect(localStorage.getItem('token')).toBe('abc123');
    expect(localStorage.getItem('userId')).toBe('1');
    expect(localStorage.getItem('userRole')).toBe('student');
    expect(localStorage.getItem('userName')).toBe('testUser');
    expect(component.isConnected).toBeTrue();
    expect(component.errorMessage).toBe('');
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/students');
  });

  it('should handle failed login', () => {
    component.usernameOrEmail = 'wrong';
    component.password = 'bad';

    mockLoginService.login.and.returnValue(throwError(() => new Error('Invalid')));

    component.login();

    expect(component.errorMessage).toBe('Autentificare eșuată');
    expect(component.isLoading).toBeFalse();
  });
});
