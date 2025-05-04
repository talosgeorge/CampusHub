import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-nav-bar',
  standalone: false,
  templateUrl: './student-nav-bar.component.html',
  styleUrl: './student-nav-bar.component.scss'
})
export class StudentNavBarComponent {

  router = inject(Router);

  disconnect():void{
    localStorage.clear();
    this.router.navigateByUrl('/').then(() => {
      window.location.reload();
    });
  }
}
