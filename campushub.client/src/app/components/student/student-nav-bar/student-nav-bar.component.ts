import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule,RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-student-nav-bar',
  standalone: true,
  templateUrl: './student-nav-bar.component.html',
  styleUrl: './student-nav-bar.component.scss',
  imports: [RouterModule, NgIf, RouterLinkActive]
})
export class StudentNavBarComponent {

  router = inject(Router);
  dropDownOpen:boolean = false;
  username = '';
  avatarInitials = '';

  toggleDropDown(){
    this.dropDownOpen = !this.dropDownOpen;
  }

  ngOnInit(){
    this.username = localStorage.getItem("userName") || '';
    this.avatarInitials = this.username.substring(0,2).toUpperCase();
  }

  disconnect():void{
    localStorage.clear();
    this.router.navigateByUrl('/').then(() => {
      window.location.reload();
    });
  }
}
