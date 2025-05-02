import { NgIf, NgStyle } from '@angular/common';
import { Component, input } from '@angular/core';
import {FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports:[ReactiveFormsModule,NgIf]
})

export class RegisterComponent {
    registerForm = new FormGroup({
      username: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
      confirmPassword: new FormControl('',[Validators.required])
    });

   
    usernameLength = this.registerForm.controls['username'].value?.length;
    emailLength = this.registerForm.controls['email'].value?.length;
    passLength = this.registerForm.controls['password'].value?.length;


    
    onSubmit(){
        
    }

   

}
