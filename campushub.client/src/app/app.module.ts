import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { AuthInterceptor } from './core/auth.interceptor';


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
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
