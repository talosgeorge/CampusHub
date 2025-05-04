import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './features/auth/login/login.component';
import { CommonModule } from '@angular/common';
import { StudentComponent } from './components/student/student.component';
<<<<<<< HEAD
=======
import { StudentNavBarComponent } from './components/student/student-nav-bar/student-nav-bar.component';

>>>>>>> main

@NgModule({
  declarations: [
    AppComponent,
    
    
  ],
  imports: [
    HttpClientModule,
    LoginComponent,
<<<<<<< HEAD
    BrowserModule, 
=======
    BrowserModule,
>>>>>>> main
    AppRoutingModule,
    HomeComponent,
    RouterOutlet,
    RegisterComponent,
    ReactiveFormsModule,
    StudentComponent,
<<<<<<< HEAD
  ],
=======
    StudentNavBarComponent
],
>>>>>>> main
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
