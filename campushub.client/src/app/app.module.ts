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
import { StudentNavBarComponent } from './components/student/student-nav-bar/student-nav-bar.component';
import { DocumentsPageComponent } from './features/documents/documents-page/documents-page.component';



@NgModule({
  declarations: [
    AppComponent,
    
    
  ],
  imports: [
    HttpClientModule,
    LoginComponent,
    BrowserModule,
    AppRoutingModule,
    HomeComponent,
    RouterOutlet,
    RegisterComponent,
    ReactiveFormsModule,
    StudentComponent,
    StudentNavBarComponent,
    DocumentsPageComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
