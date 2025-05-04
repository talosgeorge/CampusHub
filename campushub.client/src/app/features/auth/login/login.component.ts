import { Component, inject } from '@angular/core';
import {  FormsModule } from '@angular/forms';
<<<<<<< HEAD
import { Router } from '@angular/router';
=======
import { Router, RouterModule } from '@angular/router';
>>>>>>> main
import { CommonModule, NgIf } from '@angular/common';
import { LoginService } from '../services/login.service';


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
<<<<<<< HEAD
  imports: [NgIf,FormsModule,CommonModule]
=======
  imports: [NgIf,FormsModule,CommonModule,RouterModule]
>>>>>>> main
})

export class LoginComponent {
  errorMessage: string = '';
  isLoading = false;
  usernameOrEmail:string = '';
  password:string = '';
  isConnected:boolean = false;
<<<<<<< HEAD
=======
  isLoggedInAsStudent:boolean = false;
>>>>>>> main


  loginService = inject(LoginService);
  router = inject(Router);

  login():void {
    this.isLoading = true;
    this.loginService.login(this.usernameOrEmail,this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
<<<<<<< HEAD
        this.router.navigate(['/students']);
=======
        localStorage.setItem('userId',res.userId);
        localStorage.setItem('userRole',res.role);
        this.router.navigateByUrl('/students').then(() => {
          window.location.reload();
        });
>>>>>>> main
        this.isConnected = true;
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Autentificare eșuată';
        console.log(this.usernameOrEmail);
        console.log(this.password);
        this.isLoading = false;
      }
    });
  } 

<<<<<<< HEAD
=======
  ngOnInit(){ // Verific daca sunt logat
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if(token && role == 'student'){
      this.isLoggedInAsStudent = true;
    }
    else{
      this.isLoggedInAsStudent = false;
    }

    if(this.isLoggedInAsStudent){
      this.router.navigate(['/students']);
    }
    
  }

>>>>>>> main
}
