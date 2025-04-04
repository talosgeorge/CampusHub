import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
  path: '',
  pathMatch: 'full',
  loadComponent: ()=>{
      return import('./components/home/home.component').then(m=>m.HomeComponent)
  }
  },
  {
    path: 'register',
    loadComponent: ()=> {
      return import('./components/register/register.component').then(m=>m.RegisterComponent)
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
