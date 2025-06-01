import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { RegisterService } from '../services/register.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockRegisterService: any;

  beforeEach(async () => {
    mockRegisterService = {
      register: jasmine.createSpy('register')
    };

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,             // ✅ standalone component
        RouterTestingModule,           // ✅ rezolvă router + navigate
        FormsModule,
        ReactiveFormsModule,
        CommonModule
      ],
      providers: [
        { provide: RegisterService, useValue: mockRegisterService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if username is blank', () => {
    component.username = '';
    component.email = 'test@example.com';
    component.password = '123456';
    component.confirmPassword = '123456';

    component.register();

    expect(component.message).toBe('Username cannot be blank');
  });

  it('should show error if email is blank', () => {
    component.username = 'user';
    component.email = '';
    component.password = '123456';
    component.confirmPassword = '123456';

    component.register();

    expect(component.message).toBe('Email cannot be blank');
  });

  it('should show error if password is blank', () => {
    component.username = 'user';
    component.email = 'email@example.com';
    component.password = '';
    component.confirmPassword = '';

    component.register();

    expect(component.message).toBe('Password cannot be black');
  });

  it('should show error if passwords do not match', () => {
    component.username = 'user';
    component.email = 'email@example.com';
    component.password = 'pass1';
    component.confirmPassword = 'pass2';

    component.register();

    expect(component.message).toBe('Parolele nu corespund');
  });

  it('should call register service and set success message', () => {
    component.username = 'user';
    component.email = 'email@example.com';
    component.password = 'password';
    component.confirmPassword = 'password';

    const response = { message: 'Registered successfully!' };
    mockRegisterService.register.and.returnValue(of(response));

    component.register();

    expect(mockRegisterService.register).toHaveBeenCalledWith('user', 'email@example.com', 'password');
    expect(component.message).toBe('Registered successfully!');
  });

  it('should handle register error', () => {
    component.username = 'user';
    component.email = 'email@example.com';
    component.password = 'password';
    component.confirmPassword = 'password';

    const errorResponse = { error: [{ code: 'EMAIL_ALREADY_EXISTS' }] };
    mockRegisterService.register.and.returnValue(throwError(() => errorResponse));

    component.register();

    expect(component.message).toBe('EMAIL_ALREADY_EXISTS');
  });

  it('should redirect to students if already logged in as student on init', () => {
    localStorage.setItem('token', 'valid-token');
    localStorage.setItem('userRole', 'student');

    const navigateSpy = spyOn(component['router'], 'navigate');

    component.ngOnInit();

    expect(component.isLoggedInAsStudent).toBeTrue();
    expect(navigateSpy).toHaveBeenCalledWith(['/students']);
  });

  it('should navigate to login on goToLogin()', () => {
    const navigateSpy = spyOn(component['router'], 'navigate');

    component.goToLogin();

    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
