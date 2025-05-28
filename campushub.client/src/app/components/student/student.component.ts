import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss',
})
export class StudentComponent {

  router = inject(Router);
  isLoggedInAsStudent: boolean = false;
  username = '';

  ngOnInit(){
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if(token && role == 'student'){
      this.isLoggedInAsStudent = true;
      this.username = localStorage.getItem("userName") || '';
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
