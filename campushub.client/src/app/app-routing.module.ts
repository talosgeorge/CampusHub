import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './components/admin/admin-home/admin-home.component';

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
  },
  {
    path: 'admin',
    component: AdminHomeComponent,
    children: [
      { path: 'faculties', loadComponent: () => import('./components/admin/faculties/faculties.component').then(m => m.FacultiesComponent) },
      { path: 'grades', loadComponent: () => import('./components/admin/grades/grades.component').then(m => m.GradesComponent) },
      { path: 'subjects', loadComponent: () => import('./components/admin/subjects/subjects.component').then(m => m.SubjectsComponent) },
      { path: 'semesters', loadComponent: () => import('./components/admin/semesters/semesters.component').then(m => m.SemestersComponent) },
      { path: 'academic-years', loadComponent: () => import('./components/admin/academic-years/academic-years.component').then(m => m.AcademicYearsComponent) }
    ]
  },
  {
    path: 'students/details',
    loadComponent: () =>
      import('./features/details/user-details.component').then((m) => m.UserDetailsComponent)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
