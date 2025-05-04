import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-nav-bar',
  standalone: true,
  templateUrl: './student-nav-bar.component.html',
  styleUrl: './student-nav-bar.component.scss',
  imports:[RouterModule,NgIf]
})
export class StudentNavBarComponent {

  router = inject(Router);
  dropDownOpen:boolean = false;

  toggleDropDown(){
    this.dropDownOpen = !this.dropDownOpen;
  }

  disconnect():void{
    localStorage.clear();
    this.router.navigateByUrl('/').then(() => {
      window.location.reload();
    });
  }
}
