import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-student',
  standalone: true,
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
})
export class StudentComponent {

  router = inject(Router);
  isLoggedInAsStudent: boolean = false;

  ngOnInit(){
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if(token && role == 'student'){
      this.isLoggedInAsStudent = true;
    }

    if(!this.isLoggedInAsStudent){
      this.router.navigate(['/']);
    }
    
  }

  disconnect():void {
    localStorage.clear();
    this.isLoggedInAsStudent = false;
    this.router.navigate(['/']);
  }
}
