import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentNavBarComponent } from './student-nav-bar.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('StudentNavBarComponent', () => {
  let component: StudentNavBarComponent;
  let fixture: ComponentFixture<StudentNavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StudentNavBarComponent,
        RouterTestingModule // pentru injectarea Router-ului
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentNavBarComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have dropDownOpen initialised as false', () => {
    expect(component.dropDownOpen).toBeFalse();
  });

  it('should have username empty initially', () => {
    expect(component.username).toBe('');
  });

  it('should toggle dropDownOpen state', () => {
    expect(component.dropDownOpen).toBeFalse();
    component.toggleDropDown();
    expect(component.dropDownOpen).toBeTrue();
    component.toggleDropDown();
    expect(component.dropDownOpen).toBeFalse();
  });

  it('ngOnInit should get username from localStorage and convert to uppercase', () => {
    spyOn(localStorage, 'getItem').and.returnValue('johnDoe');
    component.ngOnInit();
    expect(component.username).toBe('JO');
  });
});
