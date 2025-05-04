import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
<<<<<<< HEAD
import { Router } from '@angular/router'; // 🆕
=======
import { Router, RouterModule } from '@angular/router'; // 🆕
>>>>>>> main
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
<<<<<<< HEAD
  imports: [CommonModule, ReactiveFormsModule,FormsModule]
=======
  imports: [CommonModule, ReactiveFormsModule,FormsModule,RouterModule]
>>>>>>> main
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  message:string ='';
  isClicked: boolean = false;
<<<<<<< HEAD
=======
  isLoggedInAsStudent:boolean = false;
>>>>>>> main

  router = inject(Router);
  registerService = inject(RegisterService);

  register():void{
    this.isClicked = true;

    if(this.username == ''){
      this.message = "Username cannot be blank";
    }
    else if(this.email == ''){
      this.message = "Email cannot be blank";
    }
    else if(this.password == ''){
      this.message = "Password cannot be black";
    }
    else if(this.password != this.confirmPassword){
      this.message = "Parolele nu corespund";
    }
    else{
      this.registerService.register(this.username,this.email,this.password).subscribe({
        next:(response) =>{
          this.message = response.message;
          
        },
        error:(error)=>{
          this.message = error.error[0].code;
          console.log(this.message);
        }
      })
    }
  }


  goToLogin():void{
    this.router.navigate(['/login']);
  }
<<<<<<< HEAD
=======

  ngOnInit(){
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');

    if(token && role == 'student'){
      this.isLoggedInAsStudent = true;
    }
    else {
      this.isLoggedInAsStudent = false;
    }

    if(this.isLoggedInAsStudent){
      this.router.navigate(['/students']);
    }
  }
>>>>>>> main
}
