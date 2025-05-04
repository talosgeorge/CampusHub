import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  {
    path: 'students',
    loadComponent: () =>
      import('./components/student/student.component').then(m => m.StudentComponent)
  },

  {
    path: 'students/documents',
    loadComponent: () =>
      import('./features/documents/documents-page/documents-page.component').then(m => m.DocumentsPageComponent)
  },

  {
    path: 'students/grades',
    loadComponent: () => import('./features/grades/grades-page/grades-page.component').then(m => m.GradesPageComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
