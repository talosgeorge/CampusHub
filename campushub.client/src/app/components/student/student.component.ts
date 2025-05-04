import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

<<<<<<< HEAD
=======

>>>>>>> main
@Component({
  selector: 'app-student',
  standalone: true,
  templateUrl: './student.component.html',
<<<<<<< HEAD
  styleUrl: './student.component.scss'
=======
  styleUrl: './student.component.scss',
>>>>>>> main
})
export class StudentComponent {

  router = inject(Router);
<<<<<<< HEAD

  disconnect():void {
    localStorage.clear();
    this.router.navigate(['/login']);
=======
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
>>>>>>> main
  }
}
