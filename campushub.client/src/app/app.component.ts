import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { StudentNavBarComponent } from './components/student/student-nav-bar/student-nav-bar.component';

@Component({
  selector: 'app-root',
  standalone:false,
  templateUrl: './app.component.html',
  styleUrl:'./app.component.scss'
})
export class AppComponent {
  loggedInAsStudent: boolean = false;
  router = inject(Router);
  loggedInAsAdmin = false;

  ngOnInit() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    this.loggedInAsStudent = !!(token && role === 'student');

    if(token && role == 'admin'){
      this.loggedInAsAdmin = true;
    }
    else{
      this.loggedInAsAdmin = false;
    }

    if (this.loggedInAsStudent) {
      this.router.navigate(['/students']);
    }

    if(this.loggedInAsAdmin){
      this.router.navigate(['/admin'])
    }
  }
}
