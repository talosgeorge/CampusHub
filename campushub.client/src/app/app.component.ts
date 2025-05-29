
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})

export class AppComponent {

  loggedInAsStudent: boolean = false;
  loggedInAsAdmin: boolean = false;
  router = inject(Router);

  ngOnInit() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (token && role == 'student') {
      this.loggedInAsStudent = true;
    }
    else {
      this.loggedInAsStudent = false;
    }

    if (token && role == 'Admin') {
      this.loggedInAsAdmin = true;
    }
    else{
      this.loggedInAsAdmin = false;
    }

    if (this.loggedInAsStudent) {
      this.router.navigate(['/students']);
    }

    if(this.loggedInAsAdmin){
      this.router.navigate(['/admin']);
    }
  }
}
