import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let navigateSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],  // declarăm componenta, nu o importăm
      imports: [RouterTestingModule.withRoutes([])],
    }).compileComponents();
  
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    navigateSpy = spyOn(router, 'navigate');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should set loggedInAsStudent and navigate to /students when token and student role exist', () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userRole', 'student');

    component.ngOnInit();

    expect(component.loggedInAsStudent).toBeTrue();
    expect(component.loggedInAsAdmin).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/students']);
  });

  it('should set loggedInAsAdmin and navigate to /admin when token and admin role exist', () => {
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('userRole', 'admin');

    component.ngOnInit();

    expect(component.loggedInAsAdmin).toBeTrue();
    expect(component.loggedInAsStudent).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin']);
  });

  it('should not set loggedInAsStudent or loggedInAsAdmin if no valid token or role', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');

    component.ngOnInit();

    expect(component.loggedInAsStudent).toBeFalse();
    expect(component.loggedInAsAdmin).toBeFalse();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
