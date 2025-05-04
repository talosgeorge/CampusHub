import { Component, inject } from '@angular/core';
import {  FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { LoginService } from '../services/login.service';


@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [NgIf,FormsModule,CommonModule]
})

export class LoginComponent {
  errorMessage: string = '';
  isLoading = false;
  usernameOrEmail:string = '';
  password:string = '';
  isConnected:boolean = false;


  loginService = inject(LoginService);
  router = inject(Router);

  login():void {
    this.isLoading = true;
    this.loginService.login(this.usernameOrEmail,this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/students']);
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

}
