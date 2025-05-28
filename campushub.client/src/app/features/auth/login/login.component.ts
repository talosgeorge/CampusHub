import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { LoginService } from '../services/login.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [NgIf, FormsModule, CommonModule, RouterModule]
})
export class LoginComponent {
  errorMessage: string = '';
  isLoading = false;
  usernameOrEmail: string = '';
  password: string = '';

  loginService = inject(LoginService);
  router = inject(Router);

  login(): void {
    this.isLoading = true;

    this.loginService.login(this.usernameOrEmail, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('userRole', res.role);

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
        this.errorMessage = '';
      },
      error: () => {
        this.errorMessage = 'Autentificare eșuată';
        this.isLoading = false;
      }
    });
  }

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
    }
  }
}
