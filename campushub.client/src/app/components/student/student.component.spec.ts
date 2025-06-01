import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentComponent } from './student.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('StudentComponent', () => {
  let component: StudentComponent;
  let fixture: ComponentFixture<StudentComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should redirect to / if not logged in as student', () => {
    spyOn(router, 'navigate');

    // localStorage empty => not logged in
    component.ngOnInit();

    expect(component.isLoggedInAsStudent).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should set isLoggedInAsStudent to true and set username if logged in as student', () => {
    spyOn(router, 'navigate');

    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userRole', 'student');
    localStorage.setItem('userName', 'John Doe');

    component.ngOnInit();

    expect(component.isLoggedInAsStudent).toBeTrue();
    expect(component.username).toBe('John Doe');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('disconnect() should clear localStorage, set flag false and navigate to /', () => {
    spyOn(router, 'navigate');

    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userRole', 'student');
    localStorage.setItem('userName', 'John Doe');

    component.isLoggedInAsStudent = true;

    component.disconnect();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userRole')).toBeNull();
    expect(localStorage.getItem('userName')).toBeNull();
    expect(component.isLoggedInAsStudent).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
