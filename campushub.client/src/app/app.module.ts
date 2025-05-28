import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // ✅ Add HTTP_INTERCEPTORS
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RegisterComponent } from './features/auth/register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './features/auth/login/login.component';
import { StudentComponent } from './components/student/student.component';
import { StudentNavBarComponent } from './components/student/student-nav-bar/student-nav-bar.component';
import { DocumentsPageComponent } from './features/documents/documents-page/documents-page.component';
import { GradesPageComponent } from './features/grades/grades-page/grades-page.component';

import { AuthInterceptor } from './interceptors/auth.interceptor'; // ✅ Importă interceptorul

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterOutlet,
    ReactiveFormsModule,
    FormsModule,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    StudentComponent,
    StudentNavBarComponent,
    DocumentsPageComponent,
    GradesPageComponent
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
