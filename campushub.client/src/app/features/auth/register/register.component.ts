import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // 🆕

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterComponent {
  constructor(private router: Router) { }

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  get usernameLength() {
    return this.registerForm.controls['username'].value?.length ?? 0;
  }

  get emailLength() {
    return this.registerForm.controls['email'].value?.length ?? 0;
  }

  get passLength() {
    return this.registerForm.controls['password'].value?.length ?? 0;
  }

  onSubmit() {
    console.log(this.registerForm.value);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
