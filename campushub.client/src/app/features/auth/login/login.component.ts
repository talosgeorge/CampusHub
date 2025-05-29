import { Component, inject } from '@angular/core';
import {  FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { LoginService } from '../services/login.service';


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [NgIf,FormsModule,CommonModule,RouterModule]
})

export class LoginComponent {
  errorMessage: string = '';
  isLoading = false;
<<<<<<< HEAD
  usernameOrEmail: string = '';
  password: string = '';
<<<<<<< Updated upstream
=======
  isConnected: boolean = false;
>>>>>>> Stashed changes
=======
  usernameOrEmail:string = '';
  password:string = '';
  isConnected:boolean = false;
  isLoggedInAsStudent:boolean = false;

>>>>>>> main

  loginService = inject(LoginService);
  router = inject(Router);

  login():void {
    this.isLoading = true;
<<<<<<< HEAD
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    this.loginService.login(this.usernameOrEmail, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('userRole', res.role);
<<<<<<< Updated upstream

        let redirectUrl = '/';
        switch (res.role) {
          case 'admin':
            redirectUrl = '/admin';
            break;
          case 'student':
            redirectUrl = '/students';
            break;
          case 'professor':
            redirectUrl = '/professor';
            break;
        }

        this.router.navigateByUrl(redirectUrl).then(() => {
          window.location.reload(); // opțional
        });

        this.isLoading = false;
=======
        localStorage.setItem("userName", res.username);

>>>>>>> Stashed changes
=======
    this.loginService.login(this.usernameOrEmail,this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId',res.userId);
        localStorage.setItem('userRole',res.role);
        localStorage.setItem("userName",res.username);
        this.router.navigateByUrl('/students').then(() => {
          window.location.reload();
        });
        this.isConnected = true;
>>>>>>> main
        this.errorMessage = '';
        this.isConnected = true;

        if (res.role === 'student') {
          this.router.navigateByUrl('/students').then(() => window.location.reload());
        } else if (res.role === 'admin') {
          this.router.navigateByUrl('/admin').then(() => window.location.reload());
        } else {
          this.router.navigateByUrl('/'); // fallback
        }
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
<<<<<<< Updated upstream
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (token && role) {
      let redirectUrl = '/';
      switch (role) {
        case 'admin':
          redirectUrl = '/admin';
          break;
        case 'student':
          redirectUrl = '/students';
          break;
        case 'professor':
          redirectUrl = '/professor';
          break;
      }

      this.router.navigate([redirectUrl]);
=======
  ngOnInit() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if (token && role === 'student') {
      this.router.navigate(['/students']);
    } else if (token && role === 'admin') {
      this.router.navigate(['/admin']);
>>>>>>> Stashed changes
=======
  ngOnInit(){ // Verific daca sunt logat
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if(token && role == 'student'){
      this.isLoggedInAsStudent = true;
>>>>>>> main
    }
    else{
      this.isLoggedInAsStudent = false;
    }

    if(this.isLoggedInAsStudent){
      this.router.navigate(['/students']);
    }
    
  }

}
