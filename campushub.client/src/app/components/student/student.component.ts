import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student',
  standalone: true,
  templateUrl: './student.component.html',
  styleUrl: './student.component.scss'
})
export class StudentComponent {

  router = inject(Router);

  disconnect():void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
