import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { AuthInterceptor } from './components/Interceptor/auth.interceptor'
import { AcademicYearsComponent } from './components/admin/academic-years/academic-years.component'; // ✅ Importă interceptorul
import { provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
<<<<<<< HEAD
 
=======
>>>>>>> main
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
    GradesPageComponent,
<<<<<<< HEAD
    AppComponent
=======
    AppComponent,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000, // 5 secunde
      positionClass: 'toast-top-center', // vizibil sus, centrat
      preventDuplicates: true,
      closeButton: true,
      progressBar: true
    }),
>>>>>>> main
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideToastr()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
